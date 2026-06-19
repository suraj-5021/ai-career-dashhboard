import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';
import { isConnected } from '../config/db';
import { mockUsers } from '../config/mockStore';

const JWT_SECRET = process.env.JWT_SECRET || 'careeros_secret_key_123_456_789';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'careeros_refresh_key_987_654_321';

// Helper to generate tokens
const generateTokens = (user: { id: string; email: string; role: string }) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export async function register(req: AuthRequest, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (isConnected) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ success: false, message: 'User already exists' });
        return;
      }

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        isVerified: true // Set to true for quick starter demo experience
      });

      const { accessToken, refreshToken } = generateTokens({ id: user._id.toString(), email: user.email, role: user.role });
      res.status(201).json({
        success: true,
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileCompletion: user.profileCompletion,
          skills: user.skills,
          bio: user.bio,
          currentTitle: user.currentTitle,
          targetTitle: user.targetTitle,
          avatar: user.avatar
        }
      });
    } else {
      // Mock Fallback
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        res.status(400).json({ success: false, message: 'User already exists' });
        return;
      }

      const newUser = {
        _id: `mock_user_${Date.now()}`,
        name,
        email,
        password: hashedPassword,
        role: 'user',
        isVerified: true,
        profileCompletion: 20,
        skills: [],
        bio: '',
        currentTitle: 'Software Professional',
        targetTitle: 'Full Stack Engineer',
        avatar: '',
        createdAt: new Date()
      };

      mockUsers.push(newUser);

      const { accessToken, refreshToken } = generateTokens({ id: newUser._id, email: newUser.email, role: newUser.role });
      res.status(201).json({
        success: true,
        accessToken,
        refreshToken,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          profileCompletion: newUser.profileCompletion,
          skills: newUser.skills,
          bio: newUser.bio,
          currentTitle: newUser.currentTitle,
          targetTitle: newUser.targetTitle,
          avatar: newUser.avatar
        }
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function login(req: AuthRequest, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Please provide email and password' });
    return;
  }

  try {
    let user: any = null;

    if (isConnected) {
      user = await User.findOne({ email });
    } else {
      user = mockUsers.find(u => u.email === email);
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const userIdStr = isConnected ? user._id.toString() : user._id;
    const { accessToken, refreshToken } = generateTokens({ id: userIdStr, email: user.email, role: user.role });

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: userIdStr,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompletion: user.profileCompletion,
        skills: user.skills,
        bio: user.bio,
        currentTitle: user.currentTitle,
        targetTitle: user.targetTitle,
        avatar: user.avatar
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function refresh(req: AuthRequest, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ success: false, message: 'Refresh token is required' });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };
    let user: any = null;

    if (isConnected) {
      user = await User.findById(decoded.id);
    } else {
      user = mockUsers.find(u => u._id === decoded.id);
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid token user context' });
      return;
    }

    const userIdStr = isConnected ? user._id.toString() : user._id;
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      id: userIdStr,
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  try {
    let user: any = null;

    if (isConnected) {
      user = await User.findById(req.user.id).select('-password');
    } else {
      user = mockUsers.find(u => u._id === req.user?.id);
    }

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const userIdStr = isConnected ? user._id.toString() : user._id;

    res.json({
      success: true,
      user: {
        id: userIdStr,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompletion: user.profileCompletion,
        skills: user.skills,
        bio: user.bio,
        currentTitle: user.currentTitle,
        targetTitle: user.targetTitle,
        avatar: user.avatar
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  const { name, bio, currentTitle, targetTitle, skills } = req.body;

  try {
    if (isConnected) {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { name, bio, currentTitle, targetTitle, skills, profileCompletion: 85 } },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.json({
        success: true,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          profileCompletion: updatedUser.profileCompletion,
          skills: updatedUser.skills,
          bio: updatedUser.bio,
          currentTitle: updatedUser.currentTitle,
          targetTitle: updatedUser.targetTitle,
          avatar: updatedUser.avatar
        }
      });
    } else {
      const idx = mockUsers.findIndex(u => u._id === req.user?.id);
      if (idx === -1) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      mockUsers[idx] = {
        ...mockUsers[idx],
        name: name || mockUsers[idx].name,
        bio: bio !== undefined ? bio : mockUsers[idx].bio,
        currentTitle: currentTitle || mockUsers[idx].currentTitle,
        targetTitle: targetTitle || mockUsers[idx].targetTitle,
        skills: skills || mockUsers[idx].skills,
        profileCompletion: 85
      };

      const user = mockUsers[idx];
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileCompletion: user.profileCompletion,
          skills: user.skills,
          bio: user.bio,
          currentTitle: user.currentTitle,
          targetTitle: user.targetTitle,
          avatar: user.avatar
        }
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

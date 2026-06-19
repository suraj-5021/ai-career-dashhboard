import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Notification from '../models/Notification';
import { isConnected } from '../config/db';
import { mockNotifications } from '../config/mockStore';

export async function getNotifications(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  try {
    if (isConnected) {
      const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
      res.json({ success: true, data: notifications });
    } else {
      const notifications = mockNotifications.filter(n => n.userId === req.user?.id);
      res.json({ success: true, data: notifications });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function markAsRead(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  const { id } = req.params;

  try {
    if (isConnected) {
      const notification = await Notification.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { $set: { read: true } },
        { new: true }
      );
      if (!notification) {
        res.status(404).json({ success: false, message: 'Notification not found' });
        return;
      }
      res.json({ success: true, data: notification });
    } else {
      const idx = mockNotifications.findIndex(n => n._id === id && n.userId === req.user?.id);
      if (idx === -1) {
        res.status(404).json({ success: false, message: 'Notification not found' });
        return;
      }
      mockNotifications[idx].read = true;
      res.json({ success: true, data: mockNotifications[idx] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function markAllAsRead(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  try {
    if (isConnected) {
      await Notification.updateMany({ userId: req.user.id }, { $set: { read: true } });
      res.json({ success: true, message: 'All notifications marked as read' });
    } else {
      mockNotifications.forEach(n => {
        if (n.userId === req.user?.id) {
          n.read = true;
        }
      });
      res.json({ success: true, message: 'All notifications marked as read' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Question from '../models/Question';
import { isConnected } from '../config/db';
import { mockQuestions } from '../config/mockStore';

export async function getQuestions(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  try {
    if (isConnected) {
      let questions = await Question.find({ userId: req.user.id });
      // If empty, seed some initial questions for the user
      if (questions.length === 0) {
        const seedQuestions = [
          {
            userId: req.user.id,
            question: 'What are the main advantages of React 19 Server Components over standard Client Components?',
            category: 'Technical',
            difficulty: 'Medium',
            suggestedAnswer: 'Server Components execute on the server, resulting in zero bundle size footprint for clients, direct database/server resource access, faster initial page load times, and improved SEO.',
            isCompleted: false
          },
          {
            userId: req.user.id,
            question: 'Tell me about a time you had to deal with ambiguous requirements. How did you proceed?',
            category: 'Behavioral',
            difficulty: 'Medium',
            suggestedAnswer: 'Discuss gathering stakeholders, drafting a brief design document or proof-of-concept, establishing rapid feedback loops, making logical assumptions, and iteratively refining them based on feedback.',
            isCompleted: false
          }
        ];
        questions = await Question.insertMany(seedQuestions);
      }
      res.json({ success: true, data: questions });
    } else {
      let questions = mockQuestions.filter(q => q.userId === req.user?.id);
      if (questions.length === 0) {
        // Seed default ones for new mock users
        const newQuestions = [
          {
            _id: `mock_q_1_${Date.now()}`,
            userId: req.user.id,
            question: 'What are the main advantages of React 19 Server Components over standard Client Components?',
            category: 'Technical',
            difficulty: 'Medium',
            suggestedAnswer: 'Server Components execute on the server, resulting in zero bundle size footprint for clients, direct database/server resource access, faster initial page load times, and improved SEO.',
            userAnswer: '',
            feedback: '',
            score: 0,
            isCompleted: false,
            createdAt: new Date()
          },
          {
            _id: `mock_q_2_${Date.now()}`,
            userId: req.user.id,
            question: 'Tell me about a time you had to deal with ambiguous requirements. How did you proceed?',
            category: 'Behavioral',
            difficulty: 'Medium',
            suggestedAnswer: 'Discuss gathering stakeholders, drafting a brief design document or proof-of-concept, establishing rapid feedback loops, making logical assumptions, and iteratively refining them based on feedback.',
            userAnswer: '',
            feedback: '',
            score: 0,
            isCompleted: false,
            createdAt: new Date()
          }
        ];
        mockQuestions.push(...newQuestions);
        questions = newQuestions;
      }
      res.json({ success: true, data: questions });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function submitAnswer(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  const { id } = req.params;
  const { userAnswer } = req.body;

  if (!userAnswer) {
    res.status(400).json({ success: false, message: 'Answer content is required' });
    return;
  }

  try {
    // Determine quality of the answer and give simulated AI feedback
    const words = userAnswer.trim().split(/\s+/).length;
    let score = 50;
    let feedback = 'Your answer is a bit short. Try expanding it with specific technical keywords, real-world examples, or metrics.';
    
    if (words > 20) {
      score = 75;
      feedback = 'Solid response. You addressed the core question directly. To elevate this answer, mention how you measure success or specific edge cases you have encountered.';
    }
    if (words > 50) {
      score = 90;
      feedback = 'Outstanding. Excellent detail, clear structure, and strong professional context. The explanation demonstrates robust familiarity with the topic.';
    }

    if (isConnected) {
      const question = await Question.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { $set: { userAnswer, feedback, score, isCompleted: true } },
        { new: true }
      );
      if (!question) {
        res.status(404).json({ success: false, message: 'Question not found' });
        return;
      }
      res.json({ success: true, data: question });
    } else {
      const idx = mockQuestions.findIndex(q => q._id === id && q.userId === req.user?.id);
      if (idx === -1) {
        res.status(404).json({ success: false, message: 'Question not found' });
        return;
      }
      mockQuestions[idx] = {
        ...mockQuestions[idx],
        userAnswer,
        feedback,
        score,
        isCompleted: true
      };
      res.json({ success: true, data: mockQuestions[idx] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
export async function addQuestion(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  const { question, category, difficulty, suggestedAnswer } = req.body;

  if (!question || !category || !suggestedAnswer) {
    res.status(400).json({ success: false, message: 'Question, Category and Suggested Answer are required' });
    return;
  }

  try {
    if (isConnected) {
      const newQuestion = await Question.create({
        userId: req.user.id,
        question,
        category,
        difficulty: difficulty || 'Medium',
        suggestedAnswer,
        isCompleted: false
      });
      res.status(201).json({ success: true, data: newQuestion });
    } else {
      const newMockQ = {
        _id: `mock_q_custom_${Date.now()}`,
        userId: req.user.id,
        question,
        category,
        difficulty: difficulty || 'Medium',
        suggestedAnswer,
        userAnswer: '',
        feedback: '',
        score: 0,
        isCompleted: false,
        createdAt: new Date()
      };
      mockQuestions.push(newMockQ);
      res.status(201).json({ success: true, data: newMockQ });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

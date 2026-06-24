import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Question from '../models/Question';
import User from '../models/User';
import { isConnected } from '../config/db';
import { mockQuestions, mockUsers } from '../config/mockStore';
import { questionBank } from '../config/questionBank';

// Semantic Answer Scoring Algorithm
export function gradeUserAnswer(
  userAnswer: string, 
  suggestedAnswer: string, 
  category: string, 
  difficulty: string
): { score: number; feedback: string } {
  const answer = userAnswer.trim();
  const lowerAnswer = answer.toLowerCase();

  // 1. Check for "don't know" or extremely short answers
  const dontKnowPhrases = ["i don't know", "i dont know", "no idea", "not sure", "don't know", "dunno", "skip", "have no idea", "no clue"];
  const isDontKnow = dontKnowPhrases.some(phrase => lowerAnswer.includes(phrase));
  const wordCount = answer.split(/\s+/).filter(Boolean).length;

  if (isDontKnow || wordCount < 5) {
    return {
      score: 10,
      feedback: "Your response is too brief or indicates you aren't familiar with this topic. In a real interview, if you don't know the exact answer, try explaining related foundational concepts, your general troubleshooting approach, or ask clarifying questions rather than just saying you don't know."
    };
  }

  // 2. Length Score (Max 25 points)
  let lengthScore = 0;
  if (wordCount >= 40) lengthScore = 25;
  else if (wordCount >= 25) lengthScore = 18;
  else if (wordCount >= 10) lengthScore = 10;
  else lengthScore = 5;

  // 3. Keyword Match Score (Max 35 points)
  // Extract key terms from the suggested answer
  const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'is', 'that', 'it', 'for', 'on', 'with', 'as', 'this', 'by', 'an', 'be', 'are', 'which', 'or']);
  const cleanSuggestedWords = suggestedAnswer
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
  
  // Unique keywords in suggested answer
  const uniqueKeywords = Array.from(new Set(cleanSuggestedWords));
  let matchedKeywords = 0;
  uniqueKeywords.forEach(kw => {
    if (lowerAnswer.includes(kw)) matchedKeywords++;
  });

  const keywordRatio = uniqueKeywords.length > 0 ? matchedKeywords / uniqueKeywords.length : 0.5;
  const keywordScore = Math.round(keywordRatio * 35);

  // 4. Technical Depth & Clarity indicators (Max 25 points)
  // Check for explanatory transition words or technical indicators
  const connectors = ['because', 'therefore', 'contrast', 'example', 'optimize', 'scalability', 'performance', 'latency', 'mitigate', 'implement', 'configure', 'architecture', 'caching', 'index'];
  let connectorMatches = 0;
  connectors.forEach(word => {
    if (lowerAnswer.includes(word)) connectorMatches++;
  });
  const depthScore = Math.min(25, (connectorMatches * 5) + (difficulty === 'Hard' ? 5 : 10));

  // 5. Grammar/Clarity (Max 15 points)
  // Check if sentences are terminated with periods and formatted nicely
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let clarityScore = 5;
  if (sentences.length >= 2) clarityScore = 15;
  else if (sentences.length === 1 && answer.includes(',')) clarityScore = 10;

  // Calculate final score
  let finalScore = lengthScore + keywordScore + depthScore + clarityScore;
  finalScore = Math.min(100, Math.max(15, finalScore));

  // 6. Generate detailed dynamic feedback
  let feedback = "";
  if (finalScore >= 85) {
    feedback = `Excellent response! You scored ${finalScore}/100. Your answer shows strong technical depth, covers key concepts like "${uniqueKeywords.slice(0, 3).join(', ')}", and is well structured. You effectively addressed the ${category} criteria at a ${difficulty} level.`;
  } else if (finalScore >= 70) {
    feedback = `Good job. You scored ${finalScore}/100. You covered many important points and detailed the context directly. To reach an outstanding rating (85+), expand on technical details or give a concrete example of how you would implement or troubleshoot this in production.`;
  } else if (finalScore >= 45) {
    feedback = `Fair attempt. You scored ${finalScore}/100. Your response covers the basic elements, but lacks depth or key keywords. Consider studying the blueprint answer key and adding terms like "${uniqueKeywords.slice(0, 3).filter(k => !lowerAnswer.includes(k)).join(', ') || 'related frameworks'}".`;
  } else {
    feedback = `Your response scored ${finalScore}/100 and needs improvement. It is a bit too brief or misses critical technical aspects of the question. Review the suggested blueprint answer, expand your explanations using the STAR method, and practice defining the underlying core mechanics.`;
  }

  return { score: finalScore, feedback };
}

export async function getQuestions(req: AuthRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authorized' });
    return;
  }

  const userId = req.user.id;
  const isSession = req.query.session === 'true';
  const requestedDomain = req.query.domain as string || '';

  try {
    let targetTitle = 'Software Engineer';
    if (isConnected) {
      const userDoc = await User.findById(userId);
      if (userDoc) targetTitle = userDoc.targetTitle || 'Software Engineer';
    } else {
      const userDoc = mockUsers.find(u => u._id === userId || u.id === userId);
      if (userDoc) targetTitle = userDoc.targetTitle || 'Software Engineer';
    }

    // Determine domain from targetTitle if not explicitly requested
    let domain: 'Frontend' | 'Backend' | 'DevOps' | 'Data Analyst' | 'Cyber Security' | 'MERN Developer' = 'Frontend';
    const t = (requestedDomain || targetTitle).toLowerCase();
    if (t.includes('devops') || t.includes('infrastructure') || t.includes('cloud')) {
      domain = 'DevOps';
    } else if (t.includes('backend') || t.includes('system') || t.includes('database')) {
      domain = 'Backend';
    } else if (t.includes('data') || t.includes('analyst') || t.includes('statistics')) {
      domain = 'Data Analyst';
    } else if (t.includes('security') || t.includes('cyber') || t.includes('owasp')) {
      domain = 'Cyber Security';
    } else if (t.includes('mern') || t.includes('full stack') || t.includes('fullstack')) {
      domain = 'MERN Developer';
    } else {
      domain = 'Frontend';
    }

    if (isSession) {
      // Generate a randomized set of 10 questions: 6 Technical, 2 HR, 2 Aptitude
      let technicalPool = questionBank.filter(q => q.category === 'Technical');
      if (domain === 'MERN Developer') {
        technicalPool = technicalPool.filter(q => q.domain === 'Frontend' || q.domain === 'Backend');
      } else {
        technicalPool = technicalPool.filter(q => q.domain === domain);
      }

      const hrPool = questionBank.filter(q => q.category === 'HR');
      const aptitudePool = questionBank.filter(q => q.category === 'Aptitude');

      // Helper to shuffle and pick N items
      const pickRandom = (pool: any[], n: number) => {
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
      };

      const selectedTech = pickRandom(technicalPool, 6);
      const selectedHR = pickRandom(hrPool, 2);
      const selectedApt = pickRandom(aptitudePool, 2);

      const sessionQuestions = [...selectedTech, ...selectedHR, ...selectedApt].map((q, idx) => ({
        userId,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        suggestedAnswer: q.suggestedAnswer,
        userAnswer: '',
        feedback: '',
        score: 0,
        isCompleted: false,
        createdAt: new Date(Date.now() + idx * 1000)
      }));

      if (isConnected) {
        // Clear previous incomplete session questions to avoid bloat
        await Question.deleteMany({ userId, isCompleted: false });
        const saved = await Question.insertMany(sessionQuestions);
        res.json({ success: true, data: saved });
      } else {
        // Filter out incomplete session questions from mock store
        let filterCount = 0;
        mockQuestions.forEach((q, i) => {
          if (q.userId === userId && !q.isCompleted) {
            filterCount++;
          }
        });
        
        // Remove previous incomplete questions for this user
        for (let i = mockQuestions.length - 1; i >= 0; i--) {
          if (mockQuestions[i].userId === userId && !mockQuestions[i].isCompleted) {
            mockQuestions.splice(i, 1);
          }
        }

        const enrichedMocks = sessionQuestions.map((q, idx) => ({
          ...q,
          _id: `mock_session_q_${idx}_${Date.now()}`
        }));
        mockQuestions.push(...enrichedMocks);
        res.json({ success: true, data: enrichedMocks });
      }
    } else {
      // Normal fetch of questions pool
      if (isConnected) {
        let questions = await Question.find({ userId }).sort({ createdAt: -1 });
        if (questions.length === 0) {
          const initialPool = questionBank.filter(q => q.domain === domain || q.domain === 'General').slice(0, 5);
          const seeds = initialPool.map(q => ({
            userId,
            question: q.question,
            category: q.category,
            difficulty: q.difficulty,
            suggestedAnswer: q.suggestedAnswer,
            userAnswer: '',
            feedback: '',
            score: 0,
            isCompleted: false
          }));
          questions = await Question.insertMany(seeds);
        }
        res.json({ success: true, data: questions });
      } else {
        let questions = mockQuestions.filter(q => q.userId === userId);
        if (questions.length === 0) {
          const initialPool = questionBank.filter(q => q.domain === domain || q.domain === 'General').slice(0, 5);
          const seeds = initialPool.map((q, idx) => ({
            _id: `mock_q_seeded_${idx}_${Date.now()}`,
            userId,
            question: q.question,
            category: q.category,
            difficulty: q.difficulty,
            suggestedAnswer: q.suggestedAnswer,
            userAnswer: '',
            feedback: '',
            score: 0,
            isCompleted: false,
            createdAt: new Date()
          }));
          mockQuestions.push(...seeds);
          questions = seeds;
        }
        res.json({ success: true, data: questions });
      }
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
    let questionDoc: any;
    if (isConnected) {
      questionDoc = await Question.findOne({ _id: id, userId: req.user.id });
    } else {
      questionDoc = mockQuestions.find(q => q._id === id && q.userId === req.user?.id);
    }

    if (!questionDoc) {
      res.status(404).json({ success: false, message: 'Question not found' });
      return;
    }

    // Grade response using the semantic answer scoring algorithm
    const evaluation = gradeUserAnswer(
      userAnswer,
      questionDoc.suggestedAnswer,
      questionDoc.category,
      questionDoc.difficulty
    );

    if (isConnected) {
      const updated = await Question.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { $set: { userAnswer, feedback: evaluation.feedback, score: evaluation.score, isCompleted: true } },
        { new: true }
      );
      res.json({ success: true, data: updated });
    } else {
      const idx = mockQuestions.findIndex(q => q._id === id && q.userId === req.user?.id);
      mockQuestions[idx] = {
        ...mockQuestions[idx],
        userAnswer,
        feedback: evaluation.feedback,
        score: evaluation.score,
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

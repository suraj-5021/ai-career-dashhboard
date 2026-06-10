import mongoose, { Schema } from 'mongoose';

const QuestionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  category: { type: String, required: true }, // e.g. "Behavioral", "Technical", "System Design"
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  suggestedAnswer: { type: String, required: true },
  userAnswer: { type: String, default: '' },
  feedback: { type: String, default: '' },
  score: { type: Number, min: 0, max: 100, default: 0 },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);

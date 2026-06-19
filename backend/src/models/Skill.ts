import mongoose, { Schema } from 'mongoose';

const SkillSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  level: { type: Number, min: 0, max: 100, default: 10 },
  targetLevel: { type: Number, min: 0, max: 100, default: 80 },
  category: { type: String, required: true }, // e.g., "Frontend", "Backend", "AI", "DevOps"
  certifications: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);

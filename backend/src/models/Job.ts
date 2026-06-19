import mongoose, { Schema } from 'mongoose';

const InterviewStageSchema = new Schema({
  stage: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String, default: '' }
});

const JobSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
  status: { type: String, enum: ['applied', 'interviewing', 'offered', 'rejected'], default: 'applied' },
  dateApplied: { type: Date, default: Date.now },
  salaryRange: { type: String, default: '' },
  location: { type: String, default: '' },
  jobType: { type: String, enum: ['Remote', 'Hybrid', 'Onsite'], default: 'Remote' },
  notes: { type: String, default: '' },
  interviews: [InterviewStageSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);

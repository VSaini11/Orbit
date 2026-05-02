import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Engineering', 'AI Research', 'Product Design', 'Customer Success', 'Marketing', 'Operations'],
  },
  type: {
    type: String,
    required: [true, 'Please provide job type'],
    default: 'Full-time',
  },
  location: {
    type: String,
    default: 'Remote',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);

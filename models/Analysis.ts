import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysis extends Document {
  projectId: mongoose.Types.ObjectId;
  result: any;
  sourceType: 'file' | 'github';
  sourceName: string;
  createdAt: Date;
}

const AnalysisSchema: Schema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    result: { type: Schema.Types.Mixed, required: true },
    sourceType: { type: String, enum: ['file', 'github'], required: true },
    sourceName: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Analysis || mongoose.model<IAnalysis>('Analysis', AnalysisSchema);

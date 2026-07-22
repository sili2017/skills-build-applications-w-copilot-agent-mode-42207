import mongoose, { InferSchemaType, model } from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: false },
    type: {
      type: String,
      enum: ['run', 'cycle', 'strength', 'yoga', 'hiit', 'swim'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    performedAt: { type: Date, required: true },
    notes: { type: String, required: false, trim: true },
  },
  { timestamps: true },
);

export type ActivityDocument = InferSchemaType<typeof activitySchema>;
export const ActivityModel = model<ActivityDocument>('Activity', activitySchema);

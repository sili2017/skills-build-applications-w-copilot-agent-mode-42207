import mongoose, { InferSchemaType, model } from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['strength', 'endurance', 'mobility', 'recovery', 'cardio'],
      required: true,
    },
    targetMuscleGroups: [{ type: String, required: true, trim: true }],
    estimatedMinutes: { type: Number, required: true, min: 1 },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    completed: { type: Boolean, required: true, default: false },
    scheduledFor: { type: Date, required: true },
  },
  { timestamps: true },
);

export type WorkoutDocument = InferSchemaType<typeof workoutSchema>;
export const WorkoutModel = model<WorkoutDocument>('Workout', workoutSchema);

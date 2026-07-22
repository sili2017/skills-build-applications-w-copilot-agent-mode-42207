import mongoose, { InferSchemaType, model } from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    captain: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    totalPoints: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true },
);

export type TeamDocument = InferSchemaType<typeof teamSchema>;
export const TeamModel = model<TeamDocument>('Team', teamSchema);

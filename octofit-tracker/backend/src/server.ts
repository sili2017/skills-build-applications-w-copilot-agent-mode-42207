import express from 'express';
import { connectDatabase } from './config/database';
import { ActivityModel } from './models/activity.model';
import { LeaderboardModel } from './models/leaderboard.model';
import { TeamModel } from './models/team.model';
import { UserModel } from './models/user.model';
import { WorkoutModel } from './models/workout.model';

const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (_req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', baseUrl });
});

app.get('/api/', (_req, res) => {
  res.json({
    message: 'OctoFit Tracker API',
    baseUrl,
    endpoints: {
      users: `${baseUrl}/api/users/`,
      teams: `${baseUrl}/api/teams/`,
      activities: `${baseUrl}/api/activities/`,
      leaderboard: `${baseUrl}/api/leaderboard/`,
      workouts: `${baseUrl}/api/workouts/`,
    },
  });
});

app.get('/api/users/', async (_req, res) => {
  try {
    const users = await UserModel.find().sort({ totalPoints: -1, createdAt: 1 }).lean();
    res.json({ resource: 'users', count: users.length, items: users, baseUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: String(error) });
  }
});

app.get('/api/teams/', async (_req, res) => {
  try {
    const teams = await TeamModel.find()
      .populate('captain', 'username fullName')
      .populate('members', 'username fullName')
      .sort({ totalPoints: -1, createdAt: 1 })
      .lean();
    res.json({ resource: 'teams', count: teams.length, items: teams, baseUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams', details: String(error) });
  }
});

app.get('/api/activities/', async (_req, res) => {
  try {
    const activities = await ActivityModel.find()
      .populate('user', 'username fullName')
      .populate('team', 'name')
      .sort({ performedAt: -1 })
      .lean();
    res.json({ resource: 'activities', count: activities.length, items: activities, baseUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities', details: String(error) });
  }
});

app.get('/api/leaderboard/', async (_req, res) => {
  try {
    const leaderboard = await LeaderboardModel.findOne()
      .populate('entries.user', 'username fullName totalPoints')
      .sort({ endsAt: -1, createdAt: -1 })
      .lean();
    res.json({ resource: 'leaderboard', item: leaderboard, baseUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard', details: String(error) });
  }
});

app.get('/api/workouts/', async (_req, res) => {
  try {
    const workouts = await WorkoutModel.find()
      .populate('user', 'username fullName fitnessLevel')
      .sort({ scheduledFor: 1, createdAt: -1 })
      .lean();
    res.json({ resource: 'workouts', count: workouts.length, items: workouts, baseUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workouts', details: String(error) });
  }
});

async function startServer(): Promise<void> {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`OctoFit backend running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start API server:', error);
    process.exit(1);
  }
}

startServer();

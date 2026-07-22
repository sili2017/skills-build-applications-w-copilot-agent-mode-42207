import { connectDatabase, disconnectDatabase } from '../config/database';
import { ActivityModel } from '../models/activity.model';
import { LeaderboardModel } from '../models/leaderboard.model';
import { TeamModel } from '../models/team.model';
import { UserModel } from '../models/user.model';
import { WorkoutModel } from '../models/workout.model';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    console.log('Seed the octofit_db database with test data');
    console.log('Clearing existing test collections...');

    await Promise.all([
      UserModel.deleteMany({}),
      TeamModel.deleteMany({}),
      ActivityModel.deleteMany({}),
      LeaderboardModel.deleteMany({}),
      WorkoutModel.deleteMany({}),
    ]);

    const users = await UserModel.insertMany([
      {
        username: 'maya_fit',
        email: 'maya.fit@example.com',
        fullName: 'Maya Patel',
        fitnessLevel: 'intermediate',
        weeklyGoalMinutes: 240,
        totalPoints: 980,
      },
      {
        username: 'liam_lifts',
        email: 'liam.lifts@example.com',
        fullName: 'Liam Johnson',
        fitnessLevel: 'advanced',
        weeklyGoalMinutes: 300,
        totalPoints: 1120,
      },
      {
        username: 'zoe_runner',
        email: 'zoe.runner@example.com',
        fullName: 'Zoe Martinez',
        fitnessLevel: 'intermediate',
        weeklyGoalMinutes: 270,
        totalPoints: 1040,
      },
      {
        username: 'noah_newbie',
        email: 'noah.newbie@example.com',
        fullName: 'Noah Campbell',
        fitnessLevel: 'beginner',
        weeklyGoalMinutes: 180,
        totalPoints: 620,
      },
    ]);

    const [maya, liam, zoe, noah] = users;

    const teams = await TeamModel.insertMany([
      {
        name: 'Stride Squad',
        description: 'Cardio-focused team training for weekly distance goals.',
        captain: zoe._id,
        members: [zoe._id, maya._id],
        totalPoints: 2020,
      },
      {
        name: 'Iron Alliance',
        description: 'Strength and conditioning with progressive overload plans.',
        captain: liam._id,
        members: [liam._id, noah._id],
        totalPoints: 1740,
      },
    ]);

    const [strideSquad, ironAlliance] = teams;

    await ActivityModel.insertMany([
      {
        user: maya._id,
        team: strideSquad._id,
        type: 'cycle',
        durationMinutes: 55,
        caloriesBurned: 510,
        performedAt: new Date('2026-07-18T07:30:00.000Z'),
        notes: 'Hill intervals in zone 4 effort.',
      },
      {
        user: liam._id,
        team: ironAlliance._id,
        type: 'strength',
        durationMinutes: 70,
        caloriesBurned: 620,
        performedAt: new Date('2026-07-19T17:10:00.000Z'),
        notes: 'Upper-body hypertrophy day with tempo bench presses.',
      },
      {
        user: zoe._id,
        team: strideSquad._id,
        type: 'run',
        durationMinutes: 48,
        caloriesBurned: 460,
        performedAt: new Date('2026-07-20T06:45:00.000Z'),
        notes: '10k progression run, negative split.',
      },
      {
        user: noah._id,
        team: ironAlliance._id,
        type: 'yoga',
        durationMinutes: 35,
        caloriesBurned: 140,
        performedAt: new Date('2026-07-21T19:20:00.000Z'),
        notes: 'Mobility-focused session after beginner strength block.',
      },
    ]);

    await WorkoutModel.insertMany([
      {
        user: maya._id,
        title: 'Threshold Bike Session',
        category: 'endurance',
        targetMuscleGroups: ['quads', 'hamstrings', 'glutes'],
        estimatedMinutes: 60,
        difficulty: 'intermediate',
        completed: false,
        scheduledFor: new Date('2026-07-23T07:00:00.000Z'),
      },
      {
        user: liam._id,
        title: 'Push Pull Strength Split',
        category: 'strength',
        targetMuscleGroups: ['chest', 'back', 'shoulders'],
        estimatedMinutes: 75,
        difficulty: 'advanced',
        completed: false,
        scheduledFor: new Date('2026-07-23T17:30:00.000Z'),
      },
      {
        user: zoe._id,
        title: 'Tempo Run + Core Stability',
        category: 'cardio',
        targetMuscleGroups: ['core', 'calves', 'glutes'],
        estimatedMinutes: 50,
        difficulty: 'intermediate',
        completed: true,
        scheduledFor: new Date('2026-07-22T06:30:00.000Z'),
      },
      {
        user: noah._id,
        title: 'Beginner Full-Body Circuit',
        category: 'strength',
        targetMuscleGroups: ['legs', 'core', 'arms'],
        estimatedMinutes: 40,
        difficulty: 'beginner',
        completed: false,
        scheduledFor: new Date('2026-07-24T18:00:00.000Z'),
      },
    ]);

    await LeaderboardModel.create({
      periodLabel: 'Week of Jul 20, 2026',
      startsAt: new Date('2026-07-20T00:00:00.000Z'),
      endsAt: new Date('2026-07-26T23:59:59.000Z'),
      entries: [
        { user: liam._id, points: 1120, rank: 1 },
        { user: zoe._id, points: 1040, rank: 2 },
        { user: maya._id, points: 980, rank: 3 },
        { user: noah._id, points: 620, rank: 4 },
      ],
    });

    console.log('Database seeding complete');
    await disconnectDatabase();
  } catch (error) {
    console.error('Error seeding database:', error);
    await disconnectDatabase();
    process.exit(1);
  }
}

seedDatabase();

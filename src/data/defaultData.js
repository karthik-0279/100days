export const TOTAL_DAYS = 100;
export const WATER_GOAL_ML = 3500; // 3.5 Liters target
export const GLASS_SIZE_ML = 250; // 250ml per glass (14 glasses = 3.5L)

export const MOTIVATIONAL_QUOTES = [
  "Small daily habits beat once-in-a-while heroic efforts. Day by day, you conquer 100.",
  "Discipline is choosing between what you want now and what you want most.",
  "You don't have to be extreme, just consistent. 100 days of consistency will transform you.",
  "Your morning run sets the tone for your victory throughout the day.",
  "Hydration is fuel. A well-hydrated body is a high-performing engine.",
  "Action precedes motivation. Put your running shoes on first, the drive will follow.",
  "Every drop of water and every step walked builds the new version of you.",
  "Consistency is the code that unlocks physical resilience.",
  "Win the morning with your workout and hydration, win the entire day.",
  "100 days from now, you will thank yourself for not stopping today."
];

export const getInitialDayState = (dayNumber) => {
  return {
    day: dayNumber,
    date: new Date(Date.now() + (dayNumber - 1) * 86400000).toISOString().split('T')[0],
    
    // Core Active Trackers
    morningRunWalk: {
      completed: false,
      type: 'Brisk Walk & Jog', // 'Brisk Walk', 'Morning Run', 'Interval Walk & Run'
      distanceKm: 4.0,
      durationMin: 35,
      steps: 5500,
      time: '06:30 AM',
      notes: ''
    },
    waterIntake: {
      completed: false,
      amountMl: 0,
      targetMl: WATER_GOAL_ML,
      glasses: 0,
      targetGlasses: Math.round(WATER_GOAL_ML / GLASS_SIZE_ML)
    },

    completedCount: 0,
    isDayComplete: false
  };
};

export const createDefault100Days = () => {
  const days = [];
  for (let i = 1; i <= TOTAL_DAYS; i++) {
    days.push(getInitialDayState(i));
  }

  // Pre-fill Day 1 as active example
  days[0].morningRunWalk.completed = true;
  days[0].morningRunWalk.distanceKm = 4.5;
  days[0].morningRunWalk.durationMin = 40;
  days[0].morningRunWalk.steps = 6200;
  days[0].waterIntake.amountMl = 3500;
  days[0].waterIntake.glasses = 14;
  days[0].waterIntake.completed = true;
  days[0].completedCount = 2;
  days[0].isDayComplete = true;

  return days;
};

export const initial100DaysData = createDefault100Days();

export const calculateDayScore = (dayData) => {
  if (!dayData) return { count: 0, total: 2, percent: 0, isComplete: false };
  let count = 0;
  if (dayData.morningRunWalk?.completed || dayData.walkRun?.completed) count++;
  if (
    dayData.waterIntake?.completed ||
    (dayData.waterIntake?.amountMl >= (dayData.waterIntake?.targetMl || WATER_GOAL_ML)) ||
    (dayData.waterIntake?.glasses >= 14)
  ) count++;
  
  const total = 2;
  const percent = Math.round((count / total) * 100);
  return {
    count,
    total,
    percent,
    isComplete: count === total,
    valueOf: () => count,
    toString: () => count.toString()
  };
};

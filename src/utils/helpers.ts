import { getWeek } from 'date-fns';

export const getCurrentWeekNumber = (): number => {
  return getWeek(new Date());
};

export const filterChallengesByWeek = (challenges: any[], week: number) => {
  // Try to find challenges for the specific week
  const weekChallenges = challenges.filter(c => parseInt(c.week) === week);
  
  // If we have at least 4, return them
  if (weekChallenges.length >= 4) {
    return weekChallenges.slice(0, 4); // Take first 4 if more
  }
  
  // Fallback: Random 4 where random is TRUE
  const randomChallenges = challenges.filter(c => 
    c.random && c.random.toString().toLowerCase() === 'true'
  );

  const shuffled = [...randomChallenges].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
};


export const AppScreens = {
  Home: "home",
  Challenges: "challenges",
  Friends: "friends",
  Profile: "profile",
} as const;

export type AppScreens = keyof typeof AppScreens;

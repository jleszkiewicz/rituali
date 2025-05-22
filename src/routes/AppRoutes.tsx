export const AppRoutes = {
  Home: "/(tabs)/home",
  Challenges: "/(tabs)/challenges",
  Friends: "/(tabs)/friends",
  Profile: "/(tabs)/profile",
} as const;

export type AppRoutes = keyof typeof AppRoutes;

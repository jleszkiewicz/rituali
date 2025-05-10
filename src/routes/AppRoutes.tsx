export const AppRoutes = {
  Home: "/(tabs)/home",
  Challenges: "/(tabs)/challenges",
} as const;

export type AppRoutes = keyof typeof AppRoutes;

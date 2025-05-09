export const Fonts = {
  regular: 'Poppins',
  bold: 'Poppins-Bold',
} as const;

export const FontStyles = {
  regular: {
    fontFamily: Fonts.regular,
  },
  bold: {
    fontFamily: Fonts.bold,
  },
} as const; 
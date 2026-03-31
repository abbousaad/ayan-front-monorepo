export const brandColors = {
  black: '#000000',
  logoGreen: '#1f6446',
  white: '#ffffff'
} as const;

export type BrandColorName = keyof typeof brandColors;

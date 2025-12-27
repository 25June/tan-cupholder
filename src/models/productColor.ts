export interface ProductColor {
  id: string;
  product_id: string;
  color_hex: string; // Hex value from PASTEL_COLORS
  created_at?: string;
}

// Available colors for product color picker
export const PRODUCT_COLORS = [
  { name: 'Red', hex: '#FF0000' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Green', hex: '#008000' },
  { name: 'Violet', hex: '#800080' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Blue-Green', hex: '#00CED1' }
] as const;

export type ProductColorHex = (typeof PRODUCT_COLORS)[number]['hex'];

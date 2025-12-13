'use client';

import { ProductResponse } from '@/models/product';
import SpecialCard from './SpecialCard';

interface CardProps {
  readonly item: ProductResponse;
}

export default function Card({ item }: CardProps) {
  return <SpecialCard item={item} />;
}

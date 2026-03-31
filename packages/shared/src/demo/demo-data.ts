import type { DemoCategory, DemoRecord } from '../types/demo';

export const DEMO_CATEGORIES: DemoCategory[] = ['starter', 'advanced'];

export const demoRecords: DemoRecord[] = [
  {
    id: 'starter-score',
    label: 'Starter score',
    value: 12.5,
    category: 'starter'
  },
  {
    id: 'advanced-score',
    label: 'Advanced score',
    value: 24.75,
    category: 'advanced'
  }
];

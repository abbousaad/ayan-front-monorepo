export type DemoCategory = 'starter' | 'advanced';

export type DemoRecord = {
  id: string;
  label: string;
  value: number;
  category: DemoCategory;
};

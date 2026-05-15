import { LucideIcon } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: 'AI' | 'Dev' | 'Media' | 'Education' | 'Utility' | 'Network' | 'Text' | 'Math';
  path: string;
}

export type Category = Tool['category'];

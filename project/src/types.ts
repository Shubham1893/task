export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export type SortBy = 'date' | 'priority' | 'status';
export type FilterBy = 'all' | 'todo' | 'in-progress' | 'completed';
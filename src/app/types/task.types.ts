export type Task = {
  taskId?: number;
  task_name: string;
  description: string;
  expected_start_date: string; 
  expected_working_hours: number;
  hourly_rate: number;
  rate_currency: string;
  category: string;
  task_completed?: boolean;
  createdBy?: string;
  userId?: string;
  providerId?: string;
  skillId?: number;
};
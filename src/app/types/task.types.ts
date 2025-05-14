export type TaskValues = {
  id?: string;
  task_name: string;
  description: string;
  expected_start_date: string; 
  expected_working_hours: number; 
  hourly_rate: string;
  userId?: string; 
  category: string;
  rate_currency: string;
  task_completed?: boolean;
};
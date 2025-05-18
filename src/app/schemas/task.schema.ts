import * as yup from 'yup';
import { Task } from '../types/task.types';

export const taskSchema: yup.ObjectSchema<Task> = yup.object({
  taskId: yup.number().optional(),

  task_name: yup
    .string()
    .required('Task name is required'),

  description: yup
    .string()
    .required('Description is required'),

  expected_start_date: yup
    .string()
    .required('Expected start date is required')
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      'Date must be in YYYY-MM-DD format'
    ),

  expected_working_hours: yup
    .number()
    .typeError('Expected working hours must be a number')
    .min(1, 'Must be at least 1 hour')
    .required('Expected working hours is required'),

  hourly_rate: yup
    .number()
    .typeError('Hourly rate must be a number')
    .positive('Hourly rate must be positive')
    .required('Hourly rate is required'),

  rate_currency: yup
    .string()
    .required('Currency is required')
    .length(3, 'Currency must be a 3-letter code (e.g., USD)'),

  category: yup
    .string()
    .required('Category is required'),

  task_completed: yup.boolean().optional(),

  createdBy: yup
    .string()
    .optional(),

  userId: yup
    .string()
    .optional(),

  providerId: yup
    .string()
    .optional(),

  skillId: yup
    .number()
    .optional()
    .typeError('Skill ID must be a number')
});

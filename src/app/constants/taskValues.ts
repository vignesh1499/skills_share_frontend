import { Task} from "../types/task.types";

export const defaultValues: Task = {
    task_name: "",
    description: '',
    expected_start_date: '',
    expected_working_hours: 0,
    hourly_rate: 0,
    category: '',
    rate_currency: '',
};
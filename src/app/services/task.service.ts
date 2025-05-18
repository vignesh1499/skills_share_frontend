import apiClient from "./api_client";

//Add Task API Function
export const addTask = async (taskData: any) => {
  try {
    const response = await apiClient.post("/task/create", taskData);
    return response;
  } catch (error) {
    throw error;
  }
};

//Update Task API Function
export const updateTask = async (taskData: any) => {
  try {
    const response = await apiClient.put(`/task/update`, taskData);
    return response;
  } catch (error) {
    throw error;
  }
};

//Delete Task API Function
export const deleteTask = async (taskId: any) => {
  try {
    const response = await apiClient.delete(`/task/delete/${taskId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getTasks = async () => {
  try {
    const response = await apiClient.get("/task/get");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const completeTask = async (taskId: any) => {
  try {
    const response = await apiClient.patch(`task/mark_task_complete/${taskId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
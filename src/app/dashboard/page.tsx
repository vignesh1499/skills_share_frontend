'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
} from '@mui/material';

import { Navbar } from '../components/Navbar';
import { TaskCard } from '../components/TaskCard';
import { SkillCard } from '../components/SkillCard';
import { decodeToken } from '../utils/decodeToken';
import { useRole, RoleProvider } from '../context/RoleContext';
import { getAuthToken } from '../services/auth.service';
import TaskForm from '../components/TaskForm';
import SkillForm from '../components/SkillForm';
import { TaskValues } from '../types/task.types';
import { ProviderSkill } from '../types/skill.types';
import { getTasks } from '../services/task.service';
import { getAllSkills } from '../services/skill.service';

const DashboardContent = () => {
  const { role, setRole } = useRole();
  const [openForm, setOpenForm] = useState(false);
  const [formType, setFormType] = useState<'task' | 'skill' | null>(null);
  const [formData, setFormData] = useState<TaskValues | ProviderSkill | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [taskList, setTaskList] = useState<TaskValues[]>([]);
  const [skillList, setSkillList] = useState<ProviderSkill[]>([]);

  useEffect(() => {
    const token = getAuthToken();
    const decoded = token ? decodeToken(token) : null;
    setRole(decoded?.role === 'provider' ? 'provider' : 'user');
  }, [setRole]);

  useEffect(() => {
    if (role === 'user') {
      loadTasks();
    }
    if (role === 'provider') {
      loadSkills();
    }
  }, [role]);

  const handleAddClick = (type: 'skill' | 'task') => {
    setFormType(type);
    setFormData(null); // New form
    setIsEditMode(false);
    setOpenForm(true);
  };

  const handleEdit = (type: 'skill' | 'task', data: TaskValues | ProviderSkill) => {
    console.log('Edit clicked for:', data); // Debugging
    setFormType(type);
    setFormData(data); // Pass selected data
    setIsEditMode(true);
    setOpenForm(true);
  };

  const handleDelete = async (type: 'skill' | 'task', id: string | undefined) => {
    if (!id) return;

    if (type === 'task') {
      // await deleteTask(id); // Uncomment and implement
      console.log('Task deleted:', id);
      await loadTasks();
    } else {
      // await deleteSkill(id); // Uncomment and implement
      console.log('Skill deleted:', id);
      await loadSkills();
    }
  };

  const handleSubmitTask = async (data: TaskValues) => {
    console.log(isEditMode ? 'Task updated:' : 'Task submitted:', data);
    setOpenForm(false);
    await loadTasks();
  };

  const handleSubmitSkill = async (data: ProviderSkill) => {
    console.log(isEditMode ? 'Skill updated:' : 'Skill submitted:', data);
    setOpenForm(false);
    await loadSkills();
  };

  const handleComplete = async (taskId: any) => {
    console.log('Task completed:', taskId);
    // await completeTask(taskId); // Uncomment and implement
    await loadTasks();
  };

  const loadSkills = async () => {
    console.log('Loading skills...');
    try {
      const response = await getAllSkills();
      setSkillList(response?.skills || []);
      setOpenForm(false);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setOpenForm(false);
    }
  };

  const loadTasks = async () => {
    try {
      const response = await getTasks();
      setTaskList(response?.tasks || []);
      setOpenForm(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setOpenForm(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        {role === 'user' && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
              <Typography variant="h5">Tasks</Typography>
              <Button variant="outlined" onClick={() => handleAddClick('task')}>
                Add Task
              </Button>
            </Box>

            {taskList.length === 0 ? (
              <Typography>No tasks available.</Typography>
            ) : (
              taskList.map((task) => (
                <TaskCard
                  key={task.id}
                  {...task}
                  hourly_rate={task.hourly_rate.toString()} 
                  onEdit={() => handleEdit('task', task)}
                  onDelete={() => handleDelete('task', task.id)}
                  onToggleComplete={() => handleComplete(task?.id)}
                />
              ))
            )}

            <Typography variant="h5" sx={{ mt: 4 }}>
              Skills
            </Typography>
            {skillList.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={() => handleEdit('skill', skill)}
                onDelete={() => handleDelete('skill', skill.id)}
              />
            ))}
          </>
        )}

        {role === 'provider' && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
              <Typography variant="h5">Skills</Typography>
              <Button variant="outlined" onClick={() => handleAddClick('skill')}>
                Add Skill
              </Button>
            </Box>
            {skillList.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={() => handleEdit('skill', skill)}
                onDelete={() => handleDelete('skill', skill.id)}
              />
            ))}
          </>
        )}

        {formType === 'task' && (
          <TaskForm
            open={openForm}
            onClose={() => setOpenForm(false)}
            isEditMode={isEditMode}
            initialValues={formData as TaskValues}
            onSubmit={handleSubmitTask}
          />
        )}

        {formType === 'skill' && (
          <SkillForm
            open={openForm}
            onClose={() => setOpenForm(false)}
            isEditMode={isEditMode}
            initialValues={formData as ProviderSkill}
            onSubmit={handleSubmitSkill}
            onSuccessReload={loadSkills}
          />
        )}
      </Container>
    </>
  );
};

export default function DashboardPage() {
  return (
    <RoleProvider>
      <DashboardContent />
    </RoleProvider>
  );
}

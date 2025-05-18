'use client';

import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';

import { Navbar } from '../components/Navbar';
import { decodeToken } from '../utils/decodeToken';
import { getAuthToken } from '../services/auth.service';
import { useRole, RoleProvider } from '../context/RoleContext';
import { getTasks, completeTask, deleteTask } from '../services/task.service';
import { getAllSkills, deleteSkill } from '../services/skill.service';
import { defaultValues } from '../constants/taskValues';
import { Task } from '../types/task.types';
import { Skill } from '../types/skill.types';

const TaskForm = lazy(() => import('../components/TaskForm'));
const SkillForm = lazy(() => import('../components/SkillForm'));
const TaskCard = lazy(() => import('../components/TaskCard'));
const SkillCard = lazy(() => import('../components/SkillCard'));

const Loader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" my={4}>
    <CircularProgress />
  </Box>
);

const DashboardContent = () => {
  const { role, setRole } = useRole();
  const [openForm, setOpenForm] = useState(false);
  const [formType, setFormType] = useState<'task' | 'skill' | null>(null);
  const [formData, setFormData] = useState<Task | Skill | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [skillList, setSkillList] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    const decoded: any = token ? decodeToken(token) : null;
    if (decoded?.role) setRole(decoded.role);
  }, [setRole]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTasks();
      setTaskList(res?.data?.tasks || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSkills = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllSkills();
      setSkillList(res?.data || []);
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === 'user') {
      loadTasks();
      loadSkills();
    } else if (role === 'provider') {
      loadSkills();
    }
  }, [role, loadTasks, loadSkills]);

  const handleAddClick = () => {
    setFormType('skill');
    setFormData(null);
    setIsEditMode(false);
    setOpenForm(true);
  };

  const handleEdit = (type: 'task' | 'skill', data: Task | Skill) => {
    setFormType(type);
    setFormData(data);
    setIsEditMode(true);
    setOpenForm(true);
  };

  const handleDelete = async (type: 'task' | 'skill', id?: number) => {
    try {
      if (type === 'task') {
        await deleteTask(id);
        await loadTasks();
      } else {
        await deleteSkill(id);
        await loadSkills();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await completeTask(id);
      await loadTasks();
    } catch (err) {
      console.error('Toggle complete failed:', err);
    }
  };

  const handleFormSubmit = async () => {
    setOpenForm(false);
    if (formType === 'task') await loadTasks();
    if (formType === 'skill') await loadSkills();
  };

  const filteredSkills =
    role === 'provider'
      ? skillList
      : skillList.filter(skill => skill.status === 'open');

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">
            {role === 'provider' ? 'My Skills' : 'Offers'}
          </Typography>
          {role === 'provider' && (
            <Button variant="contained" onClick={handleAddClick}>
              Add Skill
            </Button>
          )}
        </Box>

        {loading ? (
          <Loader />
        ) : (
          <Suspense fallback={<Loader />}>
            <Box>
              {/* Skill Section */}
              <Box mb={4}>
                {filteredSkills.length > 0 ? (
                  filteredSkills.map(skill => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      onEdit={() => handleEdit('skill', skill)}
                      onDelete={() => handleDelete('skill', skill.id)}
                      onSuccess={loadSkills}
                    />
                  ))
                ) : (
                  <Typography>No offers currently.</Typography>
                )}
              </Box>

              {/* Task Section for user */}
              {role === 'user' && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    My Tasks
                  </Typography>
                  {taskList.length > 0 ? (
                    taskList.map(task => (
                      <TaskCard
                        key={task.taskId}
                        {...task}
                        onEdit={() => handleEdit('task', task)}
                        onDelete={() => handleDelete('task', task.taskId)}
                        onToggleComplete={() => handleToggleComplete(task.taskId!)}
                      />
                    ))
                  ) : (
                    <Typography>No tasks available.</Typography>
                  )}
                </Box>
              )}
            </Box>
          </Suspense>
        )}

        {/* Form Dialogs */}
        <Suspense fallback={<Loader />}>
          {formType === 'task' && (
            <TaskForm
              open={openForm}
              onClose={() => setOpenForm(false)}
              initialValues={(formData as Task) ?? defaultValues}
              isEditMode={isEditMode}
              onSubmit={handleFormSubmit}
              onSuccess={loadTasks}
            />
          )}
          {formType === 'skill' && (
            <SkillForm
              open={openForm}
              onClose={() => setOpenForm(false)}
              initialValues={formData as Skill}
              isEditMode={isEditMode}
              onSubmit={handleFormSubmit}
              onSuccess={loadSkills}
            />
          )}
        </Suspense>
      </Container>
    </>
  );
};

const Dashboard = () => (
  <RoleProvider>
    <DashboardContent />
  </RoleProvider>
);

export default Dashboard;

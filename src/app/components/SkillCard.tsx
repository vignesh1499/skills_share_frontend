'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Cancel as CancelIcon,
  FolderOpen as FolderOpenIcon,
  ThumbUpOffAlt as ThumbUpOffAltIcon,
} from '@mui/icons-material';

import { Skill } from '../types/skill.types';
import SubmitModal from './SubmitModal';
import TaskForm from './TaskForm';
import { postOffer } from '../services/skill.service';
import { getAuthToken } from '../services/auth.service';
import { useRole } from '../context/RoleContext';
import { decodeToken } from '../utils/decodeToken';

interface SkillCardProps {
  skill: Skill;
  onEdit?: () => void;
  onDelete?: () => void;
  onSuccess?: () => Promise<void>;
}

const SkillCard: React.FC<SkillCardProps> = React.memo(({ skill, onEdit, onDelete, onSuccess }) => {
  const { role, setRole } = useRole();
  const [isSubmitModalOpen, setSubmitModalOpen] = useState(false);
  const [isTaskFormOpen, setTaskFormOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    const decoded: any = token ? decodeToken(token) : null;
    if (decoded?.id) setUserId(decoded.id);
    if (decoded?.role) setRole(decoded.role);
  }, [setRole]);

  const isUser = useMemo(() => role === 'user', [role]);
  const isProvider = useMemo(() => role === 'provider', [role]);

  const toggleSubmitModal = useCallback((state: boolean) => () => setSubmitModalOpen(state), []);
  const toggleTaskForm = useCallback((state: boolean) => () => setTaskFormOpen(state), []);

  const handleSubmitAcceptOffer = useCallback(async () => {
    try {
      if (isProvider) {
        await postOffer(skill.id);
        if (onSuccess) await onSuccess();
      }
      setSubmitModalOpen(false);
      return { success: true };
    } catch {
      setSubmitModalOpen(false);
      return { success: false };
    }
  }, [isProvider, skill.id, onSuccess]);

  const initialTaskValues = useMemo(() => ({
    task_name: skill.category || '',
    description: 'Add Description',
    expected_start_date: '',
    expected_working_hours: 0,
    hourly_rate: skill.hourly_rate || 0,
    rate_currency: 'USD',
    category: skill.category || '',
    userId: userId || undefined,
    skillId: skill.id,
    providerId: skill.providerId || '',
  }), [skill, userId]);

  const renderProviderActions = () => (
    <>
      {skill.status === null && (
        <Button
          variant="contained"
          size="small"
          color="primary"
          endIcon={<SendIcon />}
          onClick={toggleSubmitModal(true)}
          sx={{ mt: 1, borderRadius: 2 }}
        >
          Post Offer
        </Button>
      )}
    </>
  );

  const renderUserActions = () => (
    skill.status === 'open' && (
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Button
          variant="contained"
          size="small"
          endIcon={<ThumbUpOffAltIcon />}
          onClick={toggleTaskForm(true)}
          sx={{ borderRadius: 2 }}
        >
          Accept Offer
        </Button>
        <CancelIcon sx={{ color: 'error.main' }} />
      </Box>
    )
  );

  const renderOpenStatusButton = () => (
    skill.status === 'open' && !isUser && (
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Button
          variant="outlined"
          size="small"
          endIcon={<FolderOpenIcon />}
          sx={{ borderRadius: 2 }}
        >
          Open
        </Button>
      </Box>
    )
  );

  return (
    <>
      <Card sx={{ borderRadius: 2, my: 1 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {skill.category}
              </Typography>
              <Typography variant="body2">
                <strong>Nature of Work:</strong> {skill.nature_of_work}
              </Typography>
              <Typography variant="body2">
                <strong>Experience:</strong> {skill.experience} year{skill.experience > 1 ? 's' : ''}
              </Typography>
              <Typography variant="body2">
                <strong>Hourly Rate:</strong> ${skill.hourly_rate}
              </Typography>
              {skill.created_at && (
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(skill.created_at).toLocaleDateString()}
                </Typography>
              )}
            </Box>

            <Box mt={{ xs: 2, sm: 0 }} display="flex" flexDirection="column" alignItems="center">
              <Box>
                {onEdit && (
                  <IconButton onClick={onEdit} aria-label="edit skill">
                    <EditIcon />
                  </IconButton>
                )}
                {onDelete && (
                  <IconButton onClick={onDelete} aria-label="delete skill">
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
              {isProvider && renderProviderActions()}
              {isUser && renderUserActions()}
              {renderOpenStatusButton()}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Submit Modal for Providers */}
      {isProvider && (
        <SubmitModal
          open={isSubmitModalOpen}
          onClose={toggleSubmitModal(false)}
          onSubmit={handleSubmitAcceptOffer}
          title="Confirm Post Offer"
          description="Are you sure you want to post this skill offer?"
          successMessage="Skill offer posted successfully."
          errorMessage="Failed to post offer. Try again."
          actionLabel="Post Offer"
          cancelLabel="Cancel"
        />
      )}

      {/* Task Form for Users */}
      {isUser && (
        <TaskForm
          open={isTaskFormOpen}
          onClose={toggleTaskForm(false)}
          initialValues={initialTaskValues}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
});

SkillCard.displayName = 'SkillCard';
export default SkillCard;

'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type StatusType = 'idle' | 'submitting' | 'success' | 'error';

type SubmitModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<{ success: boolean }>;
  onSuccess?: () => Promise<void>;
  title: string;
  description: string;
  successMessage: string;
  errorMessage: string;
  actionLabel?: string;
  cancelLabel?: string;
};

const SubmitModal: React.FC<SubmitModalProps> = React.memo(({
  open,
  onClose,
  onSubmit,
  title,
  description,
  successMessage,
  errorMessage,
  actionLabel = 'Submit',
  cancelLabel = 'Cancel',
  onSuccess
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [status, setStatus] = useState<StatusType>('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = useCallback(() => {
    setStatus('idle');
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    setStatus('submitting');

    onSubmit()
      .then((result) => {
        setStatus(result.success ? 'success' : 'error');
        if (result.success && onSuccess) {
          onSuccess();
        }
      })
      .catch(() => {
        setStatus('error');
      })
      .finally(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(handleClose, 5000);
      });
  }, [onSubmit, handleClose]);

  useEffect(() => {
    if (!open && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setStatus('idle');
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [open]);

  const renderContent = useMemo(() => {
    const commonStyles = {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      mt: 2,
    };

    switch (status) {
      case 'submitting':
        return (
          <Box sx={commonStyles}>
            <CircularProgress />
            <Typography mt={2}>Submitting...</Typography>
          </Box>
        );
      case 'success':
        return (
          <Box sx={{ ...commonStyles, color: 'green' }}>
            <CheckCircle fontSize="large" />
            <Typography mt={1}>{successMessage}</Typography>
          </Box>
        );
      case 'error':
        return (
          <Box sx={{ ...commonStyles, color: 'red' }}>
            <ErrorIcon fontSize="large" />
            <Typography mt={1}>{errorMessage}</Typography>
          </Box>
        );
      default:
        return (
          <Typography variant="body1" sx={{ mt: 1 }}>
            {description}
          </Typography>
        );
    }
  }, [status, description, successMessage, errorMessage]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      PaperProps={{ sx: { p: 3, borderRadius: 3 } }}
      sx={{ zIndex: 1400 }} 
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>{renderContent}</DialogContent>

      {status === 'idle' && (
        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button variant="outlined" onClick={handleClose}>
            {cancelLabel}
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {actionLabel}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
});

export default SubmitModal;

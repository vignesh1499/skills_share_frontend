'use client';

import * as React from 'react';
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
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type SubmitModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<{ success: boolean }>;
  title: string;
  description: string;
  successMessage: string;
  errorMessage: string;
  actionLabel?: string;
  cancelLabel?: string;
};

const SubmitModal: React.FC<SubmitModalProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  description,
  successMessage,
  errorMessage,
  actionLabel = 'Submit',
  cancelLabel = 'Cancel',
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async () => {
    setStatus('submitting');
    try {
      const result = await onSubmit();
      setStatus(result.success ? 'success' : 'error');

      // Auto-close modal after 3 seconds
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, 5000);
    } catch {
      setStatus('error');
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, 5000);
    }
  };

  const handleClose = () => {
    setStatus('idle');
    onClose();
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const renderContent = () => {
    switch (status) {
      case 'submitting':
        return (
          <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
            <CircularProgress />
            <Typography mt={2}>Submitting...</Typography>
          </Box>
        );
      case 'success':
        return (
          <Box display="flex" flexDirection="column" alignItems="center" mt={2} color="green">
            <CheckCircle fontSize="large" />
            <Typography mt={1}>{successMessage}</Typography>
          </Box>
        );
      case 'error':
        return (
          <Box display="flex" flexDirection="column" alignItems="center" mt={2} color="red">
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
  };

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
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        {title}
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>{renderContent()}</DialogContent>

      {status === 'idle' && (
        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
};

export default SubmitModal;

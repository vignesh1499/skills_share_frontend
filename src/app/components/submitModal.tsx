// components/SubmitModal.tsx
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type SubmitModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  description: string;
  actionLabel?: string; // default: "Submit"
  cancelLabel?: string; // default: "Cancel"
};

const SubmitModal: React.FC<SubmitModalProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  description,
  actionLabel = 'Submit',
  cancelLabel = 'Cancel',
}) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="submit-modal-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="submit-modal-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelLabel}</Button>
        <Button onClick={onSubmit}>{actionLabel}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitModal;

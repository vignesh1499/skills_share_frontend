import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

interface TaskCardProps {
  id?: string;
  task_name: string;
  description: string;
  expected_start_date: string;
  expected_working_hours: number;
  hourly_rate: number;
  rate_currency: string;
  category: string;
  task_completed?: boolean;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onToggleComplete: () => Promise<void>;
}

const TaskCard = React.memo(({
  task_name,
  description,
  expected_start_date,
  expected_working_hours,
  hourly_rate,
  rate_currency,
  category,
  task_completed = false,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskCardProps) => {
  const statusText = task_completed ? "Completed ✅" : "Pending ⏳";
  const statusColor = task_completed ? "text.primary" : "success.main";
  const cardBgColor = task_completed ? "#e8f5e9" : "inherit";

  return (
    <Card sx={{ borderRadius: 2, my: 1, backgroundColor: cardBgColor }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "start", sm: "center" }}
        >
          <Box flex={1}>
            <Typography variant="h6">{task_name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {description}
            </Typography>
            <Chip label={category} size="small" color="primary" sx={{ mb: 1 }} />
            <Typography variant="body2">
              <strong>Start Date:</strong> {expected_start_date}
            </Typography>
            <Typography variant="body2">
              <strong>Estimated Hours:</strong> {expected_working_hours} hrs
            </Typography>
            <Typography variant="body2">
              <strong>Rate:</strong> {rate_currency} {hourly_rate}/hr
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }} color={statusColor}>
              <strong>Status:</strong> {statusText}
            </Typography>
          </Box>

          <Box mt={{ xs: 2, sm: 0 }}>
            <IconButton aria-label="edit" onClick={onEdit}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
            <IconButton
              aria-label="toggle complete"
              onClick={onToggleComplete}
              color={task_completed ? "success" : "default"}
            >
              <CheckCircleRoundedIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

TaskCard.displayName = "TaskCard";
export default TaskCard;

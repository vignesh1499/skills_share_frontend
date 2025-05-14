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
  hourly_rate: string; 
  rate_currency: string;
  category: string;
  task_completed?: boolean ;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onToggleComplete: () => Promise<void>;
}

export const TaskCard = ({
  category,
  task_name,
  description,
  expected_start_date,
  expected_working_hours,
  hourly_rate,
  rate_currency,
  task_completed,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskCardProps) => {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        my: 1,
        backgroundColor: task_completed ? "#e8f5e9" : "inherit",
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
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
            <Typography
              variant="body2"
              sx={{ mt: 1 }}
              color={task_completed ? "text.primary" : "success.main"}
            >
              <strong>Status:</strong> {task_completed ? "Completed ✅" : "Pending ⏳"}
            </Typography>
          </Box>

          <Box mt={{ xs: 2, sm: 0 }}>
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={onToggleComplete}
              color={task_completed ? "default" : "success"}
            >
              <CheckCircleRoundedIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

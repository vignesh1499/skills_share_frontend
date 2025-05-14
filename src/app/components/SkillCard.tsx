import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProviderSkill } from "../types/skill.types";

interface SkillCardProps {
  skill: ProviderSkill;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SkillCard = ({ skill, onEdit, onDelete }: SkillCardProps) => {
  return (
    <Card sx={{ borderRadius: "16px", my: 1 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <Box flex={1}>
            <Typography variant="h6" gutterBottom>
              {skill.category}
            </Typography>
            <Typography variant="body2">
              <strong>Nature of Work:</strong> {skill.nature_of_work}
            </Typography>
            <Typography variant="body2">
              <strong>Experience:</strong> {skill.experience} years
            </Typography>
            <Typography variant="body2">
              <strong>Hourly Rate:</strong> ₹{skill.hourly_rate}
            </Typography>
            {skill.created_at && (
              <Typography variant="caption" color="text.secondary">
                Created: {new Date(skill.created_at).toLocaleDateString()}
              </Typography>
            )}
          </Box>
          <Box mt={{ xs: 2, sm: 0 }}>
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

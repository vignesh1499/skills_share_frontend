import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import { useRole } from "../context/RoleContext";
import { useEffect, useState } from "react";
import { decodeToken } from "../utils/decodeToken";
import Cookies from "js-cookie";

export const Navbar = () => {
  const { role, setRole } = useRole();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [email, setEmail] = useState<string>(""); // For client-only email
  const open = Boolean(anchorEl);

  useEffect(() => {
    // Only runs on client
    const token = Cookies.get("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded?.email) {
        setEmail(decoded.email);
      }

      const validRole = decoded?.role === "user" || decoded?.role === "provider"
        ? decoded.role
        : "user";
      setRole(validRole);
    }
  }, [setRole]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/login"; // You can also use Next.js router.push here
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#000", boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">
          SkillShare App
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Account settings">
            <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 1 }}>
              <Avatar sx={{ bgcolor: "#1976d2", width: 36, height: 36 }}>
                {role === "provider" ? <BusinessIcon /> : <PersonIcon />}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* Only show email when available to avoid hydration mismatch */}
          {email && <Typography variant="body1">{email}</Typography>}

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1,
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                borderRadius: 2,
              },
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

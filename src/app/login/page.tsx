'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Avatar,
  CssBaseline,
  Paper,
  Snackbar,
  CircularProgress,
  Link
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { login } from '../services/authServices';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    setIsLoading(true);
    event.preventDefault();
    setError('');

    const res = await login(email, password).then((res) => {
      console.log("res", res.status, res.data)

      //Success response block
      if (res.status === 200) {
        setIsLoading(false);
        if ((res as any).status === 200) {
          setShowSnackbar(true);
          setSnackbarType('success');
          setSnackbarMessage('Login successful!');
          setTimeout(() => {
            setShowSnackbar(false);
            // router.push('/dashboard');
          }, 4000);
        }

      }

    }).catch((err) => {
      console.log("err", err.status)
      if (err.status === 400) {
        setIsLoading(false);
        setShowSnackbar(true);
        setSnackbarType('error');
        setSnackbarMessage('Login failed. Please check credentials.');
        setTimeout(() => setShowSnackbar(false), 4000);

      }
    })

    // Example validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={6} sx={{ padding: 4, mt: 8, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', mb: 1 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>

        {/* Loader Snackbar */}
        {
          isLoading && (
            <Snackbar open={true} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} message={
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} color="inherit" />
                Loading, please wait...
              </Box>
            } />
          )
        }

         {/* Signup Redirect */}
        <Box display="flex" justifyContent="center">
          <Typography variant="body2">
            New User?{' '}
            <Link
              onClick={() => router.push('/register')}
              sx={{ cursor: 'pointer', fontWeight: 'bold' }}
            >
              Signup
            </Link>
          </Typography>
        </Box>
    

        {/* Snackbar for success or error */}
        {showSnackbar && (
          <Snackbar
            open
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            message={
              <Box display="flex" alignItems="center" gap={1}>
                {snackbarType === 'success' ? (
                  <CheckCircleRoundedIcon color="success" />
                ) : (
                  <CloseRoundedIcon color="error" />
                )}
                <Typography>{snackbarMessage}</Typography>
              </Box>
            }
          />
        )}
      </Paper>
    </Container>
  );
}
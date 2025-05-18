'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Link,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { login, setAuthToken } from '../services/auth.service';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ open: false, type: 'success', message: '' });

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    // Validation before making API call
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      const token = res?.data?.token;

      if (res.status === 200 && token) {
        setAuthToken(token);
        setSnackbar({
          open: true,
          type: 'success',
          message: 'Login successful!',
        });
        setTimeout(() => {
          setSnackbar((prev) => ({ ...prev, open: false }));
          router.push('/dashboard');
        }, 2000);
      } else {
        throw new Error('Unexpected response');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const message =
        err?.status === 400
          ? 'Invalid credentials. Please try again.'
          : 'Something went wrong. Please try later.';

      setSnackbar({
        open: true,
        type: 'error',
        message,
      });

      setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, router]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={6} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
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
              fullWidth
              required
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              fullWidth
              required
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
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        </Box>

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
      </Paper>

      <Snackbar
        open={snackbar.open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={
          <Box display="flex" alignItems="center" gap={1}>
            {snackbar.type === 'success' ? (
              <CheckCircleRoundedIcon color="success" />
            ) : (
              <CloseRoundedIcon color="error" />
            )}
            <Typography>{snackbar.message}</Typography>
          </Box>
        }
      />
    </Container>
  );
}

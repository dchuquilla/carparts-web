import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, TextField, Box, Typography } from '@mui/material';
import axiosInstance from '../api/axiosInstance';

interface SignInProps {
  setIsAuthenticated: (value: boolean) => void;
}

const SignIn: React.FC<SignInProps> = ({ setIsAuthenticated }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // <-- get location

  // Parse redirect_to from query string
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get('redirect_to') || '/requests';
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`${import.meta.env.VITE_API_BASE_URL}/users/sign_in`, {
        user: { email, password },
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status !== 200) {
        throw new Error(t('sessionForm.errors.invalidCredentials'));
      }
      const authHeader = response.headers.authorization as string | undefined;
      if (authHeader) {
        localStorage.setItem('token', authHeader);
      } else {
        console.error('No token received from server');
        throw new Error(t('sessionForm.errors.invalidCredentials'));
      }
      setIsAuthenticated(true);
      void navigate(redirectTo);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('sessionForm.errors.unknownError'));
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#ffffff',
      }}
    >
      <Typography variant="h4" gutterBottom>
        {t('sessionForm.title')}
      </Typography>
      <form onSubmit={(e) => { void handleSubmit(e); }} style={{ width: '300px' }}>
        <TextField
          label={t('sessionForm.email')}
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label={t('sessionForm.password')}
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {t('sessionForm.submit')}
        </Button>
      </form>
    </Box>
  );
};

export default SignIn;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography } from '@mui/material';

interface SignInProps {
  setIsAuthenticated: (value: boolean) => void;
}

const SignIn: React.FC<SignInProps> = ({ setIsAuthenticated }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('https://dev-api.quientiene.com/users/sign_in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({user: { email, password }}),
      });

      if (!response.ok) {
        throw new Error(t('sessionForm.errors.invalidCredentials'));
      }

      const authHeader = response.headers.get('authorization');
      if (authHeader) {
        localStorage.setItem('token', authHeader);
      } else {
        console.error('No token received from server');
        throw new Error(t('sessionForm.errors.invalidCredentials'));
      }
      setIsAuthenticated(true);
      void navigate('/');
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

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import UserType from '../types/UserType';

interface UserFormProps {
  user?: UserType;
}

const UserForm: React.FC<UserFormProps> = ({ user }) =>  {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UserType>({
    email: user?.email ?? '',
    password: user?.password ?? '',
    confirmPassword: user?.confirmPassword ?? '',
    phone: user?.phone ?? '',
    storeName: user?.storeName ?? '',
    storeUid: user?.storeUid ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError(t('storeForm.errors.passwordMismatch'));
      setLoading(false);
      return;
    }

    try {
      await axios.post('https://dev-api.quientiene.com/users', {user: {
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        store_name: formData.storeName,
        store_uid: formData.storeUid,
      }});
      setSuccess(true);
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        storeName: '',
        storeUid: '',
      });
    } catch (err) {
      setError(t('storeForm.storeCreationFailed'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('storeForm.createStore')}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{t('storeForm.storeCreated')}</Alert>}
        <form onSubmit={(e) => { void handleSubmit(e); }}>
          <TextField
            fullWidth
            margin="normal"
            label={t('storeForm.email')}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {user == null && (
            <><TextField
            fullWidth
            margin="normal"
            label={t('storeForm.password')}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required /><TextField
              fullWidth
              margin="normal"
              label={t('storeForm.passwordConfirm')}
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required /></>
          )}
            <TextField
            fullWidth
            margin="normal"
            label={t('storeForm.phone')}
            name="phone"
            type="tel"
            value={formData.phone && formData.phone.length > 0 ? formData.phone : '+593'}
            onChange={(e) => {
              // Only allow numbers and + at the start
              let value = e.target.value.replace(/[^+\d]/g, '');
              if (!value.startsWith('+')) value = '+' + value.replace(/^\+*/, '');
              if (value.length > 13) value = value.slice(0, 13);
              setFormData({ ...formData, phone: value });
            }}
            required
            inputProps={{ maxLength: 13 }}
            error={
              formData.phone.length === 13 &&
              !/^\+5939\d{8}$/.test(formData.phone)
            }
            helperText={
              formData.phone.length === 13 && !/^\+5939\d{8}$/.test(formData.phone)
                ? t('storeForm.errors.invalidEcuadorPhone')
                : 'Ej: +5939XXXXXXXX'
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label={t('storeForm.storeName')}
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label={t('storeForm.storeUid')}
            name="storeUid"
            value={formData.storeUid}
            onChange={handleChange}
            required
          />
        <Box sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UserForm;

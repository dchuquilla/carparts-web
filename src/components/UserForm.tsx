/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Alert, Switch, FormControlLabel, List, ListItem, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosInstance';
import { UserType } from '../types/UserType';
import { MuiTelInput } from 'mui-tel-input';
import axios, { AxiosError } from 'axios';

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
    termsAndConditions: user?.termsAndConditions ?? false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorList, setErrorList] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post('https://dev-api.quientiene.com/users', {user: {
        email: formData.email,
        password: formData.password,
        phone: formData.phone.replace(/\+/g, ''),
        store_name: formData.storeName,
        store_uid: formData.storeUid,
        terms_and_conditions: formData.termsAndConditions
      }});
      setSuccess(true);
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        storeName: '',
        storeUid: '',
        termsAndConditions: false
      });
    } catch (err) {
      setError(true);
      if ((err as AxiosError).response?.data) {
        if (axios.isAxiosError(err)) {
          console.error('Error creating user 1:', err.response?.data.error);
          setErrorList(err.response?.data.error || []);
        } else {
          console.error('Error creating user 2:', err);
        }
      } else {
        console.error('Error creating user:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('storeForm.createStore')}
      </Typography>
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
          required />
          <TextField
          fullWidth
          margin="normal"
          label={t('storeForm.passwordConfirm')}
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required /></>
        )}
        <MuiTelInput 
        value={formData.phone} 
        onChange={(value) => setFormData({ ...formData, phone: value })}
        defaultCountry="EC"
        disableFormatting
        fullWidth
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
        <FormControlLabel
          control={
            <Switch checked={formData.termsAndConditions} onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.checked })} name="termsAndConditions" />
          }
          label={<span dangerouslySetInnerHTML={{ __html: t('storeForm.termsAndConditions') }} />}
          required
        />

        {error && <Alert severity="error">{
          <>
            {t('storeForm.storeCreationFailed')}
            <List>
              {errorList.map((error, index) => (
                <ListItem key={index}>
                  <ListItemText primary={error} />
                </ListItem>
              ))}
            </List>
          </>
        }</Alert>}
        {success && <Alert severity="success">{t('storeForm.storeCreated')}</Alert>}

        <Box sx={{ mt: 2 }}>
          <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('storeForm.submit')}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UserForm;

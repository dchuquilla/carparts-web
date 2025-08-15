import React, { useState } from 'react';
import { Box, Button, TextField, CircularProgress, Alert } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ProposalType from '../types/ProposalType';
import { Html } from '@mui/icons-material';

interface ProposalFormProps {
  proposal?: ProposalType;
}

const ProposalForm: React.FC<ProposalFormProps> = ({ proposal }) =>  {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ProposalType>({
    price: proposal?.price ?? '',
    notes: proposal?.notes ?? '',
    warrantyMonths: proposal?.warrantyMonths ?? 0,
    deliveryTimeDays: proposal?.deliveryTimeDays ?? 0,
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
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'https://dev-api.quientiene.com/api/v1/proposals', {
          proposal: {
            request_id: proposal?.requestId,
            price: formData.price,
            notes: formData.notes,
            warranty_months: formData.warrantyMonths,
            delivery_time_days: formData.deliveryTimeDays,
          }
        }, {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          }
        }
      );
      setSuccess(true);
      setFormData({
        price: '',
        notes: '',
        warrantyMonths: 0,
        deliveryTimeDays: 0,
      });
    } catch (err) {
      setError(t('proposalForm.proposalCreationFailed'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{t('proposalForm.proposalCreated')}</Alert>}
        <form onSubmit={(e) => { void handleSubmit(e); }}>
          <NumericFormat
            value={formData.price}
            customInput={TextField}
            onChange={handleChange}
            thousandSeparator
            valueIsNumericString
            prefix="$"
            name="price"
            variant="standard"
            label={t('proposalForm.price')}
            style={{ width: 330 }}
          />
          <br />
          <br />
          <TextareaAutosize
            aria-label={t('proposalForm.notes')}
            minRows={3}
            placeholder={t('proposalForm.notes')}
            onChange={handleChange}
            style={{ width: 330 }}
            name="notes"
          />
          <TextField
            type="number"
            fullWidth
            margin="normal"
            label={t('proposalForm.warrantyMonths')}
            name="warrantyMonths"
            value={formData.warrantyMonths}
            onChange={handleChange}
            required
            inputProps={{
              min: 0, // Minimum value
              max: 12, // Maximum value
              step: 1, // Increment step
            }}
          />
          <TextField
            type="number"
            fullWidth
            margin="normal"
            label={t('proposalForm.deliveryTimeDays')}
            name="deliveryTimeDays"
            value={formData.deliveryTimeDays}
            onChange={handleChange}
            required
            inputProps={{
              min: 0, // Minimum value
              max: 15, // Maximum value
              step: 1, // Increment step
            }}
          />
        <Box sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t('proposalForm.submit')}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProposalForm;

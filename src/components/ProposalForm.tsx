/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import React, { useState } from 'react';
import { Box, Button, TextField, CircularProgress, Alert } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosInstance';
import ProposalType from '../types/ProposalType';
import CreateProposalData from '../types/CreateProposalData';
import FileInput from './FileInput';

interface ProposalFormProps {
  previousProposals?: Array<ReturnType<typeof CreateProposalData>>;
  proposal?: ProposalType;
  setProposals?: (proposals: Array<ReturnType<typeof CreateProposalData>>) => void;
  setOpenModal: (open: boolean) => void;
}

const ProposalForm: React.FC<ProposalFormProps> = ({ proposal, previousProposals, setProposals, setOpenModal }) =>  {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ProposalType>({
    price: proposal?.price ?? '',
    notes: proposal?.notes ?? '',
    partImage: proposal?.partImage ?? '',
    warrantyMonths: proposal?.warrantyMonths ?? 0,
    deliveryTimeDays: proposal?.deliveryTimeDays ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
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
      await axiosInstance.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/proposals`, {
          proposal: {
            request_id: proposal?.requestId,
            price: formData.price,
            notes: formData.notes,
            part_image: formData.partImage,
            warranty_months: formData.warrantyMonths,
            delivery_time_days: formData.deliveryTimeDays,
          }
        }, {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          }
        }
      ).then(proposalResponse => {
        console.log('Proposal created:', proposalResponse.data);
        const newProposal = CreateProposalData(
          proposalResponse.data.id,
          proposalResponse.data.created_at,
          proposalResponse.data.formatted_price,
          proposalResponse.data.formatted_created_at,
          proposalResponse.data.notes,
          proposalResponse.data.part_image,
          proposalResponse.data.warranty_months,
          proposalResponse.data.delivery_time_days,
          proposalResponse.data.status
        );
        const prevProposal: Array<ReturnType<typeof CreateProposalData>> = previousProposals || [];
        const theProposal = [...prevProposal, newProposal]
        if (setProposals) {
          setProposals(theProposal);
        }
        setSuccess(true);
        setFormData({
          price: '',
          notes: '',
          partImage: '',
          warrantyMonths: 1,
          deliveryTimeDays: 1,
        });
        setOpenModal(false)
      })
      .catch(error => {
        setError(t('proposalForm.proposalCreationFailed'));
        console.log('Error creating proposal 1:', JSON.stringify(error, null, 2));
      });
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
            thousandSeparator="."
            decimalSeparator=","
            valueIsNumericString
            prefix="$"
            name="price"
            variant="standard"
            label={t('proposalForm.price')}
            style={{ width: 330 }}
            required
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
            required
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
          <FileInput
            uploadUrl={`${import.meta.env.VITE_API_BASE_URL}/api/v1/uploads`}
            onUpload={(url: string) => {
              setFormData((prevData) => ({
                ...prevData,
                partImage: prevData.partImage ? `${prevData.partImage}\n${url}` : url,
              }));
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

          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => setOpenModal(false)}
          >
            {t('proposalForm.cancel')}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProposalForm;

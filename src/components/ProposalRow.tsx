import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import ShoppingBasketTwoToneIcon from '@mui/icons-material/ShoppingBasketTwoTone';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Typography from '@mui/material/Typography';
import CreateProposalData from '../types/CreateProposalData';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import axiosInstance from '../api/axiosInstance';

const token = localStorage.getItem('token');

function handleApproveProposal(proposalId: number, setProposals: React.Dispatch<React.SetStateAction<Array<ReturnType<typeof CreateProposalData>>>>, setSuccess: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<boolean>>) {
  // Implement the logic to approve the proposal
  console.log("approving:", proposalId);
  axiosInstance.patch(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/proposals/${proposalId}/accept`, 
    {headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    }}
  )
  .then(response => {
    console.log("Proposal approved:", response.data);
    // update the UI or state here to reflect the approved proposal
    setProposals(prevProposals => prevProposals.filter(proposal => proposal.id === proposalId).map(proposal => ({ ...proposal, status: 'accepted' })));
    setSuccess(true);
  })
  .catch(error => {
    console.error("Error approving proposal:", error);
    setError(true);
  });
}

function handleDeleteProposal(proposalId: number, setProposals: React.Dispatch<React.SetStateAction<Array<ReturnType<typeof CreateProposalData>>>>, setSuccess: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<boolean>>) {
  // Implement the logic to reject the proposal
  console.log("deleting:", proposalId);
  axiosInstance.delete(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/proposals/${proposalId}`, 
    {headers: {
      'Authorization': token,
      'Content-Type': 'application/json',
    }}
  )
  .then(response => {
    console.log("Proposal rejected:", response.data);
    setProposals(prevProposals => prevProposals.filter(proposal => proposal.id !== proposalId));
    setSuccess(true);
  })
  .catch(error => {
    console.error("Error rejecting proposal:", error);
    setError(true);
  });
}

type inputProps = { 
  row: ReturnType<typeof CreateProposalData>, 
  setProposals: React.Dispatch<React.SetStateAction<Array<ReturnType<typeof CreateProposalData>>>>, 
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
  setSuccessDelete: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorDelete: React.Dispatch<React.SetStateAction<boolean>>,
  isAuthenticated: boolean
}

function ProposalRow(props: inputProps) {
  const { t } = useTranslation();
  const { row, setProposals, setSuccess, setError, setSuccessDelete, setErrorDelete } = props;
  const [open, setOpen] = useState(false);
  const [partImageUrl, setPartImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchPartImageUrl = async () => {
      if (!row.history.partImage) return '';
      try {
        const response = await axiosInstance.get<{ url: string }>(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/uploads/${row.history.partImage}`
        );
      console.log("Part image URL fetched:", response.data);
      setPartImageUrl(response.data.url);
    } catch (error) {
      console.error("Error fetching part image URL:", error);
      setPartImageUrl('');
    }
  };
  void fetchPartImageUrl();
}, [row.history.partImage]);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell
          sx={{ padding: { xs: 0, md: 2 } }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ padding: { xs: 0, md: 2 }, whiteSpace: { xs: 'normal', md: 'nowrap' } }}>{row.formatted_created_at}</TableCell>
        <TableCell sx={{ padding: { xs: 0, md: 2 }, whiteSpace: { xs: 'normal', md: 'nowrap' } }} align="right">{row.formatted_price}</TableCell>
        <TableCell sx={{ padding: { xs: 0, md: 2 } }} align="right">
            {props.isAuthenticated ? (
              <Button
                onClick={row.status === 'accepted' ? undefined : () => handleDeleteProposal(row.id, setProposals, setSuccessDelete, setErrorDelete)}
                disabled={row.status === 'accepted'}
              >
                <DeleteForeverTwoToneIcon />
              </Button>
            ) : (
              <Button
                onClick={row.status === 'accepted' ? undefined : () => handleApproveProposal(row.id, setProposals, setSuccess, setError)}
                disabled={row.status === 'accepted'}
              >
                {row.status === 'accepted' ? <ShoppingBasketTwoToneIcon /> : <ShoppingCartTwoToneIcon />}
              </Button>
            )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ padding: { xs: 0, md: 2 } }} style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ mt: 2 }} color='primary'>
                {t('proposalsList.notes')}
              </Typography>
              <Typography variant="body1" gutterBottom component="div">
                {row.history.notes}
              </Typography>

              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ color: 'primary.main' }}>{t('proposalsList.warrantyMonths')}</TableCell>
                    <TableCell align="center" sx={{ color: 'primary.main' }}>{t('proposalsList.deliveryTimeDays')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.id}>
                    <TableCell align="center">{row.history.warrantyMonths}</TableCell>
                    <TableCell align="center">{row.history.deliveryTimeDays}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Typography variant="h6" gutterBottom component="div" sx={{ mt: 2 }} color='primary'>
                {t('proposalDetails.partImage')}
              </Typography>
              {row.history.partImage && (
                <Box sx={{ mt: 2 }}>
                  <img src={partImageUrl} alt={t('proposalDetails.partImage')} style={{ maxWidth: '100%' }} />
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default ProposalRow;
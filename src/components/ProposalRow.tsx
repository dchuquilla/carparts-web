import React, { useState } from 'react';
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

function handleApproveProposal(proposalId: number, setProposals: React.Dispatch<React.SetStateAction<Array<ReturnType<typeof CreateProposalData>>>>, setSuccess: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<boolean>>) {
  // Implement the logic to approve the proposal
  console.log("approving:", proposalId);
  axiosInstance.patch(`https://dev-api.quientiene.com/api/v1/proposals/${proposalId}/accept`)
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

function handleDeleteProposal(proposalId: number) {
  // Implement the logic to reject the proposal
  console.log("deleting:", proposalId);
  axiosInstance.delete(`https://dev-api.quientiene.com/api/v1/proposals/${proposalId}`)
    .then(response => {
      console.log("Proposal rejected:", response.data);
    })
    .catch(error => {
      console.error("Error rejecting proposal:", error);
    });
}

type inputProps = { 
  row: ReturnType<typeof CreateProposalData>, 
  setProposals: React.Dispatch<React.SetStateAction<Array<ReturnType<typeof CreateProposalData>>>>, 
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>, 
  setError: React.Dispatch<React.SetStateAction<boolean>>, 
  isAuthenticated: boolean 
}

function ProposalRow(props: inputProps) {
  const { t } = useTranslation();
  const { row, setProposals, setSuccess, setError } = props;
  const [open, setOpen] = useState(false);

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
                onClick={row.status === 'accepted' ? undefined : () => handleDeleteProposal(row.id)}
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
              <Typography variant="h6" gutterBottom component="div">
                {t('proposalsList.details')}
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('proposalsList.notes')}</TableCell>
                    <TableCell align="right">{t('proposalsList.warrantyMonths')}</TableCell>
                    <TableCell align="right">{t('proposalsList.deliveryTimeDays')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.history.notes}
                    </TableCell>
                    <TableCell align="right">{row.history.warranty}</TableCell>
                    <TableCell align="right">{row.history.delivery}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default ProposalRow;
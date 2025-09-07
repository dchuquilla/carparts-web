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

function handleApproveProposal(proposalId: number, setProposals: React.Dispatch<React.SetStateAction<Array<ReturnType<typeof CreateProposalData>>>>) {
  // Implement the logic to approve the proposal
  console.log("approving:", proposalId);
  axiosInstance.patch(`https://dev-api.quientiene.com/api/v1/proposals/${proposalId}/accept`)
    .then(response => {
      console.log("Proposal approved:", response.data);
      // update the UI or state here to reflect the approved proposal
      setProposals(prevProposals => prevProposals.filter(proposal => proposal.id === proposalId).map(proposal => ({ ...proposal, status: 'accepted' })));
    })
    .catch(error => {
      console.error("Error approving proposal:", error);
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

function ProposalRow(props: { row: ReturnType<typeof CreateProposalData>, setProposals: React.Dispatch<React.SetStateAction<Array<ReturnType<typeof CreateProposalData>>>>, isAuthenticated: boolean }) {
  const { t } = useTranslation();
  const { row, setProposals } = props;
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
            <>
              <Button onClick={() => handleDeleteProposal(row.id)}>
                <DeleteForeverTwoToneIcon />
              </Button>
            </>
            ) : (
            <>
              {row.status === 'accepted' ? (
                <Button disabled>
                  <ShoppingBasketTwoToneIcon />
                </Button>
              ) : (
                <Button onClick={() => handleApproveProposal(row.id, setProposals)}>
                  <ShoppingCartTwoToneIcon />
                </Button>
              )}
            </>
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
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Alert, CircularProgress } from '@mui/material';
import CreateProposalData from '../types/CreateProposalData';
import ProposalRow from './ProposalRow';

interface ProposalProps {
  proposals: Array<ReturnType<typeof CreateProposalData>>;
  setProposals: React.Dispatch<React.SetStateAction<Array<ReturnType<typeof CreateProposalData>>>>;
  isAuthenticated: boolean;
}

const ProposalList:React.FC<ProposalProps> = ({ proposals, setProposals, isAuthenticated }) => {
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState(false);

  if (!proposals) {
    return <CircularProgress />;
  }

  return (
    <>
      {error && <Alert severity="error">{t('proposalDetails.acceptedError')}</Alert>}
      {success && <Alert severity="success">{t('proposalDetails.acceptedSuccess')}</Alert>}
      {errorDelete && <Alert severity="error">{t('proposalDetails.deletedError')}</Alert>}
      {successDelete && <Alert severity="success">{t('proposalDetails.deletedSuccess')}</Alert>}
      <TableContainer component={Paper}>
        <Table
          aria-label="collapsible table"
          sx={{ width: { xs: 'calc(100% - 48px)', md: '100%' } }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>{t('proposalsList.createdAt')}</TableCell>
              <TableCell align="right">{t('proposalsList.price')}</TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proposals.map((proposal) => (
              <ProposalRow
                key={proposal.created_at}
                row={proposal}
                setProposals={setProposals}
                setSuccess={setSuccess}
                setError={setError}
                setSuccessDelete={setSuccessDelete}
                setErrorDelete={setErrorDelete}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProposalList;
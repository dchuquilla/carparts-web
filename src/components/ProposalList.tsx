import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CircularProgress } from '@mui/material';
import CreateProposalData from '../types/CreateProposalData';
import ProposalRow from './ProposalRow';

interface ProposalProps {
  isAuthenticated: boolean;
  requestId?: string;
}

const ProposalList:React.FC<ProposalProps> = ({ isAuthenticated, requestId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<Array<ReturnType<typeof CreateProposalData>>>([]);
  useEffect(() => {
    if(isAuthenticated) {
      const token = localStorage.getItem('token');
      const prevRows: Array<ReturnType<typeof CreateProposalData>> = [];
      const fetchData = async () => {
        try {
          const res = await fetch(`https://dev-api.quientiene.com/api/v1/proposals?request_id=${requestId}`, {
            headers: {
              Authorization: `${token}`,
            },
          });
          if (res.ok) {
            const data = await res.json() as Array<{
              id: number;
              created_at: string;
              formatted_price: string;
              notes: string;
              warranty_months: number;
              delivery_time_days: number;
            }>;
            if (Array.isArray(data)) {
              data.forEach((proposal) => {
                prevRows.push(
                  CreateProposalData(
                    proposal.id,
                    proposal.created_at,
                    proposal.formatted_price,
                    proposal.notes,
                    proposal.warranty_months,
                    proposal.delivery_time_days
                  )
                );
              });
              setProposals(prevRows);
            } else {
              setProposals([]);
            }
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        } finally {
          setLoading(false);
        }
        setLoading(false);
      };
      void fetchData();
    }
  }, [isAuthenticated, requestId]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Table
        aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>{t('proposalsList.createdAt')}</TableCell>
            <TableCell align="right">{t('proposalsList.price')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {proposals.map((proposal) => (
            <ProposalRow key={proposal.created_at} row={proposal} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProposalList;
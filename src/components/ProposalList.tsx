import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CircularProgress } from '@mui/material';

function createData(
  id: number,
  created_at: string,
  formatted_price: string,
  notes: string,
  warranty_months: number,
  delivery_time_days: number
) {
  return {
    id,
    created_at,
    formatted_price,
    history: {
      description: notes,
      warranty: warranty_months,
      delivery: delivery_time_days,
    },
  };
}


function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.created_at}</TableCell>
        <TableCell align="right">{row.formatted_price}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalles
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Descripción</TableCell>
                    <TableCell align="right">Garantía (meses)</TableCell>
                    <TableCell align="right">Entrega (días)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.history.description}
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

interface SignInProps {
  isAuthenticated: boolean;
  requestId?: string;
}

const ProposalList:React.FC<SignInProps> = ({ isAuthenticated, requestId }) => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Array<ReturnType<typeof createData>>>([]);
  useEffect(() => {
    if(isAuthenticated) {
      const token = localStorage.getItem('token');
      const prevRows: Array<ReturnType<typeof createData>> = [];
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
                  createData(
                    proposal.id,
                    proposal.created_at,
                    proposal.formatted_price,
                    proposal.notes,
                    proposal.warranty_months,
                    proposal.delivery_time_days
                  )
                );
              });
              setRows(prevRows);
            } else {
              setRows([]);
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
            <TableCell>Enviado</TableCell>
            <TableCell align="right">Precio</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.created_at} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProposalList;
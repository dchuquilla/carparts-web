/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Container, CircularProgress, Card, CardContent, CardActions } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import AddIcon from '@mui/icons-material/Add';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import RequestType from '../types/RequestType';
import RequestCard from '../components/RequestCard';
import ProposalList from '../components/ProposalList';
import ProposalForm from '../components/ProposalForm';
import CreateProposalData from '../types/CreateProposalData';

interface SignInProps {
  isAuthenticated: boolean;
}

const RequestDetails:React.FC<SignInProps> = ({ isAuthenticated }) => {
  const { t } = useTranslation();
  const { show_key } = useParams();
  const [requestData, setRequestData] = useState<RequestType | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const [proposals, setProposals] = useState<Array<ReturnType<typeof CreateProposalData>>>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const requestUrl = token
      ? `https://dev-api.quientiene.com/api/v1/requests/${show_key}`
      : `https://dev-api.quientiene.com/api/v1/requests/details/${show_key}`
    axios.get(requestUrl)
      .then(response => {
        setRequestData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching request details:', error);
        setLoading(false);
      });

    if(isAuthenticated) {
      const token = localStorage.getItem('token');
      const prevRows: Array<ReturnType<typeof CreateProposalData>> = [];
      const fetchData = async () => {
        try {
          const res = await fetch(`https://dev-api.quientiene.com/api/v1/proposals?request_id=${show_key}`, {
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

  }, [isAuthenticated, show_key]);

  const handleImageLoad = () => {
    setLoadingImage(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!requestData) {
    return <Typography variant="h6">{t('requestDetails.notDetailsFound')}</Typography>;
  }

  return (
    <Container maxWidth={false}
      sx={{
        height: 'calc(100vh - 120px)', // 120px AppBar height
        pt: 0,
        pb: 0,
        // Adjust for AppBar height (120px default desktop, 56px mobile)
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          height: 'calc(100vh - 120px)', // 120px AppBar height
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Grid container spacing={2}
          sx={{
            flex: 1,
            height: '100%',
            alignItems: 'stretch',
          }}
        >
          <Grid item xs={12} md={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: { xs: 'auto', md: '100%' },
            }}
          >
            <Paper elevation={3}
              sx={{
                padding: 2,
                marginTop: 2,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
              }}
            >
              <RequestCard key={requestData.show_key} request={requestData} onClick={handleClickOpen}
                loadingImage={loadingImage}
                onImageLoad={handleImageLoad}
                sx={{
                  flex: 1,
                  textDecoration: 'none'
                }}
              />
              <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogContent>
                  {loadingImage && <CircularProgress />}
                  <img
                    src={requestData.part_image ? requestData.part_image : "/quien_tiene_logo_n.png"}
                    alt={t('requestDetails.partImage')}
                    style={{ width: '100%', display: loadingImage ? 'none' : 'block' }}
                    onLoad={handleImageLoad}
                  />
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={handleClose}>
                    {t('close')}
                  </Button>
                </DialogActions>
              </Dialog>
            </Paper>
          </Grid>
          <Grid xs={12} md={8} item
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: { xs: 'auto', md: '100%' },
            }}
          >
            <Paper elevation={3}
              sx={{
                padding: 2,
                marginTop: 2,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
              }}
            >
                <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <CardContent sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                  <Typography gutterBottom variant="h4" component="div">
                    {t('proposalsList.title')}
                  </Typography>
                  <ProposalList proposals={proposals} />
                </CardContent>
                <CardActions sx={{ mt: 'auto', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f7fa' }}>
                  <BottomNavigation
                    showLabels
                    sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
                  >
                    <BottomNavigationAction onClick={handleOpenModal} label={t('proposalsList.addProposal')} icon={<AddIcon />} />
                  </BottomNavigation>
                </CardActions>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {t('proposalForm.title')}
          </Typography>
          <ProposalForm setProposals={setProposals} setOpenModal={setOpenModal}
            proposal={{
              requestId: show_key ? parseInt(show_key, 10) : undefined,
              price: null, 
              notes: null, 
              warrantyMonths: 1,
              deliveryTimeDays: 1
            }} />
        </Box>
      </Modal>
    </Container>
  );
};

export default RequestDetails;

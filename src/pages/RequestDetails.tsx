/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosInstance';
import { Container, CircularProgress, Card, CardContent, CardActions } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';

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
  const [proposals, setProposals] = useState<Array<ReturnType<typeof CreateProposalData>>>([]);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const token = localStorage.getItem('token');


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
    const requestUrl = token
      ? `https://dev-api.quientiene.com/api/v1/requests/${show_key}`
      : `https://dev-api.quientiene.com/api/v1/requests/details/${show_key}`
    axiosInstance.get(requestUrl)
      .then(response => {
        setRequestData(response.data);
        if(response.data?.proposals) {
          setProposals(
            response.data.proposals.map((proposal: { notes: string; warranty_months: number; delivery_time_days: number; created_at: string; formatted_created_at: string; }) => ({
              ...proposal,
              created_at: proposal.formatted_created_at, // Use formatted_created_at here
              history: {
                notes: proposal.notes,
                warranty: proposal.warranty_months,
                delivery: proposal.delivery_time_days,
              },
            }))
          );
        }
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
          const res = await axiosInstance.get(`https://dev-api.quientiene.com/api/v1/proposals?request_id=${show_key}`, {
            headers: {
              Authorization: `${token}`,
            },
          });
          if (res.status === 200) {
            const data = res.data as Array<{
              id: number;
              created_at: string;
              formatted_price: string;
              formatted_created_at: string;
              notes: string;
              warranty_months: number;
              delivery_time_days: number;
              status: string;
            }>;
            if (Array.isArray(data)) {
              data.forEach((proposal) => {
                prevRows.push(
                  CreateProposalData(
                    proposal.id,
                    proposal.created_at,
                    proposal.formatted_price,
                    proposal.formatted_created_at,
                    proposal.notes,
                    proposal.warranty_months,
                    proposal.delivery_time_days,
                    proposal.status
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

  }, [isAuthenticated, token, show_key]);

  const handleImageLoad = () => {
    setLoadingImage(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!requestData) {
    const redirectUri = '/signin?redirect_to=' + encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = redirectUri;
  }

  return (
    <Container
      sx={{
        height: 'calc(100vh - 120px)', // 120px AppBar height
        pt: 0,
        pb: 0,
        // Adjust for AppBar height (120px default desktop, 56px mobile)
        boxSizing: 'border-box',
      }}
    >

      <h1>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
          variant="outlined"
          color="primary"
          component={Link}
          to="/requests"
          sx={{
            borderRadius: '50%',
            minWidth: '40px',
            width: '40px',
            height: '40px',
            padding: '0',
            margin: '0 5px 0 0',
          }}
          >
            <ArrowBackIosRoundedIcon />
          </Button>

          {t('requestDetails.title')}
        </Box>
      </h1>
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
            width: '100%',
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
              {requestData && (
                <RequestCard key={requestData.show_key} request={requestData} onClick={handleClickOpen}
                  loadingImage={loadingImage}
                  onImageLoad={handleImageLoad}
                  sx={{
                    flex: 1,
                    textDecoration: 'none'
                  }}
                />
              )}
              <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogContent>
                  {loadingImage && <CircularProgress />}
                  <img
                    src={requestData?.part_image ? requestData.part_image : "/quien_tiene_logo_n.png"}
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
          <Grid item
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: { xs: 'auto', md: '100%' },
              padding: { xs: 1, md: 2 },
            }}
          >
            <Paper elevation={3}
              sx={{
                padding: {xs: 1, md: 2},
                marginTop: 2,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
              }}
            >
              <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, padding: { xs: 1, md: 2 } }}>
                <CardContent sx={{ flex: 1, minHeight: 0, overflow: 'auto', padding: { xs: 1, md: 2 } }}>
                  <Typography gutterBottom variant="h4" component="div">
                    {t('proposalsList.title')}
                  </Typography>
                  <ProposalList proposals={proposals} isAuthenticated={isAuthenticated} setProposals={setProposals} />
                </CardContent>

                {isAuthenticated && (
                  <CardActions sx={{ mt: 'auto', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f7fa' }}>
                    <BottomNavigation
                      showLabels
                      sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
                    >
                      <BottomNavigationAction onClick={handleOpenModal} label={t('proposalsList.addProposal')} 
                      icon={<AddIcon />} />
                    </BottomNavigation>
                  </CardActions>
                )}
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-notes"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {t('proposalForm.title')}
          </Typography>
          <ProposalForm 
            previousProposals={proposals}
            setProposals={setProposals} 
            setOpenModal={setOpenModal}
            proposal={{
              requestId: show_key ? parseInt(show_key, 10) : undefined,
              price: null, 
              notes: null, 
              warrantyMonths: 1,
              deliveryTimeDays: 1
            }} 
          />
        </Box>
      </Modal>
    </Container>
  );
};

export default RequestDetails;

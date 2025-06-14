/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Container, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

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


const RequestDetails = () => {
  const { t } = useTranslation();
  const { show_key } = useParams();
  const [requestData, setRequestData] = useState<RequestType | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);
  const [value, setValue] = React.useState(0);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios.get(`https://dev-api.quientiene.com/api/v1/requests/details/${show_key}`)
      .then(response => {
        console.log('Request details:', response.data);
        setRequestData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching request details:', error);
        setLoading(false);
      });
  }, [show_key]);

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
    <Container
      maxWidth={false}
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
        <Grid
          container
          spacing={2}
          sx={{
            flex: 1,
            height: '100%',
            alignItems: 'stretch',
          }}
        >
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: { xs: 'auto', md: '100%' },
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                marginTop: 2,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
              }}
            >
              <RequestCard key={requestData.show_key}
                request={requestData}
                sx={{ flex: 1, textDecoration: 'none' }}
                onClick={handleClickOpen}
                loadingImage={loadingImage}
                onImageLoad={handleImageLoad}
              />
              <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
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
          <Grid
            xs={12}
            md={8}
            item
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: { xs: 'auto', md: '100%' },
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: 2,
                marginTop: 2,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
              }}
            >
              <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                {t('proposalsList.title')}
              </Typography>

              <BottomNavigation
                showLabels
                value={value}
                onChange={(_event, newValue) => {
                  setValue(newValue);
                }}
              >
                <BottomNavigationAction label={t('proposalsList.addProposal')} icon={<AddIcon />} />
                {/* <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
                <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} /> */}
              </BottomNavigation>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default RequestDetails;

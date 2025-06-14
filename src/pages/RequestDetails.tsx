/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Container, CircularProgress, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import AddIcon from '@mui/icons-material/Add';
import KeyboardDoubleArrowRightTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowRightTwoTone';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


interface RequestData {
  show_key: string;
  part_image?: string;
  part_name?: string;
  part_brand?: string;
  part_model?: string;
  part_year?: string;
  part_chassis?: string;
}

const RequestDetails = () => {
  const { t } = useTranslation();
  const { show_key } = useParams();
  const [requestData, setRequestData] = useState<RequestData | null>(null);
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
              <Card key={requestData.show_key} onClick={handleClickOpen} sx={{ flex: 1 }}>
                <CardActionArea>
                  {loadingImage && <CircularProgress />}
                  <CardMedia
                    component="img"
                    height="140"
                    image={requestData.part_image ? requestData.part_image : "/quien_tiene_logo_n.png"}
                    alt={t('requestDetails.partImage')}
                    onLoad={handleImageLoad}
                    style={{ display: loadingImage ? 'none' : 'block' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {requestData.part_name ? requestData.part_name.toUpperCase() : ''}
                    </Typography>
                    <Divider />
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <KeyboardDoubleArrowRightTwoToneIcon sx={[ { minWidth: 0, justifyContent: 'center' } ]} />
                        </ListItemIcon>
                        <ListItemText primary={requestData.part_brand} secondary={t('requestDetails.partBrand')} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <KeyboardDoubleArrowRightTwoToneIcon sx={[ { minWidth: 0, justifyContent: 'center' } ]} />
                        </ListItemIcon>
                        <ListItemText primary={requestData.part_model} secondary={t('requestDetails.partModel')} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <KeyboardDoubleArrowRightTwoToneIcon sx={[ { minWidth: 0, justifyContent: 'center' } ]} />
                        </ListItemIcon>
                        <ListItemText primary={requestData.part_year} secondary={t('requestDetails.partYear')} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <KeyboardDoubleArrowRightTwoToneIcon sx={[ { minWidth: 0, justifyContent: 'center' } ]} />
                        </ListItemIcon>
                        <ListItemText primary={requestData.part_chassis} secondary={t('requestDetails.partChassis')} />
                      </ListItem>
                    </List>
                  </CardContent>
                </CardActionArea>
              </Card>

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
              {/* <Fab size="small" color="secondary" aria-label="add">
                <AddIcon />
              </Fab> */}
              <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
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

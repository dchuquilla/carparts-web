/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, CircularProgress, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import KeyboardDoubleArrowRightTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowRightTwoTone';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

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
  const { show_key } = useParams();
  const [requestData, setRequestData] = useState<RequestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);

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
    return <Typography variant="h6">No request details found.</Typography>;
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
              <Card key={requestData.show_key} onClick={handleClickOpen}>
                <CardActionArea>
                  {loadingImage && <CircularProgress />}
                  <CardMedia
                    component="img"
                    height="140"
                    image={requestData.part_image ? requestData.part_image : "/quien_tiene_logo_n.png"}
                    alt="Part Image"
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
                        <ListItemText primary={requestData.part_brand} secondary='Marca' />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <KeyboardDoubleArrowRightTwoToneIcon sx={[ { minWidth: 0, justifyContent: 'center' } ]} />
                        </ListItemIcon>
                        <ListItemText primary={requestData.part_model} secondary='Modelo' />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <KeyboardDoubleArrowRightTwoToneIcon sx={[ { minWidth: 0, justifyContent: 'center' } ]} />
                        </ListItemIcon>
                        <ListItemText primary={requestData.part_year} secondary='Año' />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <KeyboardDoubleArrowRightTwoToneIcon sx={[ { minWidth: 0, justifyContent: 'center' } ]} />
                        </ListItemIcon>
                        <ListItemText primary={requestData.part_chassis} secondary='Chasis' />
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
                    alt="Part Image"
                    style={{ width: '100%', display: loadingImage ? 'none' : 'block' }}
                    onLoad={handleImageLoad}
                  />
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={handleClose}>
                    Cerrar
                  </Button>
                </DialogActions>
              </Dialog>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
              <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
                Propuestas
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default RequestDetails;

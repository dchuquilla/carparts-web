import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import axios from 'axios';
import { Box, Divider, IconButton, List, ListItem, ListItemText } from '@mui/material';

const RequestList: React.FC = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/requests')
      .then(response => {
        setRequests(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the requests!', error);
      });
  }, []);

  return (
    <div>
      <h1>Solicitudes de Repuestos</h1>
      <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
        gap: 2,
      }}
      >
        {requests.map((request: any) => (
          <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image="/quien_tiene_logo_n.png"
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {request.part_name.toUpperCase()}
                </Typography>
                <Divider />
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem
                    key={request.id}
                    disableGutters
                  >
                    <ListItemText primary={`Marca: ${request.part_brand}`} />
                  </ListItem>
                  <ListItem
                    key={request.id}
                    disableGutters
                  >
                    <ListItemText primary={`Modelo: ${request.part_model}`} />
                  </ListItem>
                  <ListItem
                    key={request.id}
                    disableGutters
                  >
                    <ListItemText primary={`Año: ${request.part_year}`} />
                  </ListItem>
                </List>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </div>
  );
};

export default RequestList;

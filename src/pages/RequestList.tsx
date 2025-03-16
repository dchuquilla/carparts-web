import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import axios from 'axios';
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import KeyboardDoubleArrowRightTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowRightTwoTone';
import { useNavigate } from 'react-router-dom';

const RequestList: React.FC = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://dev-api.quientiene.com/api/v1/requests')
      .then(response => {
        setRequests(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the requests!', error);
      });
  }, []);

  const handleCardClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, to: string) => {
    event.preventDefault();
    setTimeout(() => {
      void navigate(to);
    }, 200); // 200ms delay
  };

  return (
    <div>
      <h1>Solicitudes de Repuestos</h1>
      <Box sx={{
        width: '100%', display: 'grid', gap: 2,
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
      }}>
        {requests.map((request: any) => (
          <Card key={request.id} sx={{ maxWidth: 345, textDecoration: 'none' }} component="a" href="/"
            onClick={(event) => handleCardClick(event, "/")}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={request.part_image ? request.part_image : "/quien_tiene_logo_n.png"}
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {request.part_name.toUpperCase()}
                </Typography>
                <Divider />
                <List>
                  <ListItem key={request.id}>
                    <ListItemIcon>
                      <KeyboardDoubleArrowRightTwoToneIcon sx={[ { minWidth: 0, justifyContent: 'center' } ]} />
                    </ListItemIcon>
                    <ListItemText primary={request.part_brand} secondary='Marca' />
                  </ListItem>
                  <ListItem key={request.id}>
                    <ListItemIcon>
                      <KeyboardDoubleArrowRightTwoToneIcon sx={[ { minWidth: 0, justifyContent: 'center' } ]} />
                    </ListItemIcon>
                    <ListItemText primary={request.part_model} secondary='Modelo' />
                  </ListItem>
                  <ListItem key={request.id}>
                    <ListItemIcon>
                      <KeyboardDoubleArrowRightTwoToneIcon sx={[ { minWidth: 0, justifyContent: 'center' } ]} />
                    </ListItemIcon>
                    <ListItemText primary={request.part_year} secondary='Año' />
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

import { t } from 'i18next';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import { List } from '@mui/material';


const StoreConfirmation: React.FC = () => {
  const { confirmation_token } = useParams<{ confirmation_token: string }>();
  useEffect(() => {
    axiosInstance.get(`https://dev-api.quientiene.com/users/confirmation?confirmation_token=${confirmation_token}`)
      .then(response => {
        // Manejar la respuesta de la verificación del token
        console.log('Store confirmed:', response.data);
      })
      .catch(error => {
        // Manejar errores
        console.error('Error confirming store:', error);
      });
  }, [confirmation_token]);

  return (
    <div>
      <Card
        size="lg"
        variant="plain"
        orientation="horizontal"
        sx={{
          textAlign: 'center',
          maxWidth: '100%',
          width: { xs: '100%', sm: 800, md: 1240 }, // responsive width
          // to make the demo resizable
          resize: 'horizontal',
          overflow: 'auto',
        }}
      >
        <CardOverflow
          variant="solid"
          sx={{
            flex: { xs: '0 0 100%', sm: '0 0 400px', md: '0 0 620px' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: 'var(--Card-padding)',
            backgroundColor: '#3d1766',
          }}
        >
          <AspectRatio ratio="23/19" objectFit="contain" variant="plain">
            <img
              srcSet={`/qrPichincha.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              src={`/qrPichincha.png?w=164&h=164&fit=crop&auto=format`}
              alt={"QR deUna de QuienTiene.com"}
              loading="lazy"
            />
          </AspectRatio>
        </CardOverflow>
        <CardContent sx={{ gap: 1.5, minWidth: 200 }}>
          <AspectRatio ratio="19/8" objectFit="contain" variant="plain">
            <img
              alt=""
              src="/quien-tiene-sale-r.jpg"
            />
          </AspectRatio>
          <CardContent>
            <Typography level="title-lg">{t("storeConfirmation.title")}</Typography>
            <List sx={{ textAlign: 'left', listStyle: 'none', p: 0, m: 0 }}>
              <li>
                <Typography>
                  <CheckTwoToneIcon />
                  Aumento de hasta 20% en las ventas
                </Typography>
              </li>
              <li>
                <Typography>
                  <CheckTwoToneIcon />
                  Soporte 24/7
                </Typography>
              </li>
              <li>
                <Typography>
                  <CheckTwoToneIcon />
                  Acceso al catálogo de solicitudes
                </Typography>
              </li>
            </List>
            <Typography sx={{ fontSize: 'sm', mt: 0.5 }}>
              {t("storeConfirmation.confirmationToken")}
            </Typography>
          </CardContent>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/"
            sx={{
              '--variant-borderWidth': '2px',
              borderRadius: 40,
              borderColor: 'primary.500',
              mx: 'auto',
            }}
          >
            {t("storeConfirmation.goToHome")}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/signin"
            sx={{
              '--variant-borderWidth': '2px',
              borderRadius: 40,
              borderColor: 'primary.500',
              mx: 'auto',
            }}
          >
            {t("sessionForm.login")}
          </Button>
        </CardContent>
      </Card>

    </div>
  );
};

export default StoreConfirmation;
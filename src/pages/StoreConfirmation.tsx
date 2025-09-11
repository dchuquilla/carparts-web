import { t } from 'i18next';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { ImageList, ImageListItem } from '@mui/material';

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
      <h1>{t("storeConfirmation.title")}</h1>
      <p>{t("storeConfirmation.confirmationToken")}</p>

      <ImageList sx={{ width: { xs: '100%', sm: '50%', md: '35%' } }} cols={1}>
        <ImageListItem key={"qr-pichincha"}>
          <img
            srcSet={`/qrPichincha.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`/qrPichincha.png?w=164&h=164&fit=crop&auto=format`}
            alt={"QR deUna de QuienTiene.com"}
            loading="lazy"
          />
        </ImageListItem>
      </ImageList>

      <Link to="/">{t("storeConfirmation.goToHome")}</Link>
    </div>
  );
};

export default StoreConfirmation;
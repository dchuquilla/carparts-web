/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RequestCard from '../components/RequestCard';

const RequestList: React.FC = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    axios.get('https://dev-api.quientiene.com/api/v1/requests')
      .then(response => {
        setRequests(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the requests!', error);
        setLoading(false);
      });
  }, []);

    const handleImageLoad = () => {
      setLoadingImage(false);
    };

    if (loading) {
      return <CircularProgress />;
    }

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, to: string) => {
    event.preventDefault();
    setTimeout(() => {
      void navigate(to);
    }, 200); // 200ms delay
  };

  return (
    <div>
      <h1>{t('requestsList.title')}</h1>
      <Box sx={{
        width: '100%', display: 'grid', gap: 2,
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
      }}>
        {requests.map((request: any) => (
          <RequestCard key={request.id} sx={{ maxWidth: 345, textDecoration: 'none' }}
            request={request}
            onClick={(event) => handleCardClick(event, `/requests/${request.show_key}`)}
            loadingImage={loadingImage}
            onImageLoad={handleImageLoad}
          />
        ))}
      </Box>
    </div>
  );
};

export default RequestList;

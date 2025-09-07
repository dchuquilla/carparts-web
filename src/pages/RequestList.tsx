/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosInstance';
import { Box, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RequestCard from '../components/RequestCard';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';

interface SignInProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const RequestList: React.FC<SignInProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  // const [requestsMeta, setRequestsMeta] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    axiosInstance.get('https://dev-api.quientiene.com/api/v1/requests')
      .then(response => {
        setRequests(response.data.requests);
        // setRequestsMeta(response.data.meta);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the requests!', error);
        setLoading(false);
      });
  }, [setIsAuthenticated]);

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
      <h1>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {t('requestsList.title')}
          <Button
          variant="outlined"
          color="primary"
          sx={{
            borderRadius: '50%',
            minWidth: '40px',
            width: '40px',
            height: '40px',
            padding: '0',
            margin: '0 5px 0 0',
          }}
          >
            <TuneRoundedIcon />
          </Button>
        </Box>
      </h1>
      <Box sx={{
        width: '100%', display: 'grid', gap: 2,
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
      }}>
        {requests.map((request: any) => (
          <RequestCard key={request.id} sx={{ maxWidth: 345, textDecoration: 'none' }}
            request={request}
            onClick={(event) => handleCardClick(event, `/requests/${isAuthenticated ? request.id : request.show_key}`)}
            loadingImage={loadingImage}
            onImageLoad={handleImageLoad}
          />
        ))}
      </Box>
    </div>
  );
};

export default RequestList;

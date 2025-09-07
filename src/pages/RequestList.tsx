/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosInstance';
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Container, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RequestCard from '../components/RequestCard';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import RequestsFilter, { DEFAULT_FILTERS, RequestsFilterState, buildRansackSearchParams, RequestsMeta } from '../components/RequestsFilter';

interface SignInProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const RequestList: React.FC<SignInProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // FILTERING
  const [filters, setFilters] = React.useState<RequestsFilterState>({ ...DEFAULT_FILTERS });
  const [page, setPage] = React.useState<number>(1);
  const [perPage] = React.useState<number>(20);
  const [meta, setMeta] = React.useState<RequestsMeta>({
    page: 1, per_page: 20, pages: 1, count: 0, car_brands: [], car_models: [], car_years: []
  });

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: { xs: 1, sm: 2 },
  };

  const fetchData = React.useCallback((pageArg?: number) => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    // Filtering
    const params = buildRansackSearchParams(filters);
      params.set("page", String(pageArg ?? page));
      params.set("per_page", String(perPage));

    axiosInstance.get(`https://dev-api.quientiene.com/api/v1/requests?${params.toString()}`)
      .then(response => {
        setRequests(response.data.requests);
        console.log("requestsMeta:", response.data.meta);
        setMeta(response.data.meta);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the requests!', error);
        setLoading(false);
      });
  }, [filters, page, perPage, setIsAuthenticated]);

  useEffect(() => { fetchData(); }, [fetchData]);

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

  // Filtering
  const handleApply = () => { setPage(1); fetchData(1); setOpenModal(false); };
  const handleReset = () => { setPage(1); setFilters({ ...DEFAULT_FILTERS }); };
  // const handlePage = (_: React.ChangeEvent<unknown>, value: number) => { setPage(value); fetchData(value); };

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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {t('requestsList.title')}
          <Button
          variant="outlined"
          color="primary"
          onClick={handleOpenModal} 
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

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-notes"
      >
        <Card sx={modalStyle}>
          <CardHeader title={t('requestFilter.title')} />
          <CardContent sx={{ p: 0 }}>
            <Box
              component="form"
              sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
              noValidate
              autoComplete="off"
            >
              <RequestsFilter
                value={filters}
                onChange={setFilters}
                onApply={handleApply}
                onReset={handleReset}
                requestMeta={meta} // <-- pass meta from server
                showApplyButton
              />
            </Box>
          </CardContent>
        </Card>
      </Modal>
    </Container>
  );
};

export default RequestList;

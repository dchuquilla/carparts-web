import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardDoubleArrowRightTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowRightTwoTone';
import { SxProps } from '@mui/material';
import { useTranslation } from 'react-i18next';
import RequestType from '../types/RequestType';

interface RequestCardProps {
  request: RequestType;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  sx?: SxProps;
  loadingImage?: boolean;
  onImageLoad?: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onClick,
  sx,
  loadingImage,
  onImageLoad,
}) => {
  const { t } = useTranslation();

  return (
    <Card
      sx={sx}
      onClick={onClick}
    >
      <CardActionArea>
        {loadingImage && <CircularProgress />}
        <CardMedia
          component="img"
          height="70"
          image={request.part_image ? request.part_image : "/quien_tiene_logo_n.png"}
          alt={t('requestDetails.partImage')}
          onLoad={onImageLoad}
          style={{ display: loadingImage ? 'none' : 'block' }}
        />
        <CardContent sx={{ p: { xs: 1, md: 2 } }}>
          <Typography gutterBottom variant="h5" component="div">
            {request.part_name ? request.part_name.toUpperCase() : ''}
          </Typography>
          <Divider />
          <List>
            <ListItem sx={{ pt: { xs: 0, md: 2 } }}>
              <ListItemIcon>
                <KeyboardDoubleArrowRightTwoToneIcon sx={[{ minWidth: 0, justifyContent: 'center' }]} />
              </ListItemIcon>
              <ListItemText primary={request.formatted_created_at} secondary={t('requestDetails.createdAt')} />
            </ListItem>
            <ListItem sx={{ pt: { xs: 0, md: 2 } }}>
              <ListItemIcon>
                <KeyboardDoubleArrowRightTwoToneIcon sx={[{ minWidth: 0, justifyContent: 'center' }]} />
              </ListItemIcon>
              <ListItemText primary={`${request.part_brand} / ${request.part_model}`} secondary={`${t('requestDetails.partBrand')} / ${t('requestDetails.partModel')}`} />
            </ListItem>
            <ListItem sx={{ pt: { xs: 0, md: 2 } }}>
              <ListItemIcon>
                <KeyboardDoubleArrowRightTwoToneIcon sx={[{ minWidth: 0, justifyContent: 'center' }]} />
              </ListItemIcon>
              <ListItemText primary={request.part_year} secondary={t('requestDetails.partYear')} />
            </ListItem>
            {request.part_chassis && (
              <ListItem sx={{ pt: { xs: 0, md: 2 } }}>
              <ListItemIcon>
                <KeyboardDoubleArrowRightTwoToneIcon sx={[{ minWidth: 0, justifyContent: 'center' }]} />
              </ListItemIcon>
              <ListItemText primary={request.part_chassis} secondary={t('requestDetails.partChassis')} />
              </ListItem>
            )}
          </List>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RequestCard;

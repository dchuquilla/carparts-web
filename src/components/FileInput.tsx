import React, { useRef, useState } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import imageCompression from 'browser-image-compression';
import axiosInstance from '../api/axiosInstance';
import { t } from 'i18next';

interface FileInputProps {
  uploadUrl: string;
  onUpload?: (url: string) => void;
}

const FileInput: React.FC<FileInputProps> = ({ uploadUrl, onUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      // Opciones de compresión
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      // Enviar al backend
      const formData = new FormData();
      formData.append('image', compressedFile);

      const response = await axiosInstance.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      if (onUpload) onUpload(response.data.url);
    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => { void handleFileChange(e); }}
        name="partImage"
      />
      <Button
        variant="contained"
        startIcon={<PhotoCameraIcon />}
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        fullWidth
      >
        {t('proposalForm.uploadImage')}
      </Button>
      {preview && (
        <Box mt={2} sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2">{ loading ? <CircularProgress size={24} /> : t('proposalForm.imagePreview') }</Typography>
          <img src={preview} alt="preview" style={{ maxWidth: 200, borderRadius: 8, filter: loading ? 'blur(19px)' : 'none' }} />
        </Box>
      )}
      
    </Box>
  );
};

export default FileInput;
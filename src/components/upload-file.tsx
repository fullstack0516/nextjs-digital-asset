import React, { useCallback } from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { getLanguage } from '../langauge/language';
import SvgUpload from '../../public/upload-1.svg';
import { UploadedFile } from './uploaded-file';

export default function UploadFile({ file, setFile }: { file?: File, setFile: (file: File) => void }) {
  const classes = useStyles();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'video/*' });

  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      {file ? (
        <Box width='100%'>
          <UploadedFile file={file} onRemove={() => setFile(null)} />
        </Box>
      ) : (
        // drop zone
        <div {...getRootProps()} style={{ outline: 'none', width: '100%' }}>
          <input {...getInputProps()} />
          <Box
            width={'100%'}
            mb={2}
            className={classes.dropZone}
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            style={{ opacity: isDragActive && 0.5, borderColor: isDragActive && '#FF7534' }}
          >
            <Box display='flex' p={1.5} mt={1.5}>
              <SvgUpload width={16} height={16} />
            </Box>
            <Typography className={classes.subtitle} variant='h6' component='p'>
              {getLanguage().dropFilesHere},&nbsp;{getLanguage().or}&nbsp;
              <Typography variant='h6' component='a' color='primary'>
                {getLanguage().browse}
              </Typography>
            </Typography>
          </Box>
          <Typography variant='h6' color='textSecondary' style={{ lineHeight: '26px' }}>
            {getLanguage().maximumVideoUpload}
          </Typography>
        </div>
      )}
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialog-paper': {
      maxWidth: '500px !important'
    },
    position: 'relative'
  },
  subtitle: {
    padding: theme.spacing(1)
  },
  dropZone: {
    background: theme.palette.background.default,
    borderStyle: 'dashed',
    border: '2px dashed #8F92A1',
    borderRadius: theme.spacing(2),
    cursor: 'pointer',
    '& > div': {
      mixBlendMode: 'normal',
      border: '2px solid #F2F2FE',
      borderRadius: theme.spacing(2)
    },
    '& > p': {
      lineHeight: '20px',
      color: '#90A7B3'
    }
  }
}));

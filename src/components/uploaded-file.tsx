import React, { useRef, useState } from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

type Props = {
  file: File;
  onRemove?: (file: File) => void;
};

export const UploadedFile: React.FC<Props> = ({ file, onRemove }) => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Typography variant='h5'>{file.name}</Typography>
      <CloseIcon onClick={() => onRemove(file)} className={classes.moreAction} />
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  moreAction: {
    color: '#92929D',
    height: 22,
    cursor: 'pointer',
    marginLeft: theme.spacing(2),
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    border: '2px dashed #8F92A1',
    borderRadius: theme.spacing(2),
    padding: '16px 24px',
  }
}));

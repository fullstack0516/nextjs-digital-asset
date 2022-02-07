import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
  Button
} from '@material-ui/core';
import { getLanguage } from '../../../langauge/language';
import CustomHeader from '../../../components/custom-header';
import { adminFetchVideoSF, server } from '../../../utils/server/graphql_server';
import { Video } from '../../../models/video';
import { VideoPlayer } from '../../../components/video-player';
import ConfirmDialog from '../../../components/confirm-dialog';
import { useRouter } from 'next/router';
import { updateVideoStatus } from '../../../utils/client/admin_actions';

export default function Profile(props: { video: Video }) {
  const classes = useStyles();
  const router = useRouter();
  const { finalUrl, failedFrames } = props.video ?? {};

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'reject' | 'accept'>();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    const intelligenceStatus = confirmAction === 'accept' ? 'COMPLETED' : 'REJECTED';
    setLoading(true);
    await updateVideoStatus({ uid: props.video.uid, intelligenceStatus });
    setLoading(false);
    setIsConfirmOpen(false);
    router.push('/admin/videos');
  };

  return (
    <div className={classes.root}>
      <CustomHeader title='Awake - Admin - Video' />
      <Box m={3}>
        <VideoPlayer src={finalUrl ?? ''} />
      </Box>

      <Box m={3} display='flex'>
        <Button
          color='primary'
          variant='contained'
          onClick={() => {
            setConfirmAction('accept');
            setIsConfirmOpen(true);
          }}
        >
          {getLanguage().accept}
        </Button>
        <Box ml={2} />
        <Button
          variant='contained'
          onClick={() => {
            setConfirmAction('reject');
            setIsConfirmOpen(true);
          }}
        >
          {getLanguage().reject}
        </Button>
      </Box>

      <Box mt={4} m={3}>
        <Box fontSize={16} mb={1}>
          {getLanguage().explicitFrames}
        </Box>
        <TableContainer className={classes.table}>
          <Table>
            <TableHead className='head'>
              <TableRow>
                <TableCell align='left'>{getLanguage().failedTime}</TableCell>
                <TableCell align='left'>{getLanguage().likelihood}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {failedFrames && failedFrames.length ? (
                failedFrames.map((frame) => {
                  const { time, likelihood } = frame;

                  return (
                    <TableRow key={time}>
                      <TableCell align='left'>{time}</TableCell>
                      <TableCell align='left'>{likelihood}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell align='left'>--</TableCell>
                  <TableCell align='left'>--</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <ConfirmDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(() => false)}
        onSave={handleConfirm}
        message={confirmAction === 'accept' ? getLanguage().acceptVideo : getLanguage().rejectVideo}
        loading={loading}
      />
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { req, res, query } = context;
  await server({ req, res });

  const { video } = await adminFetchVideoSF({ uid: query.uid });

  return {
    props: {
      video
    }
  };
};

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 750,
    marginTop: theme.spacing(2)
  },
  table: {
    marginBottom: theme.spacing(3.5),
    borderRadius: theme.spacing(1.3),
    background: theme.palette.secondary.main,
    minWidth: 650,
    '& th, td': {
      borderBottom: 'unset'
    },
    '& thead': {
      background: '#F1F1F5'
    },
    '& tbody': {
      padding: `${theme.spacing(1.2)}px 0`
    }
  }
}));

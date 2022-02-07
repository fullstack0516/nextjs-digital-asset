import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  makeStyles
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useWindowSize } from '../../../utils/client/use-window-size';
import { getLanguage } from '../../../langauge/language';
import moment from 'moment';
import CustomPagination from '../../../components/custom-pagination';
import { sortByProperty } from '../../../utils/helpers';
import CustomHeader from '../../../components/custom-header';
import { adminFetchVideosSF, server } from '../../../utils/server/graphql_server';
import { Video } from '../../../models/video';
import CustomPopper from '../../../components/custom-popper';
import { useRouter } from 'next/router';

const STATUS_COLOR = {
  COMPLETED: '#3DD598',
  FAILED: '#FC5A5A',
  PROGRESS: '#BCBCCA'
};

export default function Videos(props: {
  videosMap: { [videoId: string]: Video };
  totalVideosCount: number;
  page: number;
  show: number;
}) {
  const router = useRouter();
  const size = useWindowSize();
  const classes = useStyles();
  const { page, show, totalVideosCount, videosMap } = props;
  const [selectedUid, setSelectedUid] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMore = (event, uid) => {
    setSelectedUid(uid);
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(() => null);
  };

  const handleChangePage = (event, pageNumber) => {
    window.location.href = `/admin/videos?page=${pageNumber}&show=${show}`;
  };

  const handleChangeNumOfRows = (e) => {
    window.location.href = `/admin/videos?page=${page}&show=${e.target.value}`;
  };

  const videos = sortByProperty(videosMap, 'created', 'desc');
  const countOfPages = Math.ceil(totalVideosCount / show);

  return (
    <Box padding={size.width > 599 ? '36px 40px' : '24px 24px'}>
      <CustomHeader title='Awake - Admin - Videos' />
      <Box mb={4} display='flex' alignItems='center' justifyContent='space-between'>
        <Box display='flex' alignItems='center'>
          <Typography variant='h3' color='textPrimary'>
            <b>{getLanguage().videoProcessings}</b>
          </Typography>
          <Select
            renderValue={(value: number) => (
              <Box display='flex' alignItems='center' width='100%'>
                <Typography variant='h5' color='textSecondary'>
                  {getLanguage().show}:&nbsp;<b>{value}</b>
                </Typography>
              </Box>
            )}
            name='numOfRows'
            value={show}
            onChange={handleChangeNumOfRows}
            className={classes.select}
            displayEmpty
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </Box>
      </Box>
      <TableContainer className={classes.table}>
        <Table>
          <TableHead className='head'>
            <TableRow>
              <TableCell align='left'>{getLanguage().fileName}</TableCell>
              <TableCell align='left'>{getLanguage().processStartedAt}</TableCell>
              <TableCell align='left'>{getLanguage().webOptimization}</TableCell>
              <TableCell align='left'>{getLanguage().explicitContentFilter}</TableCell>
              <TableCell align='left'>{getLanguage().options}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos.map((video) => {
              const { uid, fileName, transcoderStatus, intelligenceStatus, created } = video;

              return (
                <TableRow key={uid}>
                  <TableCell align='left'>{fileName}</TableCell>
                  <TableCell align='left'>{moment(created).format('h:mm:ss a, MMM DD, YYYY')}</TableCell>
                  <TableCell align='left'>
                    <Box display='flex' alignItems='center'>
                      <Box
                        style={{ background: STATUS_COLOR[transcoderStatus] }}
                        width={10}
                        height={10}
                        borderRadius={5}
                        mr={1}
                      />
                      <Typography variant='h5' style={{ color: STATUS_COLOR[transcoderStatus] }}>
                        {transcoderStatus}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align='left'>
                    <Box display='flex' alignItems='center'>
                      <Box
                        style={{ background: STATUS_COLOR[intelligenceStatus] }}
                        width={10}
                        height={10}
                        borderRadius={5}
                        mr={1}
                      />
                      <Typography variant='h5' style={{ color: STATUS_COLOR[intelligenceStatus] }}>
                        {intelligenceStatus}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align='left'>
                    <MoreHorizIcon className={classes.moreAction} onClick={(event) => handleMore(event, uid)} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomPagination count={countOfPages} onChange={handleChangePage} page={page} />
      {/* option popper */}
      <CustomPopper anchorEl={anchorEl} onClose={handleClose}>
        <Box
          className={classes.actions}
          onClick={() => {
            router.push(`/admin/videos/${selectedUid}`);
          }}
        >
          <Typography variant='h6'>{getLanguage().viewDetails}</Typography>
        </Box>
      </CustomPopper>
    </Box>
  );
}

export const getServerSideProps = async (context) => {
  const { req, res, query } = context;
  const { page = 1, show = 10 } = query;
  await server({ req, res });

  try {
    let videosMap = {};

    const { videos, totalCount } = await adminFetchVideosSF({ pageNum: parseInt(page), showCount: parseInt(show) });

    videos.forEach((video) => {
      videosMap = { ...videosMap, [video.uid]: video };
    });

    return {
      props: {
        videosMap,
        totalVideosCount: totalCount,
        page: parseInt(page),
        show: parseInt(show)
      }
    };
  } catch (error) {
    const statusCode = error.response.data.statusCode;
    if (statusCode === 'not-admin') {
      res.writeHead(307, { Location: '/404' });
      return res.end();
    }
  }
};

const useStyles = makeStyles((theme) => ({
  select: {
    width: 150,
    minWidth: 'unset',
    backgroundColor: 'transparent !important',
    marginLeft: theme.spacing(1.5),
    border: 'none',
    height: '45px !important'
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
  },
  moreAction: {
    cursor: 'pointer',
    color: '#92929D'
  },
  actions: {
    cursor: 'pointer',
    padding: '0 8px',
    color: 'white'
  },
  avatar: {
    height: 32,
    width: 32,
    marginRight: theme.spacing(1)
  }
}));

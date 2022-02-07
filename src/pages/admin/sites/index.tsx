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
    makeStyles,
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import BlockIcon from '@material-ui/icons/Block';
import DevicesIcon from '@material-ui/icons/Devices';
import { useWindowSize } from '../../../utils/client/use-window-size';
import { getLanguage } from '../../../langauge/language';
import moment from 'moment';
import CustomPagination from '../../../components/custom-pagination';
import CustomPopper from '../../../components/custom-popper';
import { Site } from '../../../models/site';
import { sortByProperty } from '../../../utils/helpers';
import CustomHeader from '../../../components/custom-header';
import { adminFetchSitesSF, server } from '../../../utils/server/graphql_server';

export default function Sites(props: {
    sitesMap: { [siteUid: string]: Site },
    totalSitesCount: number;
    page: number,
    show: number
}) {
    const size = useWindowSize();
    const classes = useStyles();
    const { page, show, totalSitesCount, sitesMap } = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedSite, setSelectedSite] = useState<Site | undefined>(null);

    const handleMore = (site) => (event) => {
        setSelectedSite(() => site);
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(() => null)
    }

    const handleChangePage = (event, pageNumber) => {
        window.location.href = `/admin/sites?page=${pageNumber}&show=${show}`
    }

    const handleChangeNumOfRows = (e) => {
        window.location.href = `/admin/sites?page=${page}&show=${e.target.value}`
    }

    const sites = sortByProperty(sitesMap, 'createdIso', 'desc');
    const countOfPages = Math.ceil(totalSitesCount / show);

    return (
        <Box padding={size.width > 599 ? "36px 40px" : "24px 24px"}>
            <CustomHeader title="Awake - Admin - Sites" />
            <Box mb={4} display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                    <Typography variant="h3" color="textPrimary"><b>{getLanguage().appSites}</b></Typography>
                    <Select
                        renderValue={(value: number) => (
                            <Box display="flex" alignItems="center" width="100%">
                                <Typography variant="h5" color="textSecondary">
                                    {getLanguage().show}:&nbsp;<b>{value}</b>
                                </Typography>
                            </Box>
                        )}
                        name="numOfRows"
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
                    <TableHead className="head">
                        <TableRow>
                            <TableCell align="left">{getLanguage().siteName}</TableCell>
                            <TableCell align="left">{getLanguage().dateCreated}</TableCell>
                            <TableCell align="left">{getLanguage().views}</TableCell>
                            <TableCell align="left">{getLanguage().options}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sites.map((site) => (
                            <TableRow key={site.uid}>
                                <TableCell component="th" scope="row" style={{ maxWidth: 150 }} >
                                    <Typography className="multi-line-turncate" style={{ maxWidth: '100%' }}>
                                        {site.name}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">{moment(site.createdIso).format('MMM DD, YYYY')}</TableCell>
                                <TableCell align="left">{site.totalVisits}</TableCell>
                                <TableCell align="left">
                                    <MoreHorizIcon className={classes.moreAction} onClick={handleMore(site)} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CustomPagination count={countOfPages} page={page} onChange={handleChangePage} />
            {/* option popper */}
            <CustomPopper anchorEl={anchorEl} onClose={handleClose} >
                <Box display="flex" flexDirection="column">
                    <Box display="flex" alignItems="center" className={classes.actions} onClick={() => window.open(`/pages/${selectedSite?.url}`).focus()}>
                        <DevicesIcon />
                        <Typography variant="h6">{getLanguage().viewSite}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" className={classes.actions} mt={0.25}>
                        <BlockIcon />
                        <Typography variant="h6">{getLanguage().block}</Typography>
                    </Box>
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
        let sitesMap = {};
        const { sites, totalCount } = await adminFetchSitesSF({ pageNum: parseInt(page), showCount: parseInt(show) })

        sites.forEach(site => {
            sitesMap = { ...sitesMap, [site.uid]: site }
        })

        return {
            props: {
                sitesMap,
                totalSitesCount: totalCount,
                page: parseInt(page),
                show: parseInt(show)
            },
        }
    } catch (error) {
        // TODO: error handler
        // const statusCode = error.response.data.statusCode
        // if (statusCode === 'not-admin') {
        //     res.writeHead(307, { Location: "/404" });
        //     return res.end();
        // }
        // console.log(error);
    }
}

const useStyles = makeStyles((theme) => ({
    select: {
        width: 150,
        minWidth: 'unset',
        backgroundColor: 'transparent !important',
        marginLeft: theme.spacing(1.5),
        border: 'none',
        height: '45px !important',
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
            background: '#F1F1F5',
        },
        '& tbody': {
            padding: `${theme.spacing(1.2)}px 0`,
        }
    },
    moreAction: {
        cursor: 'pointer',
        color: '#92929D'
    },
    actions: {
        cursor: 'pointer',
        '& svg': {
            width: 16,
            color: theme.palette.secondary.main
        },
        '& h6': {
            fontSize: 12,
            marginLeft: theme.spacing(1.2),
            color: '#FAFAFB',
            lineHeight: '22px'
        }
    }
}))

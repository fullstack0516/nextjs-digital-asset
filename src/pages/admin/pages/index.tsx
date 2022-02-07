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
    Checkbox,
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import BlockIcon from '@material-ui/icons/Block';
import { useWindowSize } from '../../../utils/client/use-window-size';
import { getLanguage } from '../../../langauge/language';
import moment from 'moment';
import CustomPagination from '../../../components/custom-pagination';
import CustomPopper from '../../../components/custom-popper';
import { sortByProperty } from '../../../utils/helpers';
import CustomHeader from '../../../components/custom-header';
import { Page } from '../../../models/page';
import { adminFetchNewPagesSF, server } from '../../../utils/server/graphql_server';
import { adminUpdatePage } from '../../../utils/client/admin_actions';

export default function Pages(props: {
    pageMap: { [pageUid: string]: Page },
    totalPagesCount: number;
    page: number,
    show: number,
    notShowBlocked: boolean
}) {
    const size = useWindowSize();
    const classes = useStyles();
    const { page, show, totalPagesCount, } = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [pageMap, setPageMap] = useState<{ [pageUid: string]: Page }>(props?.pageMap)
    const [checked, setChecked] = useState<boolean>(true);
    const [selectedPage, setSelectedPage] = useState<Page | undefined>(null);
    const [sortBy, setSortBy] = useState<string>('');

    const sortByOptions = {
        'All Sites': 'All Sites'
    }

    const handleMore = (page) => (event) => {
        setSelectedPage(() => page);
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(() => null)
    }

    const handleChangePage = (event, pageNumber) => {
        window.location.href = `/admin/pages?page=${pageNumber}&show=${show}`
    }

    const handleChangeNumOfRows = (event) => {
        window.location.href = `/admin/pages?page=${page}&show=${event.target.value}`
    }

    const handleCheckBox = (event) => {
        setChecked(() => event.target.checked)
    }

    const handleBlock = async () => {
        setAnchorEl(() => null)
        const res = await adminUpdatePage({ pageToUpdateUid: selectedPage.uid, isBanned: true });
        setPageMap((prePageMap) => ({ ...prePageMap, [res.uid]: { ...prePageMap[res.uid], isBanned: res.isBanned } }))
    }

    let pages = sortByProperty(pageMap, 'numberOfReports', 'desc');
    if (checked) {
        pages = pages.filter(e => !e.isBanned)
    }
    const countOfPages = Math.ceil(totalPagesCount / show);

    return (
        <Box padding={size.width > 599 ? "36px 40px" : "24px 24px"}>
            <CustomHeader title="Awake - Admin - Pages" />
            <Box
                display="flex"
                justifyContent="space-between"
                flexDirection={size.width > 599 ? 'row' : 'column'}
                alignItems={size.width > 599 ? "center" : 'flex-start'}
                mb={4}
            >
                <Box display="flex" alignItems="center">
                    <Typography variant="h3" color="textPrimary"><b>{getLanguage().appPages}</b></Typography>
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
                <Box display="flex" alignItems="center">
                    <Checkbox color="primary" checked={checked} onChange={handleCheckBox} className={classes.checkbox} />
                    <Typography variant="h5" color="textSecondary">
                        {getLanguage().notShowBanned}
                    </Typography>
                </Box>
            </Box>
            <TableContainer className={classes.table}>
                <Table>
                    <TableHead className="head">
                        <TableRow>
                            <TableCell align="left">{getLanguage().pageName}</TableCell>
                            <TableCell align="left">{getLanguage().dateCreated}</TableCell>
                            <TableCell align="left">{getLanguage().views}</TableCell>
                            <TableCell align="left">{getLanguage().reports}</TableCell>
                            <TableCell align="left">{getLanguage().options}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pages.map((page) => (
                            <TableRow key={page.uid}>
                                <TableCell component="th" scope="row" style={{ maxWidth: 150 }} >
                                    <Typography className="multi-line-turncate" style={{ maxWidth: '100%' }}>
                                        {page.title}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">{moment(page.createdIso).format('MMM DD, YYYY')}</TableCell>
                                <TableCell align="left">{page.totalVisits}</TableCell>
                                <TableCell align="left">{page.numberOfReports}</TableCell>
                                <TableCell align="left">
                                    {page.isBanned ? '' : <MoreHorizIcon className={classes.moreAction} onClick={handleMore(page)} />}
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
                    <Box display="flex" alignItems="center" className={classes.actions} mt={0.25} onClick={handleBlock}>
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

    let pageMap = {};

    const { pages, totalCount } = await adminFetchNewPagesSF({ pageNum: parseInt(page), showCount: parseInt(show) })

    pages.forEach(p => {
        pageMap = { ...pageMap, [p.uid]: p }
    })


    return {
        props: {
            pageMap,
            totalPagesCount: totalCount,
            page: parseInt(page),
            show: parseInt(show),
            notShowBlocked: true
        },
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
    },
    checkbox: {
        paddingLeft: 0
    }
}))

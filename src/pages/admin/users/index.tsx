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
    Avatar
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import BlockIcon from '@material-ui/icons/Block';
import { useWindowSize } from '../../../utils/client/use-window-size';
import { getLanguage } from '../../../langauge/language';
import moment from 'moment';
import CustomPagination from '../../../components/custom-pagination';
import CustomPopper from '../../../components/custom-popper';
import { User } from '../../../models/user';
import { sortByProperty } from '../../../utils/helpers';
import CustomHeader from '../../../components/custom-header';
import { adminFetchUsersSF, server } from '../../../utils/server/graphql_server';

export default function Users(props: {
    usersMap: { [userId: string]: User },
    totalUsersCount: number;
    page: number,
    show: number
}) {
    const size = useWindowSize();
    const classes = useStyles();
    const { page, show, totalUsersCount, usersMap } = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMore = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(() => null)
    }

    const handleChangePage = (event, pageNumber) => {
        window.location.href = `/admin/users?page=${pageNumber}&show=${show}`
    }

    const handleChangeNumOfRows = (e) => {
        window.location.href = `/admin/users?page=${page}&show=${e.target.value}`
    }

    const users = sortByProperty(usersMap, 'createdIso', 'desc');
    const countOfPages = Math.ceil(totalUsersCount / show);

    return (
        <Box padding={size.width > 599 ? "36px 40px" : "24px 24px"}>
            <CustomHeader title="Awake - Admin - Users" />
            <Box mb={4} display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                    <Typography variant="h3" color="textPrimary"><b>{getLanguage().appUsers}</b></Typography>
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
                            <TableCell align="left">{getLanguage().username}</TableCell>
                            <TableCell align="left">{getLanguage().phoneNumber}</TableCell>
                            <TableCell align="left">{getLanguage().signedUp}</TableCell>
                            <TableCell align="left">{getLanguage().Status}</TableCell>
                            <TableCell align="left">{getLanguage().options}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => {
                            const { uid, phoneNumber, username, profileMedia, createdIso, isDeleted, isBanned, isFlagged } = user;
                            let userStatus = 'Active';
                            let userStatusColor = '#3DD598';
                            if (!isDeleted && !isBanned && !isFlagged) {
                                userStatus = 'Active';
                                userStatusColor = '#3DD598';
                            }
                            if (isFlagged) {
                                userStatus = 'Flagged';
                                userStatusColor = '#FC5A5A';
                            }
                            if (isBanned) {
                                userStatus = 'Banned';
                                userStatusColor = '#BCBCCA';
                            }
                            if (isDeleted) {
                                userStatus = 'Deleted';
                                userStatusColor = '#59595a';
                            }
                            return (
                                <TableRow key={uid}>
                                    <TableCell component="th" scope="row">
                                        <Box display="flex" alignItems="center">
                                            <Avatar alt="User" className={classes.avatar} src={profileMedia.url} />
                                            {username}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="left">{phoneNumber}</TableCell>
                                    <TableCell align="left">{moment(createdIso).format('MMM DD, YYYY')}</TableCell>
                                    <TableCell align="left">
                                        <Box display="flex" alignItems="center">
                                            <Box style={{ background: userStatusColor }} width={10} height={10} borderRadius={5} mr={1} />
                                            <Typography variant="h5" style={{ color: userStatusColor }}>{userStatus}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="left">
                                        <MoreHorizIcon className={classes.moreAction} onClick={handleMore} />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <CustomPagination count={countOfPages} onChange={handleChangePage} page={page} />
            {/* option popper */}
            <CustomPopper anchorEl={anchorEl} onClose={handleClose} >
                <Box display="flex" flexDirection="column">
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
        let usersMap = {};

        const { users, totalCount } = await adminFetchUsersSF({ pageNum: parseInt(page), showCount: parseInt(show) })

        users.forEach(user => {
            usersMap = { ...usersMap, [user.uid]: user }
        })

        return {
            props: {
                usersMap,
                totalUsersCount: totalCount,
                page: parseInt(page),
                show: parseInt(show)
            },
        }
    } catch (error) {
        const statusCode = error.response.data.statusCode
        if (statusCode === 'not-admin') {
            res.writeHead(307, { Location: "/404" });
            return res.end();
        }
        console.log(error);
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
    avatar: {
        height: 32,
        width: 32,
        marginRight: theme.spacing(1)
    },
}))

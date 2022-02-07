import React, { useState } from 'react';
import { Box, Grid, Typography, Select, MenuItem, makeStyles } from '@material-ui/core';
import { getLanguage } from '../../../langauge/language';
import { useWindowSize } from '../../../utils/client/use-window-size';
import { User } from '../../../models/user';
import loadable from '@loadable/component';
import CustomHeader from '../../../components/custom-header';
import { adminFetchDataPointsCountSF, adminFetchNewSitesCountSF, adminFetchNewUsersCountSF, adminFetchNewUsersSF, adminFetchUsersCountSF, server } from '../../../utils/server/graphql_server';
import { adminFetchNewSitesCount, adminFetchNewUsers, adminFetchNewUsersCount } from '../../../utils/client/admin_actions';

const Customers = loadable(() => import('./customers'));
const DataBlock = loadable(() => import('./data-block'));

export default function Overview(props: {
    usersCount: number,
    newUsersCount: { rate: number, count: number },
    dataPointsCount: number,
    newSitesCount: { rate: number, count: number },
    newUsersMap: { [userId: string]: User }
}) {
    const size = useWindowSize();
    const classes = useStyles();
    const [customerMap, setCustomerMap] = useState<{ [userId: string]: User }>(props?.newUsersMap);
    const [newUsersCount, setNewUsersCount] = useState<{ rate: number, count: number }>(props?.newUsersCount);
    const [newSitesCount, setNewSitesCount] = useState<{ rate: number, count: number }>(props?.newSitesCount);
    const [range, setRange] = useState<number>(7);

    const rangeOptions = { 7: 'This Week', 30: 'This Month', 365: 'This Year' }

    const handleShowMore = async () => {
        const uids = Object.keys(customerMap);
        const last = customerMap[uids[uids.length - 1]];
        if (last?.createdIso) {
            const additionalUsers: User[] = await adminFetchNewUsers(last.createdIso);
            let updateUserMap = customerMap;
            additionalUsers.forEach((user) => {
                updateUserMap = { ...updateUserMap, [user.uid]: user }
            })
            setCustomerMap(() => updateUserMap);
        }
    }

    const handleChangeRange = async (e) => {
        setRange(() => e.target.value);
        const usersCount = await adminFetchNewUsersCount(e.target.value);
        const sitesCount = await adminFetchNewSitesCount(e.target.value);
        setNewUsersCount(() => (usersCount));
        setNewSitesCount(() => (sitesCount));
    }

    return (
        <Box padding={size.width > 599 ? "36px 40px" : "36px 24px"}>
            <CustomHeader title="Awake - Admin - Overview" />
            <Box mb={4} display="flex" alignItems="center">
                <Typography variant="h3" color="textPrimary"><b>{getLanguage().overview}</b></Typography>
                <Select
                    renderValue={(value: string) => (
                        <Box display="flex" alignItems="center" width="100%">
                            <Typography variant="h5" color="textSecondary">
                                {getLanguage().show}:&nbsp;<b>{rangeOptions[value]}</b>
                            </Typography>
                        </Box>
                    )}
                    name="range"
                    value={range}
                    onChange={handleChangeRange}
                    className={classes.select}
                    displayEmpty
                >
                    <MenuItem value={7}>{getLanguage().thisWeek}</MenuItem>
                    <MenuItem value={30}>{getLanguage().thisMonth}</MenuItem>
                    <MenuItem value={365}>{getLanguage().thisYear}</MenuItem>
                </Select>
            </Box>
            {/* information blocks */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <DataBlock title={getLanguage().users} value={props?.usersCount} description={getLanguage().totalAppUsers} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <DataBlock title={getLanguage().newUsers} value={newUsersCount.count} rate={newUsersCount.rate} description={getLanguage()[`newUsers${rangeOptions[range].replaceAll(" ", "")}`]} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <DataBlock title={getLanguage().dataCollected} value={props?.dataPointsCount} description={getLanguage().dataCollectedByAllUsers} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <DataBlock title={getLanguage().newSites} value={newSitesCount.count} rate={newSitesCount.rate} description={getLanguage()[`sitesCreated${rangeOptions[range].replaceAll(" ", "")}`]} />
                </Grid>
            </Grid>
            {/* New customers */}
            <Customers dataMap={customerMap} onShowMore={handleShowMore} />
        </Box>
    );
}



export async function getServerSideProps(context) {
    const { req, res, } = context
    await server({ req, res });
    let usersCount, newUsersCount, dataPointsCount, newSitesCount, newUsersMap;
    const daysNAgo = 7;

    try {
        const rest = await Promise.all([
            adminFetchUsersCountSF(),
            adminFetchNewUsersCountSF({ daysNAgo }),
            adminFetchDataPointsCountSF(),
            adminFetchNewSitesCountSF({ daysNAgo }),
            adminFetchNewUsersSF({ fromIso: new Date().toISOString() }),
        ]);
        usersCount = rest[0].count as number;
        newUsersCount = rest[1]
        dataPointsCount = rest[2].count as number;
        newSitesCount = rest[3]
        const newUsers = rest[4]

        newUsers.forEach(user => {
            newUsersMap = { ...newUsersMap, [user.uid]: user }
        })
    } catch (error) {
        // TODO: error handler
        // const statusCode = error.response.data.statusCode
        // if (statusCode === 'not-admin') {
        //     res.writeHead(307, { Location: "/404" });
        //     return res.end();
        // }
        // console.log(error);
    }

    return {
        props: {
            usersCount,
            newUsersCount,
            dataPointsCount,
            newSitesCount,
            newUsersMap
        },
    }
}

const useStyles = makeStyles((theme) => ({
    select: {
        width: 200,
        backgroundColor: 'transparent !important',
        marginLeft: theme.spacing(1.5),
        border: 'none',
        height: '45px !important',
    },
}))

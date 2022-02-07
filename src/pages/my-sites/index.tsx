import React, { useState } from 'react';
import { Box, Card, makeStyles, Typography, Hidden, } from '@material-ui/core';
import InfiniteScroll from "react-infinite-scroll-component";
import { getLanguage } from '../../langauge/language';
import { useWindowSize } from '../../utils/client/use-window-size'
import { Site } from '../../models/site';
import NewSiteDialog from './new-site';
import SvgPlus from '../../../public/plus.svg';
import loadable from '@loadable/component';
import CustomHeader from '../../components/custom-header';
import Loading from '../../components/loading';
import { fetchMySitesSF, server } from '../../utils/server/graphql_server';
import { fetchMySites } from '../../utils/client/site-action';

const ListHeader = loadable(() => import('./site-list-header'));
const SiteList = loadable(() => import('./site-list'));

export default function MySites(props: {
    sites: { [siteUid: string]: Site },
}) {
    const classes = useStyles();
    const size = useWindowSize();
    const [openNewSite, setOpenNewSite] = useState<boolean>(false);
    const [mySites, setMySites] = useState<{ [siteUid: string]: Site }>(props?.sites);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isFetching, setFetching] = useState<boolean>(false);

    const handleOpenNewSite = () => {
        setOpenNewSite(true);
    }

    const handleCloseNewSite = async (newSite: Site) => {
        if (newSite) {
            setMySites((prev) => ({ [newSite.uid]: newSite, ...prev }));
        }
        setOpenNewSite(false);
    }

    const handleSiteRemoved = (removedUid) => {
        delete mySites[removedUid];
        setMySites(() => ({ ...mySites }));
    }

    const handleSiteUpdated = (updatedUid, res) => {
        setMySites(() => ({ ...mySites, [updatedUid]: res }));
    }

    const handleFetchSites = async () => {
        const uids = Object.keys(mySites);
        const last = mySites[uids[uids.length - 1]];
        setFetching(true);
        const additionalSites = await fetchMySites(last.lastSiteUpdatedIso);
        if (additionalSites.length === 1) {
            setHasMore(false);
        }
        let updatedSites = mySites;
        additionalSites.forEach((site) => {
            updatedSites = { ...updatedSites, [site.uid]: site }
        })
        setMySites(updatedSites);
        setFetching(false);
    }

    return (
        <>
            <CustomHeader title="Awake - My Sites" />
            <InfiniteScroll
                scrollableTarget='scroller-main'
                dataLength={Object.keys(mySites).length}
                next={handleFetchSites}
                hasMore={hasMore || false}
                loader={
                    isFetching &&
                    <Box display="flex" justifyContent="center" key="loading">
                        <Loading />
                    </Box>
                }
                className={classes.root}
            >
                <Card>
                    <Box display="flex" alignItems="center" justifyContent="space-between" className={classes.header}>
                        <Box display="flex" alignItems="center" pl={size.width > 800 ? 4 : 3}>
                            <Hidden mdUp>
                                <Typography variant="h4" color="textPrimary">{getLanguage().mySites}</Typography>
                            </Hidden>
                            <Hidden smDown>
                                <Typography variant="h4" color="textPrimary">{getLanguage().sites}</Typography>
                                <Typography variant="h6" color="textSecondary" style={{ marginLeft: 8 }}>
                                    ({Object.keys(mySites).length} {getLanguage().sitesInTotal})
                                </Typography>
                            </Hidden>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="center" pr={size.width > 800 ? 4 : 3}>
                            <Typography variant="h6" color="textPrimary">{getLanguage().addNewSite}</Typography>
                            <Box
                                className={classes.addSite}
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                width={36}
                                height={36}
                                onClick={handleOpenNewSite}
                            >
                                <SvgPlus width={12} height={12} fill="white" />
                            </Box>
                        </Box>
                    </Box>

                    {/* list header */}
                    <ListHeader />

                    {/* site list */}
                    <SiteList sites={mySites} onRemoved={handleSiteRemoved} onUpdated={handleSiteUpdated} />

                    {/* new site form */}
                    <NewSiteDialog open={openNewSite} close={handleCloseNewSite} />
                </Card>
                <Box height={30} />
            </InfiniteScroll>
        </>
    );
}

export const getServerSideProps = async (context) => {
    const { req, res } = context;
    await server({ req, res })

    const sites = await fetchMySitesSF({ fromIso: new Date().toISOString() })
    let siteMap = {};
    sites.forEach((site) => {
        siteMap = { ...siteMap, [site.uid]: site }
    });
    return {
        props: {
            sites: siteMap
        },
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1170,
        width: 'calc(100vw - 36px)',
        marginTop: theme.spacing(6),
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(5),
        },
    },
    header: {
        height: 96,
        [theme.breakpoints.down('sm')]: {
            height: 65,
        },
    },
    addSite: {
        background: theme.palette.primary.main,
        borderRadius: '50%',
        marginLeft: theme.spacing(1),
        cursor: 'pointer'
    },
}));

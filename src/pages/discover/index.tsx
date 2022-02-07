import React, { useState, useEffect } from 'react';
import { Box, Typography, } from '@material-ui/core';
import { makeStyles, } from '@material-ui/core/styles';
import InfiniteScroll from "react-infinite-scroll-component";
import CustomDivider from '../../components/custom-divider';
import { getLanguage } from '../../langauge/language';
import { useWindowSize } from '../../utils/client/use-window-size';
import { Page } from '../../models/page';
import { discoverFetchHomePages, discoverFetchNewPages, discoverFetchPopularPages, discoverFetchTrendingPages } from '../../utils/client/page-action';
import { sortByProperty } from '../../utils/helpers';
import { Site } from '../../models/site';
import loadable from '@loadable/component';
import CustomHeader from '../../components/custom-header';
import { dispatchUser } from '../../utils/client/user-state';
import { Player } from '@lottiefiles/react-lottie-player';
import noItem from '../../../public/lottie/not-view.json';
import Loading from '../../components/loading';
import {
    discoverFetchHomePagesSF,
    discoverFetchNewPagesSF,
    fetchSiteSF,
    discoverFetchPopularPagesSF,
    server,
    discoverFetchTrendingPagesSF,
    fetchSubscribedSitesSF,
    fetchDataPointsCountSF,
} from '../../utils/server/graphql_server';
import { fetchSite } from '../../utils/client/site-action';

const MenuBar = loadable(() => import('./menu-bar'));
const Content = loadable(() => import('./content'));
const Subscriptions = loadable(() => import('./subscriptions'));

interface ExtendedPage extends Page {
    siteUrl: string
}

export default function Discover(props: {
    siteMap: { [siteUid: string]: Site },
    siteUrlMap: { [siteUid: string]: string }
    pageMap: { [pageUid: string]: ExtendedPage },
    type?: 'home' | 'popular' | 'trending' | 'new',
    category?: string,
    numOfDataPoints: number,
}) {
    const classes = useStyles();
    const size = useWindowSize();
    const [siteURLMap, setSiteURLMap] = useState<{ [siteUid: string]: string }>(props?.siteUrlMap);
    const [pageMap, setPageMap] = useState<{ [pageUid: string]: ExtendedPage }>(props?.pageMap);
    const [itemNumber, setItemNumber] = useState<number>(16);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isFetching, setFetching] = useState<boolean>(false);

    const category = props?.category === '' ? undefined : props?.category;
    const type = props?.type;

    useEffect(() => {
        dispatchUser({ type: 'setSubscriptions', data: props?.siteMap })
    }, [])

    const handleFetchPages = async () => {
        const uids = Object.keys(pageMap);
        const last = pageMap[uids[uids.length - 1]];
        let additionalPages: Page[] = [];
        setFetching(() => true);

        // we will not fetch pages with no-visits, since those pages can not be trending
        if (type === 'home') {
            const res = await discoverFetchHomePages(itemNumber, category);
            setItemNumber(() => res.itemNumber)
            additionalPages = res.pages
        }
        if (type === 'popular') {
            const res = await discoverFetchPopularPages(itemNumber, category);
            setItemNumber(() => res.itemNumber)
            additionalPages = res.pages
        }
        if (type === 'trending') {
            const res = await discoverFetchTrendingPages(itemNumber, category);
            setItemNumber(() => res.itemNumber)
            additionalPages = res.pages
        }
        if (type === 'new' && last?.createdIso) {
            additionalPages = await discoverFetchNewPages(category, last.createdIso);
        }

        if (additionalPages.length < 16) {
            setHasMore(() => false);
        }
        // need to add the siteURL for the each page schema.
        let updatedSiteURLMap = siteURLMap;
        // fetch sites using page.siteUid from each page
        const rest = (await Promise.all(additionalPages.map(page => fetchSite(page.siteUid))))
        rest.forEach(site => {
            updatedSiteURLMap = { ...updatedSiteURLMap, [site.uid]: site.url }
        })
        setSiteURLMap(() => updatedSiteURLMap)
        let updatedPageMap = pageMap;
        additionalPages.forEach((page) => {
            updatedPageMap = { ...updatedPageMap, [page.uid]: { ...page, siteUrl: updatedSiteURLMap[page.siteUid] } }
        })
        setPageMap(() => updatedPageMap);
        setFetching(() => false);
    }

    const pages = sortByProperty(pageMap, (['home', 'popular', 'trending'].includes(type)) ? 'totalVisits' : 'createdIso', 'desc');

    const AboutPlatform = () => {
        return (
            <Box className={classes.platformInfo} mb={2} >
                <Box p={size.width > 599 ? 3 : 2} display="flex" justifyContent="space-between">
                    <Typography variant="h5" color="textPrimary" component="p">
                        {getLanguage().awakenedPlatform}
                    </Typography>
                </Box>
                <CustomDivider />
                <Box p={size.width > 599 ? 3 : 2}>
                    <Typography variant="h6" color="textSecondary" component="span">
                        Awake is a platform that allows you to regain control and learn the value of your data across the internet.
                        Our partners report data to the platform when you decide to 'Continue with Awake', giving you data transparency.
                    </Typography>
                </Box>
            </Box >
        )
    }

    return (
        <>
            <CustomHeader title="Awake - Discover" />
            <MenuBar type={type} category={category} numOfDataPoints={props?.numOfDataPoints} />
            <InfiniteScroll
                scrollableTarget='scroller-main'
                dataLength={pages.length}
                next={handleFetchPages}
                hasMore={hasMore || false}
                loader={
                    isFetching &&
                    <Box key="loading" display="flex" justifyContent="center" pb={3}>
                        <Loading />
                    </Box>
                }
                className={classes.root}
            >
                <Box
                    display="grid"
                    gridTemplateColumns={size.width > 599 ? "2fr 1fr" : "1fr"}
                    gridGap={16}
                >
                    {size.width <= 599 && <AboutPlatform />}
                    {
                        pages.length ?
                            <Box>
                                {pages.map(page =>
                                    <Content page={page} mainCategory={category} key={page.uid} />
                                )}
                            </Box>
                            :
                            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                                <Player
                                    autoplay
                                    loop
                                    src={JSON.stringify(noItem)}
                                    style={{ width: 150, }}
                                />
                                <Typography variant="h6" color="textSecondary" style={{ textAlign: 'center', fontSize: 14 }}>
                                    No posts here
                                </Typography>
                            </Box>
                    }
                    {
                        size.width > 599 &&
                        <Box position="relative">
                            <Box position="sticky">
                                <AboutPlatform />
                                {/* subscriptions */}
                                <Box className={classes.subscriptionsBox}>
                                    <Subscriptions />
                                </Box>
                            </Box>
                        </Box>
                    }
                </Box>
            </InfiniteScroll>
        </>
    );
}

export const getServerSideProps = async (context) => {
    const { req, res, query } = context;
    const { type, category } = query;

    const { isLoggedIn } = await server({ req, res })

    let sites: Site[] = [];
    let siteMap = {};
    let pageMap = {};
    let pages: Page[] = [];
    let numOfDataPoints: number = 0;

    if (!type || type === 'home') {
        pages = (await discoverFetchHomePagesSF({ itemNumber: 0, category })).pages
    }
    if (type === 'popular') {
        pages = (await discoverFetchPopularPagesSF({ itemNumber: 0, category })).pages
    }
    if (type === 'trending') {
        pages = (await discoverFetchTrendingPagesSF({ itemNumber: 0, category })).pages
    }
    if (type === 'new') {
        pages = (await discoverFetchNewPagesSF({ category })).pages
    }

    if (isLoggedIn) {
        const rest = await Promise.all([
            fetchSubscribedSitesSF(),
            fetchDataPointsCountSF(),
        ])
        sites = rest[0]
        numOfDataPoints = rest[1]
    }

    sites.forEach(site => {
        siteMap = { ...siteMap, [site.uid]: site }
    })

    let siteUrlMap = {}

    const allSitesRes = await Promise.all(
        pages.map((page) => fetchSiteSF(page.siteUid))
    )

    allSitesRes.forEach(site => {
        siteUrlMap = { ...siteUrlMap, [site.uid]: site.url }
    })

    pages.forEach(page => {
        pageMap = { ...pageMap, [page.uid]: { ...page, siteUrl: siteUrlMap[page.siteUid] } }
    })
    return {
        props: {
            siteMap,
            siteUrlMap,
            pageMap,
            numOfDataPoints,
            type: type ?? 'home', // default value
            category: category ?? ''  // default value
        },
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1170,
        width: '100%',
        marginTop: theme.spacing(12),
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(30),
        },
    },
    platformInfo: {
        background: theme.palette.secondary.main,
        filter: 'drop-shadow(1px 1px 3px lightgray)',
        borderRadius: 15,
        '& p': {
            lineHeight: '21px',
            fontWeight: 500,
            letterSpacing: '0.1px'
        },
        '& span': {
            lineHeight: '22px',
        }
    },
    subscriptionsBox: {
        background: theme.palette.secondary.main,
        filter: 'drop-shadow(1px 1px 3px lightgray)',
        borderRadius: 15,
    },
}));

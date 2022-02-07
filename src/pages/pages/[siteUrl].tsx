import React, { useState, useEffect } from 'react';
import { Box, Typography, } from '@material-ui/core';
import { getLanguage } from '../../langauge/language';
import { useWindowSize } from '../../utils/client/use-window-size';
import { Page } from '../../models/page';
import { Site } from '../../models/site';
import {
    fetchMoreNewPages,
    fetchMorePopularPages,
    fetchMoreTrendingPages,
    recordPageImpression,
    subscribeToSite,
    unsubscribeToSite
} from '../../utils/client/page-action';
import { useContext } from 'react';
import { UserContext } from '../../utils/client/user-state';
import RelationPages from './relation-pages';
import { PageStoreProvider } from '../../utils/client/page-state';
import CustomHeader from '../../components/custom-header';
import { server, fetchSiteViaUrlPublicSF, fetchMoreNewPagesSF, fetchMorePopularPagesSF, fetchMoreTrendingPagesSF, checkSiteSubscribedSF } from '../../utils/server/graphql_server';
import { checkSiteSubscribed } from '../../utils/client/user-actions';
import Menubar from './menubar';

export default function RootSite(props: {
    site: Site,
    pages: {
        newPagesMap: { [pageUid: string]: Page },
        popularPagesMap: { [pageUid: string]: Page },
        trendingPagesMap: { [pageUid: string]: Page }
    },
    isSubscribed: boolean
}) {
    const { site, pages } = props;
    const userCtx = useContext(UserContext)
    const user = userCtx.userState.user;
    const [isSubscribed, setSubscribed] = useState<boolean>(props?.isSubscribed);
    const [trendingPages, setTrendingPages] = useState<{ [pageUid: string]: Page }>(pages?.trendingPagesMap)
    const [popularPages, setPopularPages] = useState<{ [pageUid: string]: Page }>(pages?.popularPagesMap)
    const [newPages, setNewPages] = useState<{ [pageUid: string]: Page }>(pages?.newPagesMap)

    useEffect(() => {
        // some time dealy is needed for content to be loaded
        setTimeout(() => { resizeToFit() }, 50)
    }, [])

    // resize the fontsize so that it can be fit
    function resizeToFit() {
        const border = document.querySelector('.site-name-border');
        const output = document.querySelector('.site-name');
        let fontSize = window.getComputedStyle(output).fontSize;
        // @ts-ignore
        output.style.fontSize = (parseFloat(fontSize) - 1) + 'px';
        if (output.clientHeight >= border.clientHeight) {
            resizeToFit();
        }
    }

    const handleSubscribe = async () => {
        if (user) {
            if (isSubscribed === true) {
                await unsubscribeToSite(site.uid)
            }
            if (isSubscribed === false) {
                await subscribeToSite(site.uid);
            }
            const updateRes = await checkSiteSubscribed(site.uid);
            return setSubscribed(updateRes);
        }
        // return users to login page
        return window.open('/auth', '_blank').focus();
    }

    const handleLoadMore = (pageType: 'trending' | 'popular' | 'new') => async () => {
        let morePages = [] as Page[];
        if (pageType === 'trending') {
            const pageUids = Object.keys(trendingPages);
            const last = trendingPages[pageUids[pageUids.length - 1]];
            if (last?.totalVisits) {
                morePages = await fetchMoreTrendingPages(site.uid, last.totalVisits);
            }
            morePages.forEach(page => {
                setTrendingPages((prev) => ({ ...prev, [page.uid]: page }))
            })
        }
        if (pageType === 'popular') {
            const pageUids = Object.keys(popularPages);
            const last = popularPages[pageUids[pageUids.length - 1]];
            if (last?.totalVisits) {
                morePages = await fetchMorePopularPages(site.uid, last.totalVisits);
            }
            morePages.forEach(page => {
                setPopularPages((prev) => ({ ...prev, [page.uid]: page }))
            })
        }
        if (pageType === 'new') {
            const pageUids = Object.keys(newPages);
            const last = newPages[pageUids[pageUids.length - 1]];
            if (last?.createdIso) {
                morePages = await fetchMoreNewPages(site.uid, last.createdIso);
            }
            morePages.forEach(page => {
                setNewPages((prev) => ({ ...prev, [page.uid]: page }))
            })
        }

        // record the page impression for new loaded pages
        if (morePages.length) {
            morePages.forEach(page =>
                recordPageImpression(page.uid)
            )
        }
    }

    return (
        <PageStoreProvider site={site}>
            <CustomHeader title={`${site.name}`} />
            <Box className="scrollable" height="100%">
                <Menubar />
                <Box display="flex" alignItems="center" justifyContent="center" mt={5}>
                    <img src={site?.siteIcon?.url} width={38} height={38} />
                    <Box display="flex" alignItems="center" height={55} className="site-name-border">
                        <Typography
                            style={{
                                fontWeight: 600,
                                wordBreak: 'break-word',
                                wordWrap: 'break-word',
                                fontSize: 24,
                                marginLeft: 12
                            }}
                            className="site-name"
                        >
                            {site?.name}
                        </Typography>
                    </Box>
                </Box>
                {/* Treding Pages */}
                <RelationPages pages={trendingPages} name={getLanguage().trendingPages} loadMore={handleLoadMore('trending')} />
                {/* Popular Pages */}
                <RelationPages pages={popularPages} name={getLanguage().popularPages} loadMore={handleLoadMore('popular')} />
                {/* New Pages */}
                <RelationPages pages={newPages} name={getLanguage().newPages} loadMore={handleLoadMore('new')} />
            </Box>
        </PageStoreProvider>
    );
}

export async function getServerSideProps(context) {
    const { req, res, query } = context;
    const { isLoggedIn } = await server({ req, res });
    let site, isSubscribed;
    let newPagesMap = {};
    let popularPagesMap = {};
    let trendingPagesMap = {};
    const siteUrl = query.siteUrl;

    site = (await fetchSiteViaUrlPublicSF({ siteUrl })).site

    const [trendingPageFromSite, popularPagesFromSite, newPagesFromSite] = await Promise.all([
        fetchMoreTrendingPagesSF({ siteUid: site.uid }),
        fetchMorePopularPagesSF({ siteUid: site.uid }),
        fetchMoreNewPagesSF({ siteUid: site.uid })
    ]);

    newPagesFromSite.forEach(p => {
        newPagesMap = { ...newPagesMap, [p.uid]: p }
    });
    popularPagesFromSite.forEach(p => {
        popularPagesMap = { ...popularPagesMap, [p.uid]: p }
    });
    trendingPageFromSite.forEach(p => {
        trendingPagesMap = { ...trendingPagesMap, [p.uid]: p }
    });

    if (isLoggedIn) {
        isSubscribed = await checkSiteSubscribedSF({ siteUid: site.uid })
    }

    return {
        props: {
            site,
            pages: {
                newPagesMap,
                popularPagesMap,
                trendingPagesMap
            },
            isSubscribed
        },
    }
}

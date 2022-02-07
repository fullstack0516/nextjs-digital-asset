import React, { useState, useEffect, useMemo } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { PageStoreProvider } from '../../utils/client/page-state';
import { Page } from '../../models/page';
import { Site } from '../../models/site';
import { getLanguage } from '../../langauge/language';
import { fetchMoreNewPages, fetchMorePopularPages, fetchMoreTrendingPages, recordPageImpression } from '../../utils/client/page-action';
import RelationPages from './relation-pages';
import Contents from './contents';
import DataTags from './data-tags';
import CookieInfo from './cookie-info';
import CustomHeader from '../../components/custom-header';
import { UserLight } from '../../models/user-light';
import Logo from '../../components/logo';
import {
    fetchCommentsSF,
    fetchPageLikeSF,
    fetchPageViaUrlPublicSF,
    fetchPageViaUrlSF,
    fetchSiteViaUrlPublicSF,
    fetchSiteViaUrlSF,
    fetchUserLightSF,
    fetchUserSF,
    recordPageTagsSF,
    recordPageVisitSF,
    fetchCountOfCommentsSF,
    server
} from '../../utils/server/graphql_server';
import { PageLike } from '../../models/page-like';
import Navbar from './navbar';
import Menubar from './menubar';
import Header from './header';
import Comments from './comments';
import { Comment } from '../../models/comment';
import { getAllDescriptions, getAllImages } from '../../utils/helpers';

export default function PageView(props: {
    page: Page,
    site: Site,
    pages: {
        newPagesMap: { [pageUid: string]: Page },
        popularPagesMap: { [pageUid: string]: Page },
        trendingPagesMap: { [pageUid: string]: Page }
    },
    author: UserLight,
    pageLike: PageLike,
    comments: { [commentUid: string]: Comment },
    totalComments: number
}) {
    const classes = useStyles();
    const { site, page, author, pageLike, pages, comments, totalComments } = props

    const [trendingPages, setTrendingPages] = useState<{ [pageUid: string]: Page }>(pages?.trendingPagesMap)
    const [popularPages, setPopularPages] = useState<{ [pageUid: string]: Page }>(pages?.popularPagesMap)
    const [newPages, setNewPages] = useState<{ [pageUid: string]: Page }>(pages?.newPagesMap)
    const [darkMode, setDarkMode] = useState<boolean>(localStorage.getItem('page-color-mode') === 'dark')
    const [showTrendingLoadMore, setShowTrendingLoadMore] = useState(true);
    const [showPopularLoadMore, setShowPopularLoadMore] = useState(true);
    const [showNewLoadMore, setShowNewLoadMore] = useState(true);

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            (async () => {
                // record the impression for the relation pages
                const { trendingPagesMap, popularPagesMap, newPagesMap } = pages ?? {}
                await Promise.all([
                    ...Object.keys(trendingPagesMap).map(pageUid => recordPageImpression(pageUid)),
                    ...Object.keys(popularPagesMap).map(pageUid => recordPageImpression(pageUid)),
                    ...Object.keys(newPagesMap).map(pageUid => recordPageImpression(pageUid)),
                ])
            })()
        }
        return () => { mounted = false }
    }, [pages])

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

    useEffect(() => {
        // some time dealy is needed for content to be loaded
        setTimeout(() => { resizeToFit() }, 50)
    }, [])

    const handleDarkMode = (e) => {
        setDarkMode(() => e.target.checked);
        localStorage.setItem('page-color-mode', e.target.checked ? 'dark' : 'light');
    }

    const handleLoadMore = (pageType: 'trending' | 'popular' | 'new') => async () => {
        let morePages = [] as Page[];
        if (pageType === 'trending') {
            const pageUids = Object.keys(trendingPages);
            const last = trendingPages[pageUids[pageUids.length - 1]];
            if (last?.totalVisits) {
                morePages = await fetchMoreTrendingPages(site.uid, last.totalVisits);
                if (!morePages.length) {
                    setShowTrendingLoadMore(false);
                }
            } else {
                setShowTrendingLoadMore(false);
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
                if (!morePages.length) {
                    setShowPopularLoadMore(false);
                }
            } else {
                setShowPopularLoadMore(false);
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
                if (!morePages.length) {
                    setShowNewLoadMore(false);
                }
            } else {
                setShowNewLoadMore(false);
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

    const meta = useMemo(() => {
        const meta: { image?: string; description?: string; } = {};

        const images = getAllImages(page.contentSections);
        const descriptions = getAllDescriptions(page.contentSections);

        if (images.length)  meta.image = images[0];
        if (descriptions.length) meta.description = descriptions[0].substring(0, 200);

        return meta;
    }, [page.contentSections])

    return (
        <PageStoreProvider page={page} site={site}>
            <CustomHeader title={`Awake - ${site.name} - ${page.title}`} image={meta.image} description={meta.description} />
            <Box display="flex" alignItems="center" flexDirection="column" height="100%" className='scrollable'>
                <Box width='100%' className={classes.root} style={{ background: darkMode && '#181820' }}>
                    {/* Menu Bar for the admin */}
                    <Menubar darkMode={darkMode} />
                    <Navbar darkMode={darkMode} onSetDark={handleDarkMode} />
                    <Header author={author} darkMode={darkMode} />
                    <DataTags darkMode={darkMode} pageLiked={pageLike?.liked} totalComments={totalComments} />
                    {/* <PageTitle darkMode={darkMode} pageLiked={pageLike?.liked} /> */}
                    <Contents darkMode={darkMode} />
                    <Comments darkMode={darkMode} initialComments={comments} />
                    <RelationPages pages={trendingPages} name={getLanguage().trendingPages} darkMode={darkMode} loadMore={handleLoadMore('trending')} showLoadMore={showTrendingLoadMore} />
                    <RelationPages pages={popularPages} name={getLanguage().popularPages} darkMode={darkMode} loadMore={handleLoadMore('popular')} showLoadMore={showPopularLoadMore} />
                    <RelationPages pages={newPages} name={getLanguage().newPages} darkMode={darkMode} loadMore={handleLoadMore('new')} showLoadMore={showNewLoadMore} />
                    {/* Footer */}
                    <Box display="flex" justifyContent="center" alignItems="center" className={classes.footer}>
                        <Logo width={90} height={60} darkMode={darkMode} />
                    </Box>
                    <CookieInfo />
                </Box >
            </Box>
        </PageStoreProvider>
    );
}

export async function getServerSideProps(context) {
    const { req, res, query } = context;
    const { isLoggedIn } = await server({ req, res });
    let site,
        page: Page,
        pageRes,
        author: UserLight = null,
        pageLike: PageLike = null,
        comments: { [commentUid: string]: Comment } = {},
        totalComments: number = 0

    let newPagesMap = {}
    let popularPagesMap = {}
    let trendingPagesMap = {}
    const [siteUrl, pageUrl, restURL] = query.publicUrl ?? [];

    // if this page is preview and user did not login, return him to auth page
    if (restURL === 'preview' && !isLoggedIn) {
        res.writeHead(307, { Location: "/auth" });
        return res.end();
    }

    try {
        /**
         *  fetch the site && page information
         *  if restURL is preview, it is private url, otherwise, it is public url
         */
        if (restURL === 'preview') {
            const rest = await Promise.all([
                fetchSiteViaUrlSF({ siteUrl }),
                fetchPageViaUrlSF({ url: `${siteUrl}/${pageUrl}` }),
                fetchUserSF(),
            ])

            site = rest[0]
            pageRes = rest[1]
            const user = rest[2]
            page = pageRes.page as Page;
            // check if user is pageOwner or not
            if (user.uid !== page.pageOwner) {
                res.writeHead(307, { Location: "/404" });
                return res.end();
            }
        }
        if (!restURL) {
            pageRes = await fetchPageViaUrlPublicSF({ url: `${siteUrl}/${pageUrl}` })
            page = pageRes.page as Page;

            // if page was not published, redirect to 404
            if (!page.isPublished) {
                res.writeHead(307, { Location: "/404" });
                return res.end();
            }

            const rest = await Promise.all([
                fetchSiteViaUrlPublicSF({ siteUrl }),
                recordPageVisitSF({ pageUid: page.uid }),
                fetchCommentsSF({ pageUid: page.uid }),
                fetchCountOfCommentsSF({ pageUid: page.uid })
            ])

            site = rest[0].site as Site;
            if (rest[1] === 'success') {
                page.totalVisits++
            }
            rest[2].forEach(comment => {
                comments[comment.uid] = comment
            })
            totalComments = rest[3]
            // record page tags
            if (isLoggedIn) {
                const res = await Promise.all([
                    recordPageTagsSF({ pageUid: page.uid }),
                    fetchPageLikeSF({ pageUid: page.uid }),
                ])

                pageLike = res[1]
            }
        }

        author = await fetchUserLightSF({ userLightUid: page.pageOwner })

        const newPagesFromSite = pageRes.newPagesFromSite as Page[];
        newPagesFromSite.forEach(p => {
            newPagesMap = { ...newPagesMap, [p.uid]: p }
        });
        const popularPagesFromSite = pageRes.popularPagesFromSite as Page[];
        popularPagesFromSite.forEach(p => {
            popularPagesMap = { ...popularPagesMap, [p.uid]: p }
        });
        const trendingPageFromSite = pageRes.trendingPageFromSite as Page[];
        trendingPageFromSite.forEach(p => {
            trendingPagesMap = { ...trendingPagesMap, [p.uid]: p }
        });

    } catch (error) {
        // TODO: error handler
        // const statusCode = error.response.data.statusCode
        // if (statusCode === 'no-page' || statusCode === 'no-site') {
        //     res.writeHead(307, { Location: "/404" });
        //     return res.end();
        // }
        // console.log(error);
    }

    return {
        props: {
            site,
            page,
            pages: {
                newPagesMap,
                popularPagesMap,
                trendingPagesMap
            },
            author,
            pageLike,
            comments,
            totalComments
        },
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        '& img': {
            objectFit: 'cover',
            width: '100%',
            cursor: 'pointer',
            borderRadius: theme.spacing(0.5),
            [theme.breakpoints.down('xs')]: {
                borderRadius: 0,
            },
        }
    },
    footer: {
        maxWidth: 1170,
        margin: '0 auto',
        padding: '0 24px',
        marginTop: `${theme.spacing(5)}px !important`,
        borderTop: '1px solid #F2F2FE',
        height: 100,
        [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing(10),
            height: 75,
        },
    },

}));

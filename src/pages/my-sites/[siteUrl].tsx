import React, { useState } from 'react';
import { Box, Card, makeStyles, Typography, Hidden, } from '@material-ui/core';
import InfiniteScroll from "react-infinite-scroll-component";
import { getLanguage } from '../../langauge/language';
import { useWindowSize } from '../../utils/client/use-window-size'
import { Page } from '../../models/page';
import { Site } from '../../models/site';
import PageList from './page-list';
import ListHeader from './page-list-header';
import NewPageDialog from './new-page';
import SvgRightArrow from '../../../public/right-arrow.svg';
import SvgPlus from '../../../public/plus.svg';
import CustomHeader from '../../components/custom-header';
import Loading from '../../components/loading';
import { fetchSitePagesRecentUpdatesSF, fetchSiteViaUrlSF, server } from '../../utils/server/graphql_server';
import { fetchMyPages } from '../../utils/client/page-action';

export default function MyPages(props: {
    pages: { [pageUid: string]: Page },
    site: Site
}) {
    const classes = useStyles();
    const size = useWindowSize();
    const [openNewPage, setOpenNewPage] = useState<boolean>(false);
    const [myPages, setMyPages] = useState<{ [pageUid: string]: Page }>(props?.pages);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isFetching, setFetching] = useState<boolean>(false);

    const handleOpenNewPage = () => {
        setOpenNewPage(true)
    }

    const handleCloseNewPage = async (newPage: Page) => {
        if (newPage) {
            setMyPages((prev) => ({ [newPage.uid]: newPage, ...prev }));
        }
        setOpenNewPage(false);
    }

    const handleFetchPages = async () => {
        const uids = Object.keys(myPages);
        const last = myPages[uids[uids.length - 1]];
        setFetching(true);
        const additionalPages = await fetchMyPages(last.lastUpdateIso, props.site.uid);
        if (additionalPages.length === 1) {
            setHasMore(false);
        }
        let updatedPages = myPages;
        additionalPages.forEach((page) => {
            updatedPages = { ...updatedPages, [page.uid]: page }
        })
        setMyPages(updatedPages);
        setFetching(false)
    }

    const handlePageRemoved = (removedUid) => {
        delete myPages[removedUid];
        setMyPages(() => ({ ...myPages }));
    }

    return (
        <>
            <CustomHeader title={`Awake - ${props?.site.name} -  Pages`} />
            {/* top sub menu */}
            <Box
                height={63}
                className={classes.subMenu}
                position="fixed"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Box maxWidth={1170} width="100%" display="flex" padding="0px 18px" alignItems="center">
                    <Typography variant="h6" color="textSecondary" style={{ marginRight: 17 }} onClick={() => window.location.href = "/my-sites"}>
                        {getLanguage().mySites}
                    </Typography>
                    <SvgRightArrow width={7.5} height={12} />
                    <Typography variant="h6" color="primary" style={{ marginLeft: 14, maxWidth: 180 }} className="multi-line-turncate">
                        {props?.site?.name ?? ''}
                    </Typography>
                </Box>
            </Box>
            <InfiniteScroll
                scrollableTarget='scroller-main'
                dataLength={Object.keys(myPages).length}
                next={handleFetchPages}
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
                                <Typography variant="h4" color="textPrimary">{getLanguage().myPages}</Typography>
                            </Hidden>
                            <Hidden smDown>
                                <Typography variant="h4" color="textPrimary">{getLanguage().pages}</Typography>
                                <Typography variant="h6" color="textSecondary" style={{ marginLeft: 8 }}>
                                    ({Object.keys(myPages).length} {getLanguage().pagesInTotal})
                                </Typography>
                            </Hidden>
                        </Box>
                        <Box display="flex" alignItems="center" justifyContent="center" pr={size.width > 800 ? 4 : 3}>
                            <Typography variant="h6" color="textPrimary">{getLanguage().addNewPage}</Typography>
                            <Box
                                className={classes.addPage}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                width={36}
                                height={36}
                                onClick={handleOpenNewPage}
                            >
                                <SvgPlus width={12} height={12} fill="white" />
                            </Box>
                        </Box>
                    </Box>

                    {/* list header */}
                    <ListHeader />

                    {/* page list */}
                    <PageList pages={myPages} onRemoved={handlePageRemoved} site={props.site} />

                    {/* new page form */}
                    <NewPageDialog open={openNewPage} close={handleCloseNewPage} siteUid={props.site.uid} />
                </Card>
                <Box height={30} />
            </InfiniteScroll>
        </>
    );
}

export async function getServerSideProps(context) {
    const { req, res, query } = context
    await server({ req, res })
    let pages: Page[] = [];
    let site: Site;

    site = await fetchSiteViaUrlSF({ siteUrl: query.siteUrl })
    pages = await fetchSitePagesRecentUpdatesSF({ siteUid: site.uid, fromIso: new Date().toISOString() })

    let pageMap = {};
    pages.forEach((page) => {
        pageMap = { ...pageMap, [page.uid]: page }
    });
    return {
        props: {
            pages: pageMap,
            site: site
        },
    }
}

const useStyles = makeStyles((theme) => ({
    subMenu: {
        borderBottom: '2px solid #ECECF4',
        zIndex: 100,
        background: '#FAFAFB',
        width: 'calc(100% - 11px)',
        '& h6': {
            cursor: 'pointer'
        }
    },
    root: {
        maxWidth: 1170,
        width: 'calc(100vw - 36px)',
        marginTop: theme.spacing(12),
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(12),
        },
    },
    header: {
        height: 96,
        [theme.breakpoints.down('sm')]: {
            height: 65,
        },
    },
    addPage: {
        background: theme.palette.primary.main,
        borderRadius: '50%',
        marginLeft: theme.spacing(1),
        cursor: 'pointer'
    },
}));

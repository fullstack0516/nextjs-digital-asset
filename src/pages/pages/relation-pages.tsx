import React, { useState, useContext, } from 'react';
import { Box, makeStyles, Typography, Button, Grid, GridSize, Hidden } from '@material-ui/core';
import { Player } from '@lottiefiles/react-lottie-player';
import markdownToTxt from 'markdown-to-text';
import { useWindowSize } from '../../utils/client/use-window-size';
import { PageContext } from '../../utils/client/page-state';
import { getAllImages, sortByProperty } from '../../utils/helpers';
import ContentSection, { ContentHeader } from '../../models/content-section';
import { Page } from '../../models/page';
import { getLanguage } from '../../langauge/language';
import loadMore from '../../../public/lottie/loading-more.json';
import Tag from '../../components/tag';
import { greyImage } from '../../variables';
import ItemsCarousel from "react-items-carousel";

export default function RelationPages({
    showLoadMore = true,
    ...props
}: {
    pages: { [pageUid: string]: Page };
    name: string;
    darkMode?: boolean;
    loadMore?: () => void;
    showLoadMore?: boolean;
}) {
    const classes = useStyles();
    const size = useWindowSize();
    const pageCtx = useContext(PageContext);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [hovered, setHovered] = useState<boolean>(false);
    const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

    const handleMore = async () => {
        setLoadingMore(true);
        props?.loadMore && await props.loadMore()
        setLoadingMore(false);
    }

    const handlePageView = (page) => () => {
        window.open(`/pages/${pageCtx.pageState.site.url}/${page.url}`, '_blank').focus();
    }

    const pages = sortByProperty(props?.pages, 'totalVisits', 'desc');
    const mainPage = pageCtx.pageState.page;
    const pageColor = mainPage?.pageColor ?? '#FF7534';
    const noOfCards = size.width > 991 ? 4 : (size.width > 698 ? 3 : (size.width > 420 ? 2 : 1));

    const handleChange = async (val) => {
        setActiveItemIndex(() => val)
        if (val + 1 === pages.length) {
            props?.loadMore && await props.loadMore()
        }
    }

    const items = pages.map(page => {
        const headerContent = page.contentSections.find(section => section?.type === 'header') as ContentSection<ContentHeader>;

        // find the first image can be used for main image of blog
        const contentImgURL = getAllImages(page?.contentSections)[0]

        let tags = {}
        // meta-tags first
        page.userMetaTags.forEach(metaTag => {
            tags = { ...tags, [metaTag.tagString]: metaTag.tagString }
        })
        // and the category
        page.contentCategories.forEach(category => {
            tags = { ...tags, [category]: category }
        })

        return (
            <Grid item xs={(12 / noOfCards) as GridSize} key={page.uid} style={{ marginBottom: 24 }} onClick={handlePageView(page)}>
                <Box display="flex" flexDirection="column" justifyContent="center" width="100%">
                    <Box paddingTop='56.25%' position="relative" mb={2} maxWidth={360}>
                        <img
                            src={contentImgURL ?? greyImage}
                            style={{ position: 'absolute', top: 0, left: 0, }}
                        />
                    </Box>
                    <Typography
                        variant="h4"
                        component="p"
                        className="multi-line-turncate"
                        style={{ color: props?.darkMode && '#FFFFFF', fontWeight: 600, cursor: 'pointer' }}
                    >
                        {markdownToTxt(headerContent?.content?.text?.markdown)}
                    </Typography>
                    <Typography
                        variant="h6"
                        component="a"
                        style={{ color: pageColor }}
                    >
                        {getLanguage().viewPage}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" ml={-0.5} mt={1}>
                        {
                            Object.keys(tags).slice(0, 6).map((category) =>
                                <Tag name={category} key={category} highlighted darkMode={props?.darkMode} />
                            )
                        }
                    </Box>
                </Box>
            </Grid>
        )
    })

    if (!Object.keys(pages).length) return <></>;

    return (
        <Box display="flex" className={classes.root}>
            <Box display="flex" flexDirection="column" width="100%" mt={size.width > 599 ? 8 : 4} >
                <Typography variant="h6" component="a" style={{ color: pageColor }}>
                    {getLanguage().posts}
                </Typography>
                <Typography variant="h3" style={{ color: props?.darkMode && '#FFFFFF', fontWeight: 600, marginBottom: size.width > 599 ? 40 : 24 }}>
                    {props?.name}
                </Typography>
                {/* in mobile, it is horizontal carousel */}
                <Hidden smUp>
                    <div className={classes.carousel}>
                        <ItemsCarousel
                            gutter={12}
                            numberOfCards={1}
                            activeItemIndex={activeItemIndex}
                            requestToChangeActive={handleChange}
                            chevronWidth={30}
                            outsideChevron
                            children={items}
                        />
                    </div>
                </Hidden>
                <Hidden xsDown>
                    <Grid container spacing={3}>
                        {items}
                    </Grid>
                    <Box display="flex" justifyContent="center" mt={size.width > 599 ? 2 : 0}>
                        {showLoadMore ?
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleMore}
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                                style={{
                                    background: (loadingMore || hovered) && pageColor,
                                    border: (loadingMore || hovered) ? 'none' : `2px solid ${props?.darkMode ? '#FFFFFF' : pageColor}`,
                                    color: (loadingMore || props?.darkMode || hovered) ? '#FFFFFF' : pageColor
                                }}
                                disabled={loadingMore}
                            >
                                {
                                    loadingMore &&
                                    <Player
                                        autoplay
                                        loop
                                        src={JSON.stringify(loadMore)}
                                        style={{ height: 30, width: 30, marginRight: 4 }}
                                    />
                                }
                                {loadingMore ? getLanguage().loading : getLanguage().loadMore}
                            </Button> :
                            <Box style={{ color: pageColor }}>
                                No more results!
                            </Box>
                        }
                    </Box>
                </Hidden>
            </Box>
        </Box >
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        color: '#0A083B',
        marginBottom: theme.spacing(1),
        [theme.breakpoints.down('xs')]: {
            padding: '0 0 0 24px',
        },
        '& a': {
            fontWeight: 'bold',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: 'pointer',
        },
        '& p': {
            margin: `${theme.spacing(1)}px 0 ${theme.spacing(2)}px`,
        },
        '& img': {
            boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.04)',
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            borderRadius: theme.spacing(0.5),
            [theme.breakpoints.down('xs')]: {
                borderRadius: 0,
            },
        },
        '& button': {
            background: 'transparent',
            borderRadius: 30,
            height: 49,
        },
    },
    carousel: {
        '& > div > div > div': {
            width: 'calc(100% - 40px)'
        }
    }
}));

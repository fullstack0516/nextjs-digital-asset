import React from 'react';
import { Box, makeStyles, Typography, Hidden } from '@material-ui/core';
import { Page } from '../../models/page';
import { getLanguage } from '../../langauge/language';
import { getAllImages, shortHandNumber } from '../../utils/helpers';
import loadable from '@loadable/component';

const Tag = loadable(() => import('../../components/tag'));

interface ExtendedPage extends Page {
    siteUrl: string
}

export default function Content(props: {
    page: ExtendedPage,
    mainCategory: string,
}) {
    const classes = useStyles();
    const page = props?.page;

    let contentCategories = props?.mainCategory ? { [props.mainCategory]: props.mainCategory } : {}
    page.contentCategories.forEach(category => {
        contentCategories = { ...contentCategories, [category]: category }
    })

    const handlePageView = async () => {
        window.open(`/pages/${page.siteUrl}/${page.url}`, '_blank').focus();
    }

    const Tags = () =>
        <Box display="flex" flexWrap="wrap" ml={-0.5} mt={1.5}>
            {
                Object.keys(contentCategories).slice(0, 6).map((category) =>
                    <Tag name={category} key={category} />
                )
            }
        </Box>

    // find the first image can be used for main image of blog
    const contentImgURL = getAllImages(page?.contentSections)[0]

    return (
        <Box className={classes.root} p={2} mb={3}>
            <Box
                display="grid"
                gridTemplateColumns={contentImgURL ? "max-content 1fr" : "1fr"}
                gridGap={20}
                onClick={handlePageView}
            >
                {contentImgURL && <img src={contentImgURL} />}
                <Box display="flex" flexDirection="column">
                    <Typography style={{ lineHeight: '20px', fontWeight: 500, letterSpacing: '0.1px', color: '#803f20', fontSize: 18 }} className="multi-line-turncate">
                        {page?.title}
                    </Typography>
                    <Typography variant="h5" color="textPrimary" style={{ lineHeight: '21px', marginTop: 5, fontWeight: 500 }}>{page?.description}</Typography>
                    <Typography variant="h6" color="textSecondary" style={{ lineHeight: '16px', letterSpacing: '0.1px', marginTop: 12, }}>
                        {`${page?.totalVisits} ${getLanguage().views} | ${shortHandNumber(page?.likes)} ${getLanguage().likes}`}
                    </Typography>
                    <Hidden xsDown>
                        <Tags />
                    </Hidden>
                </Box>
            </Box>
            <Hidden smUp>
                <Tags />
            </Hidden>
        </Box >
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.secondary.main,
        filter: 'drop-shadow(0.2px 0.2px 1px lightgray)',
        borderRadius: 20,
        cursor: 'pointer',
        '& img': {
            objectFit: 'cover',
            width: 150,
            height: 90,
            cursor: 'pointer',
            borderRadius: theme.spacing(1)
        }
    },
}));

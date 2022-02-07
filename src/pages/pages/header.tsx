import React, { useContext } from 'react';
import { Box, makeStyles, Typography, Avatar, Button } from '@material-ui/core';
import { PageContext } from '../../utils/client/page-state';
import { useWindowSize } from '../../utils/client/use-window-size';
import { UserLight } from '../../models/user-light';
import moment from 'moment'
import ContentSection, { ContentHeader, ContentTypes } from '../../models/content-section';
import CustomDivider from '../../components/custom-divider';
import { getLanguage } from '../../langauge/language';
import HelpIcon from '@material-ui/icons/Help';

export default function Header(props: {
    darkMode: boolean,
    author: UserLight
}) {
    const { author, darkMode } = props
    const classes = useStyles();
    const size = useWindowSize()
    const pageContext = useContext(PageContext)

    const page = pageContext.pageState.page

    // check last uri
    const urls = window.location.href.split('/');
    const last = urls[urls.length - 1];
    // parse the content sections according to the last uri
    const contentSections = (last === 'preview' ? page?.contentDraftSections : page?.contentSections) ?? [] as ContentSection<ContentTypes>[];
    const firstHeaderSection = contentSections.find(section => section?.type === 'header') as ContentSection<ContentHeader>;

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gridGap={16}
            className={classes.root}
        >
            <Typography
                variant="h1"
                color="textPrimary"
                dangerouslySetInnerHTML={{ __html: firstHeaderSection?.content.text.html }}
                style={{ color: darkMode && '#FFFFFF', textAlign: 'center', lineHeight: '64px' }}
            />
            <Avatar alt="User" className="avatar" src={author?.profileMedia?.url} onClick={() => { window.location.href = `/users/${author?.uid}` }} />
            <Typography variant="h5" color="textPrimary" style={{ color: darkMode && '#FFFFFF' }}>{author?.username}</Typography>
            <Typography variant="h5" style={{ color: darkMode ? '#95B9CA' : ' #605F7C', marginBottom: 32 }}>{moment(page?.lastUpdateIso).format("Do MMM YYYY")}</Typography>
            <CustomDivider />

            {/* awakened site */}
            {/* <Button
                variant="contained"
                color="primary"
                style={{ background: darkMode && page?.pageColor }}
                className='awakenedSite'
            >
                <HelpIcon />
                <Typography style={{ marginLeft: 20 }}>{getLanguage().awakenedSite}</Typography>
            </Button> */}
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1000,
        padding: '0 24px',
        margin: "32px auto",
        position: 'relative',
        '& .avatar': {
            width: 48,
            height: 48,
            border: '2px solid #F2F2FE'
        },
        '& .report': {
            cursor: 'pointer',
            '& svg': {
                padding: 0,
                color: theme.palette.secondary.main
            }
        },
        '& p': {
            margin: 0
        },
        '& .awakenedSite': {
            position: 'absolute',
            right: -80,
            bottom: 80,
            background: 'linear-gradient(180deg, #343F45 0%, #3D4A51 25.22%, #37454B 42.71%, #2E3C43 74.11%, #1F2B31 100%)',
        },
        '& hr': {
            width: '100%'
        }
    },
}));

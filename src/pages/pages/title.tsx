import React, { useContext, useState, useEffect } from 'react';
import { Box, makeStyles, Typography, Button, Tooltip } from '@material-ui/core';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import clsx from 'clsx';
import { PageContext } from '../../utils/client/page-state';
import { useWindowSize } from '../../utils/client/use-window-size';
import ContentSection, { ContentHeader, ContentTypes } from '../../models/content-section';
import { getLanguage } from '../../langauge/language';
import { recordPageLike, subscribeToSite, unsubscribeToSite } from '../../utils/client/page-action';
import { isMobileDevice, shortHandNumber } from '../../utils/helpers';
import { UserContext } from '../../utils/client/user-state';
import SvgShare from '../../../public/share.svg';
import { checkSiteSubscribed } from '../../utils/client/user-actions';

export default function PageTitle(props: {
    darkMode?: boolean,
    pageLiked?: 1 | 0 | -1
}) {
    const { darkMode } = props
    const classes = useStyles();
    const [copied, setCopied] = useState<boolean | undefined>(null)
    const [isSubscribed, setIsSubscribed] = useState<boolean | undefined>(null)
    const size = useWindowSize();
    const pageCtx = useContext(PageContext);
    const userCtx = useContext(UserContext);
    const user = userCtx.userState.user;
    const page = pageCtx.pageState.page;
    const site = pageCtx.pageState.site;
    const [pageLiked, setPageLiked] = useState<-1 | 0 | 1>(props.pageLiked)

    useEffect(() => {
        let mounted = true;
        const checkSubscirption = async () => {
            const res = await checkSiteSubscribed(site.uid);
            mounted && setIsSubscribed(res);
        }

        user && site && checkSubscirption();

        return () => { mounted = false }
    }, [site, user])

    const handleURLCopy = () => {
        if (isMobileDevice()) {
            navigator
                .share({
                    title: document.title,
                    text: document.location.href,
                    url: document.location.href,
                })
                .then(() => setCopied(() => true))
                .catch(err => console.error(err));
        }
        else {
            // copy url
            navigator.clipboard.writeText(document.location.href)
            setCopied(() => true)

        }
    }

    const useStyleTooltip = makeStyles(() => ({
        arrow: {
            color: page?.pageColor,
        },
        tooltip: {
            backgroundColor: page?.pageColor,
        },
    }))

    const handleSubscribe = async () => {
        if (user) {
            if (isSubscribed === true) {
                const res = await unsubscribeToSite(site.uid)
                return res && setIsSubscribed(() => false);
            }

            if (isSubscribed === false) {
                const res = await subscribeToSite(site.uid);
                return res && setIsSubscribed(() => true);
            }
        }
        // return users to login page
        return window.open('/auth', '_blank').focus()
    }

    const handleLike = (liked: 1 | -1) => async () => {
        if (user) {
            setPageLiked((prev) => prev === liked ? 0 : liked)
            await recordPageLike(page?.uid);
            return
        }

        return window.open('/auth', '_blank').focus();
    }

    // check last uri
    const urls = window.location.href.split('/');
    const last = urls[urls.length - 1];
    // parse the content sections according to the last uri
    const contentSections = (last === 'preview' ? page?.contentDraftSections : page?.contentSections) ?? [] as ContentSection<ContentTypes>[];
    const firstHeaderSection = contentSections.find(section => section?.type === 'header') as ContentSection<ContentHeader>;

    return (
        <Box
            display={size.width > 599 ? "grid" : "flex"}
            flexDirection="column"
            alignItems="center"
            gridTemplateColumns="95px 1fr 95px"
            gridGap={size.width > 599 ? 55 : 0}
            className={classes.root}
        >
            {/* like and share */}
            <Box display="flex" flexDirection={size.width > 599 ? "column" : "row"}>
                <Box className="shape like" style={{ background: page?.pageColor }}>
                    <ThumbUpAltOutlinedIcon onClick={handleLike(1)} className={pageLiked === 1 ? 'active' : ''} />
                    <Typography variant="h6" color="secondary">
                        {shortHandNumber(Math.abs(page?.likes))} {page?.likes >= 0 ? getLanguage().likes : getLanguage().unlikes}
                    </Typography>
                    <ThumbDownOutlinedIcon onClick={handleLike(-1)} className={pageLiked === -1 ? 'active' : ''} />
                </Box>
                <Tooltip
                    title={copied ? 'Copied' : 'Copy to clipboard'}
                    placement={size.width > 599 ? 'right' : 'top'}
                    classes={useStyleTooltip()}
                    arrow
                >
                    <Box
                        className="shape share"
                        style={{ background: darkMode && '#FFFFFF' }}
                        onClick={handleURLCopy}
                        onMouseLeave={() => setCopied(() => null)}
                    >
                        <SvgShare fill={darkMode ? '#181820' : 'white'} width={24} height={24} />
                        <Typography variant="h6" color="secondary" style={{ color: darkMode && '#181820' }}>{getLanguage().share}</Typography>
                    </Box>
                </Tooltip>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Typography variant="h1" dangerouslySetInnerHTML={{ __html: firstHeaderSection?.content.text.html }} style={{ color: darkMode && '#FFFFFF' }} />
                {/* this is sub-header. it is optional at the moment. */}
                {/* <Typography variant="h4">Duis nisl erat, elementum in lacus at, iaculis convallis augue.</Typography> */}
                <Button
                    variant="contained"
                    color="primary"
                    style={{ background: page?.pageColor }}
                    onClick={handleSubscribe}
                >
                    {isSubscribed ? getLanguage().unsubscribeToSite : getLanguage().subscribeToSite}
                </Button>
            </Box>
            <Box />
        </Box>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        paddingTop: `${theme.spacing(10)}px !important`,
        [theme.breakpoints.down('xs')]: {
            paddingTop: `${theme.spacing(4)}px !important`,
        },
        '& h1': {
            textAlign: 'center',
        },
        '& h4': {
            color: '#57586E',
            textAlign: 'center',
            marginTop: theme.spacing(3),
        },
        '& button': {
            borderRadius: 30,
            fontWeight: 'bold',
            marginTop: theme.spacing(3),
            [theme.breakpoints.down('xs')]: {
                marginTop: theme.spacing(4),
            },
        },
        '& .shape': {
            borderRadius: '50%',
            display: "flex",
            flexFlow: "column",
            justifyContent: "center",
            alignItems: "center",
            width: 85,
            height: 85,
        },
        '& .like': {
            '& svg': {
                color: theme.palette.secondary.main,
                cursor: 'pointer',
                '&:hover': {
                    color: theme.palette.warning.main
                }
            },
            '& .active': {
                color: theme.palette.warning.main
            }
        },
        '& .share': {
            background: '#181820',
            marginTop: theme.spacing(2),
            cursor: 'pointer',
            [theme.breakpoints.down('xs')]: {
                marginTop: 0,
                marginLeft: theme.spacing(2)
            },
            '& h6': {
                marginTop: theme.spacing(1)
            },
        },
    },
}));

import React, { useState, useContext } from 'react';
import { Box, makeStyles, Typography, Avatar, Tooltip } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { getLanguage } from '../../langauge/language';
import { unsubscribeToSite } from '../../utils/client/page-action';
import CustomDivider from '../../components/custom-divider';
import { sortByProperty } from '../../utils/helpers';
import { dispatchUser, UserContext } from '../../utils/client/user-state';
import { useWindowSize } from '../../utils/client/use-window-size';
import { Player } from '@lottiefiles/react-lottie-player';
import noItem from '../../../public/lottie/not-view.json';

export default function Subscriptions() {
    const classes = useStyles();
    const userCtx = useContext(UserContext);
    const siteMap = userCtx.userState.userSubscriptions;
    const [hoveredUid, setHoveredUid] = useState<string | undefined>(null);
    const size = useWindowSize();

    const handleUnsubscribe = (uid) => async (event) => {
        event.stopPropagation();
        const res = await unsubscribeToSite(uid)
        if (res) {
            delete siteMap[uid];
            dispatchUser({ type: 'setSubscriptions', data: { ...siteMap } })
        }
    }

    const handleMoveRootSite = (url) => () => {
        window.open(`/pages/${url}`, '_blank').focus()
    }

    const mouseEnter = (siteUid) => () => {
        setHoveredUid(siteUid)
    }

    const mouseLeave = () => () => {
        setHoveredUid(null)
    }

    const sites = sortByProperty(siteMap, 'totalVisits', 'desc');

    return (
        <Box className={classes.root}>
            <Box p={size.width > 599 ? 3 : 2}>
                <Typography variant="h5" color="textSecondary" component="p" style={{ fontSize: 16, fontWeight: 500 }}>
                    {getLanguage().subscriptions}
                </Typography>
            </Box>
            <CustomDivider />
            <Box display="flex" flexDirection="column" p={size.width > 599 ? 3 : 2} className="scrollable" maxHeight={400}>
                {
                    sites.length
                        ? sites.map(site =>
                            <Box
                                key={site.uid}
                                display="grid"
                                gridTemplateColumns="32px 1fr 24px"
                                gridGap={16}
                                alignItems="center"
                                mb={size.width > 599 ? 3 : 2}
                                onMouseEnter={mouseEnter(site.uid)}
                                onMouseLeave={mouseLeave()}
                                style={{ cursor: 'pointer' }}
                                onClick={handleMoveRootSite(site.url)}
                            >
                                <Avatar alt="logo" className="avatar" src={site.siteIcon.url} />
                                <Typography color="textPrimary" component="span" className=" multi-line-turncate">
                                    {site.name}
                                </Typography>
                                {
                                    (hoveredUid === site.uid || size.width <= 599) &&
                                    <Tooltip title={getLanguage().unsubscribeToSite} placement="bottom">
                                        <RemoveCircleOutlineIcon onClick={handleUnsubscribe(site.uid)} />
                                    </Tooltip>
                                }
                            </Box>
                        )
                        :
                        <>
                            {
                                size.width <= 599 &&
                                <Player
                                    autoplay
                                    loop
                                    src={JSON.stringify(noItem)}
                                    style={{ width: 150, }}
                                />
                            }
                            <Typography variant="h6" color="textSecondary" style={{ textAlign: 'center', fontSize: 14 }}>
                                You don’t have any subscription right now
                            </Typography>
                        </>
                }
            </Box>
        </Box>
    );
}

const useStyles = makeStyles(() => ({
    root: {
        '& svg': {
            color: '#92929D',
            cursor: 'pointer'
        },
        '& p': {
            lineHeight: '16px',
            fontWeight: 500,
            letterSpacing: '0.1px'
        },
        '& span': {
            lineHeight: '16px',
            letterSpacing: '0.2px',
            fontSize: 16
        },
        '& .avatar': {
            width: 32,
            height: 32,
        },
    }
}));

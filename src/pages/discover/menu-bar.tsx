import React, { useContext } from 'react';
import { Box, makeStyles, Typography, Hidden, } from '@material-ui/core';
import { getLanguage } from '../../langauge/language';
import { useWindowSize } from '../../utils/client/use-window-size'
import { UserContext } from '../../utils/client/user-state';
import StyledTabs from '../../components/styled-tabs';
import StyledTab from '../../components/styled-tab';
import { Categories } from '../../variables';
import CustomAutocomplete from '../../components/custom-autocomplete';

export default function MenuBar(props: {
    category?: string,
    type?: 'home' | 'popular' | 'trending' | 'new',
    numOfDataPoints?: number,
}) {
    const classes = useStyles();
    const size = useWindowSize();
    const userCtx = useContext(UserContext);
    const user = userCtx.userState.user;
    const { type, category, numOfDataPoints } = props;

    const handleTabChange = async (event, newValue) => {
        let pageType = ''
        if (newValue === 0) pageType = 'home'
        if (newValue === 1) pageType = 'popular'
        if (newValue === 2) pageType = 'trending'
        if (newValue === 3) pageType = 'new'
        const encodedType = encodeURIComponent(pageType);
        const encodedCategory = encodeURIComponent(category)
        return window.location.href = `/discover?type=${encodedType}${category ? '&category=' + encodedCategory : ''}`
    };

    const handleChangeCategory = (event, value) => {
        const encodedType = encodeURIComponent(type);
        const encodedCategory = encodeURIComponent(value)
        return window.location.href = `/discover?type=${encodedType}${value ? '&category=' + encodedCategory : ''}`
    }

    let tabIdx = 0
    if (type === 'home') tabIdx = 0;
    if (type === 'popular') tabIdx = 1;
    if (type === 'trending') tabIdx = 2;
    if (type === 'new') tabIdx = 3;

    const Title = () => {
        const handleTapTitle = () => {
            if (user) {
                window.location.href = '/dashboard/my-data'
                return;
            }
            window.location.href = '/auth'
        }

        return (
            <Box className={classes.title} onClick={handleTapTitle}>
                <Typography variant="h3" color="textPrimary" style={{ fontWeight: 'bold' }}>{getLanguage().yourData}</Typography>
                <Typography variant="h5" component="p">
                    {
                        user ?
                            <>
                                {getLanguage().hey}&nbsp;
                                <b>{user.username ?? getLanguage().there}</b>
                                , you have&nbsp;
                                <b>{`${numOfDataPoints.toLocaleString()} ${getLanguage().dataPoints} `}</b>
                                on {getLanguage().appName}
                            </>
                            :
                            <>
                                <a>Login</a>&nbsp;to start owning your data
                            </>
                    }
                </Typography>
            </Box>
        )
    }

    const Tabs = () =>
        <Box display="flex" maxHeight="max-content" height="100%" minHeight={70} className={classes.tabs}>
            <StyledTabs value={tabIdx} onChange={handleTabChange} indicatorwidth='100%'>
                <StyledTab label={getLanguage().home} />
                <StyledTab label={getLanguage().popular} />
                <StyledTab label={getLanguage().trending} />
                <StyledTab label={getLanguage().new} />
            </StyledTabs>
        </Box>

    return (
        <Box
            className={classes.root}
            display="flex"
            position="fixed"
            justifyContent="center"
            pt={0.5}
            width={`calc(100% - 11px)`}
        >
            <Hidden mdUp>
                <Box width="100%" display="flex" flexDirection="column" padding="0 24px">
                    <Box display="flex" pb={1} flexDirection="column">
                        <Title />
                    </Box>
                    <Box
                        display="flex"
                        flexDirection={size.width > 599 ? "row" : "column-reverse"}
                        alignItems={size.width > 599 ? 'center' : 'flex-start'}
                        justifyContent={size.width > 599 ? 'space-between' : 'center'}
                    >
                        <Tabs />
                        <CustomAutocomplete
                            options={Object.keys(Categories)}
                            value={category}
                            helperText={getLanguage().category}
                            onChange={handleChangeCategory}
                        />
                    </Box>
                </Box>
            </Hidden>

            {/* desktop mode */}
            <Hidden smDown>
                <Box width="100%" display="flex" justifyContent="space-between" alignItems="center" padding="0 24px">
                    <Tabs />
                    <Title />
                    <CustomAutocomplete
                        options={Object.keys(Categories)}
                        value={category}
                        helperText={getLanguage().category}
                        onChange={handleChangeCategory}
                    />
                </Box>
            </Hidden>
        </Box >
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.secondary.main,
        borderBottom: '2px solid #ECECF4',
        zIndex: 100,
    },
    title: {
        textAlign: 'center',
        cursor: 'pointer',
        '& a': {
            textDecoration: 'underline',
            color: '#FF7534'
        },
        '& p': {
            color: '#92929D',
            marginTop: 5,
            lineHeight: '22px',
            '& b': {
                color: theme.palette.text.primary,
                textTransform: 'lowercase'
            },
        },
    },
    tabs: {
        '& .Mui-selected': {
            color: theme.palette.primary.main
        }
    },
}));

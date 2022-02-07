import React from 'react';
import { makeStyles, IconButton, Hidden, SvgIcon, Box } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Account from '../../main-layout/top-bar/account'
import Notifications from '../../main-layout/top-bar/notifications';
import AppCoin from '../../main-layout/top-bar/app-coin';
import MultiLang from '../../main-layout/top-bar/multi-lang';
import StyledTab from '../../../components/styled-tab';
import { getLanguage } from '../../../langauge/language';
import SvgMySites from '../../../../public/my-sites.svg';
import SvgDashboardMenu from '../../../../public/dashboard-menu.svg';
import { useWindowSize } from '../../../utils/client/use-window-size';

export default function TopBar(props: {
    onMobileNavOpen: () => void
}) {
    const classes = useStyles();
    const size = useWindowSize()

    const handleMove = (location: string) => () => {
        window.location.href = location
    }

    return (
        <Box className={classes.root}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Hidden lgUp>
                    <IconButton color="inherit" onClick={props?.onMobileNavOpen}>
                        <SvgIcon fontSize="small">
                            <MenuIcon />
                        </SvgIcon>
                    </IconButton>
                </Hidden>
                <Hidden smDown>
                    <Box display="flex">
                        <StyledTab label={getLanguage().dashboard} icon={<SvgDashboardMenu width={16} height={16} />} onClick={handleMove('/dashboard/my-data')} />
                        <StyledTab label={getLanguage().mySites} icon={<SvgMySites width={16} height={16} />} onClick={handleMove('/my-sites')} />
                    </Box>
                </Hidden>
            </Box>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
                <MultiLang />
                <Account requiredOptions={size.width > 959 ? [] : ['dashboard', 'my-sites']} />
                <AppCoin />
                <Notifications />
            </Box>
        </Box >
    )
}
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: 'inset 0px -1px 0px #E2E2EA',
        height: 70,
        padding: `0px ${theme.spacing(3)}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
}));

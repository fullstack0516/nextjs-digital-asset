import { AppBar, Hidden, Toolbar, makeStyles, Box } from '@material-ui/core';
import Logo from '../../../components/logo';
import Account, { MenuOptions } from './account';
import Menu from './menu';
import { useContext } from 'react';
import { UserContext } from '../../../utils/client/user-state';
import { useWindowSize } from '../../../utils/client/use-window-size';
import MultiLang from './multi-lang';
import AppCoin from './app-coin';
import Notifications from './notifications';

export default function TopBar() {
    const classes = useStyles();
    const userCtx = useContext(UserContext);
    const user = userCtx.userState.user;
    const size = useWindowSize()

    let menuOptions = user && size.width >= 1280
        ? ['profile']
        : ['discover', 'dashboard', 'my-sites', 'subscriptions', 'profile']

    if (user?.isAdmin && size.width < 1280) {
        // add admin option behind 'my-sites'
        menuOptions.splice(3, 0, 'admin')
    }

    return (
        <AppBar className={classes.root}>
            <Toolbar className={classes.toolbar}>
                <Box display="flex" alignItems="center">
                    <a onClick={() => window.location.href = "/discover"} style={{ marginRight: 24 }}>
                        <Logo />
                    </a>
                    <Hidden mdDown>
                        <Menu />
                    </Hidden>
                </Box>
                <Box display="flex" justifyContent="flex-end" alignItems="center">
                    <MultiLang />
                    <Account requiredOptions={menuOptions as MenuOptions[]} />
                    {
                        user &&
                        <>
                            <AppCoin />
                            <Notifications />
                        </>
                    }
                </Box>
            </Toolbar>
        </AppBar>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        zIndex: 100,
        backgroundColor: theme.palette.secondary.main,
        boxShadow: 'inset 0px -1px 0px #F6F6F9',
    },
    toolbar: {
        minHeight: 70,
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative'
    }
}));

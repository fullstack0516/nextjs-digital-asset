import React, { useContext, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Avatar, Grid, ButtonBase, Hidden, makeStyles, Typography, Dialog, Button, Box } from '@material-ui/core';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Subscriptions from '../../../pages/discover/subscriptions';
import { UserContext } from '../../../utils/client/user-state'
import { logout } from '../../../utils/client/auth-actions';
import { getLanguage } from '../../../langauge/language';
import OptionsMenu from '../../../components/options-menu';
import { PublicRoutes } from '../../../variables';
import SvgDiscover from '../../../../public/discover.svg';
import SvgDashboardMenu from '../../../../public/dashboard-menu.svg';
import SvgMySites from '../../../../public/my-sites.svg';
import SvgAdmin from '../../../../public/admin-menu.svg';
import SvgEditPen from '../../../../public/edit-pen.svg';
import SvgLogout from '../../../../public/logout.svg';
import SvgSubscriptions from '../../../../public/subscriptions.svg';
import { useWindowSize } from '../../../utils/client/use-window-size';
import CustomDivider from '../../../components/custom-divider';
import { Key as LogIn } from 'react-feather'

export type MenuOptions = 'discover' | 'dashboard' | 'my-sites' | 'subscriptions' | 'admin' | 'profile' | 'logout' | 'signin';

export default function Account(props: {
    darkMode?: boolean,
    requiredOptions?: MenuOptions[]
}) {
    const classes = useStyles();
    const ref = useRef<any>(null);
    const { darkMode, requiredOptions } = props;
    const usreContext = useContext(UserContext)
    const { user } = usreContext.userState;
    const router = useRouter();
    const [isOpen, setOpen] = useState<boolean>(false);
    const [openSubscriptions, setOpenSubscriptions] = useState<boolean>(false);
    const size = useWindowSize();

    const handleClose = () => {
        setOpen(false);
    };

    const handleLogout = async () => {
        handleClose();
        logout();
        if (!PublicRoutes.includes(router.pathname)) {
            window.location.href = "/auth"
        }
    };

    const handleMove = (url) => () => {
        window.location.href = url;
    }

    const handleOpenSubscriptions = () => {
        setOpen(false);
        setOpenSubscriptions(() => true);
    }

    let defaultMenuOptions = [
        { id: 'discover' as MenuOptions, icon: <SvgDiscover width={13} height={13} />, text: getLanguage().discover, onClick: handleMove('/discover') },
        { id: 'dashboard' as MenuOptions, icon: <SvgDashboardMenu width={13} height={13} />, text: getLanguage().dashboard, onClick: handleMove('/dashboard/my-data') },
        { id: 'my-sites' as MenuOptions, icon: <SvgMySites width={13} height={13} />, text: getLanguage().mySites, onClick: handleMove('/my-sites') },
        { id: 'admin' as MenuOptions, icon: <SvgAdmin width={13} height={13} />, text: getLanguage().admin, onClick: handleMove('/admin/overview') },
        { id: 'profile' as MenuOptions, icon: <SvgEditPen width={13} height={13} />, text: getLanguage().editProfile, onClick: handleMove('/profile') },
    ]

    if (router.pathname === '/discover' && size.width <= 599) {
        defaultMenuOptions.push({ id: 'subscriptions' as MenuOptions, icon: <SvgSubscriptions width={13} height={13} fill="#FF7534" />, text: getLanguage().subscriptions, onClick: handleOpenSubscriptions })
    }

    let menuOptions = []

    if (user) {
        menuOptions = [
            ...(requiredOptions ?? []).map(e => defaultMenuOptions.find(option => option.id === e)).filter(e => e),
            { id: 'logout' as MenuOptions, icon: <SvgLogout width={13} height={13} />, text: getLanguage().logout, onClick: handleLogout },
        ]
    }

    if (!user && size.width < 599) {
        menuOptions = [
            { id: 'discover' as MenuOptions, icon: <SvgDiscover width={13} height={13} />, text: getLanguage().discover, onClick: handleMove('/discover') },
            { id: 'signin' as MenuOptions, icon: <LogIn width={15} height={15} />, text: "Signup / Login", onClick: handleMove('/auth') }
        ]
    }

    return (
        <Box mr={2}>
            <Grid component={ButtonBase} ref={ref}>
                {
                    user ?
                        <Box display="flex" alignItems="center" onClick={() => setOpen(() => true)} >
                            <Avatar alt="User" className={classes.avatar} src={user.profileMedia.url} />
                            <Hidden xsDown>
                                <Typography variant="h6" color="textSecondary" style={{ color: darkMode && 'white' }}>{user.username}</Typography>
                                <div className={classes.arrowBtn} style={{ transform: isOpen && 'rotate(180deg)' }} />
                            </Hidden>
                        </Box>
                        :
                        <>
                            {
                                size.width > 599 &&
                                <Button variant="text" className={classes.menuBtn} onClick={handleMove('/auth')}>
                                    <Typography variant="h5" color="textSecondary">Signup / Login</Typography>
                                </Button>
                            }
                            <Button variant="text" className={classes.menuBtn} onClick={() => setOpen(() => true)}>
                                <Typography variant="h5" color="textSecondary">{getLanguage().menu}</Typography>
                            </Button>
                        </>
                }
            </Grid>
            <OptionsMenu
                open={isOpen}
                onClose={handleClose}
                anchorEl={ref.current}
                options={menuOptions}
            />
            {
                size.width < 599 &&
                <Dialog open={openSubscriptions}>
                    <MuiDialogContent style={{ padding: 0 }}>
                        <Subscriptions />
                    </MuiDialogContent>
                    <CustomDivider />
                    <MuiDialogActions style={{ justifyContent: 'center' }}>
                        <Button onClick={() => setOpenSubscriptions(() => false)} color="primary" variant="contained">
                            <Typography variant="h5">{getLanguage().close}</Typography>
                        </Button>
                    </MuiDialogActions>
                </Dialog>
            }
        </Box>
    );
}

const useStyles = makeStyles((theme) => ({
    avatar: {
        height: 32,
        width: 32,
        marginRight: theme.spacing(1)
    },
    arrowBtn: {
        marginLeft: theme.spacing(3),
        width: 0,
        height: 0,
        borderLeft: '5.35px solid transparent',
        borderRight: '5.35px solid transparent',
        borderTop: '6.67px solid #92929D',
    },
    menuBtn: {
        boxShadow: 'unset !important',
        padding: '4px 8px',
        minWidth: 'unset',
        width: 'max-content',
        '& + &': {
            marginLeft: theme.spacing(1.5)
        }
    }
}));

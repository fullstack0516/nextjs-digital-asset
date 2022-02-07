import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Drawer, Hidden, List, ListSubheader, makeStyles } from '@material-ui/core';
import Logo from '../../../components/logo';
import NavItem from './nav-item';
import {
    Settings as SettingsIcon,
    Users as UsersIcon,
    Layers as SitesIcon,
    AlignJustify as OverviewIcon,
    Bookmark as PagesIcon,
    Film as FilmIcon,
} from 'react-feather'
import { getLanguage } from '../../../langauge/language';

const navConfig = [
    {
        subheader: 'Admin',
        items: [
            {
                title: 'Overview',
                icon: OverviewIcon,
                href: '/admin/overview'
            },
            {
                title: 'Users',
                icon: UsersIcon,
                href: '/admin/users'
            },
            {
                title: 'Sites',
                icon: SitesIcon,
                href: '/admin/sites'
            },
            {
                title: 'Pages',
                icon: PagesIcon,
                href: '/admin/pages'
            },
            {
                title: getLanguage().videos,
                icon: FilmIcon,
                href: '/admin/videos'
            },
            {
                title: 'Settings',
                icon: SettingsIcon,
                href: '/admin/settings'
            },
        ]
    },
];

function renderNavItems({ items, pathname, depth }) {
    return (
        <List disablePadding>
            {items.reduce(
                (acc, item) => reduceChildRoutes({ acc, item, pathname, depth }),
                []
            )}
        </List>
    );
}

function reduceChildRoutes({
    acc,
    pathname,
    item,
    depth = 0
}) {
    const key = item.title + depth;

    if (item.items) {
        acc.push(
            <NavItem
                depth={depth}
                icon={item.icon}
                key={key}
                open={pathname === item.href}
                title={item.title}
            >
                {renderNavItems({
                    depth: depth + 1,
                    pathname,
                    items: item.items
                })}
            </NavItem>
        );
    } else {
        acc.push(
            <NavItem
                depth={depth}
                href={item.href}
                icon={item.icon}
                key={key}
                title={item.title}
            />
        );
    }

    return acc;
}

export default function NavBar(props: {
    openMobile: boolean,
    onMobileClose: () => void,
}) {
    const classes = useStyles();
    const router = useRouter();
    const { openMobile, onMobileClose } = props

    useEffect(() => {
        if (openMobile && onMobileClose) {
            onMobileClose();
        }
    }, [router.pathname]);

    const content = (
        <Box height="100%" display="flex" flexDirection="column" boxShadow='inset -1px 0px 0px #E2E2EA'>
            <Box boxShadow="inset 0px -1px 0px #E2E2EA" height={70} display="flex" alignItems="center" pl={2}>
                <Logo />
            </Box>
            {navConfig.map((config) => (
                <List
                    key={config.subheader}
                    subheader={(
                        <ListSubheader disableGutters disableSticky className={classes.subHeader}>
                            {config.subheader}
                        </ListSubheader>
                    )}
                >
                    {renderNavItems({ items: config.items, pathname: router.pathname, depth: 0 })}
                </List>
            ))}
        </Box>
    );

    return (
        <>

            <Hidden lgUp>
                <Drawer
                    anchor="left"
                    classes={{ paper: classes.mobileDrawer }}
                    onClose={onMobileClose}
                    open={openMobile}
                    variant="temporary"
                >
                    {content}
                </Drawer>
            </Hidden>
            <Hidden mdDown>
                <Drawer
                    anchor="left"
                    classes={{ paper: classes.desktopDrawer }}
                    open
                    variant="persistent"
                >
                    {content}
                </Drawer>
            </Hidden>
        </>
    );
}


const useStyles = makeStyles((theme) => ({
    mobileDrawer: {
        width: 256
    },
    desktopDrawer: {
        width: 256,
        height: '100%'
    },
    subHeader: {
        paddingLeft: theme.spacing(2.5)
    }
}));

import React, { useState } from 'react';
import { makeStyles, Box } from '@material-ui/core';
import NavBar from './NavBar';
import TopBar from './top-bar'

export default function AdminLayout(props: {
    children: any
}) {
    const classes = useStyles();
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <Box className={classes.root}>
            <NavBar
                onMobileClose={() => setMobileNavOpen(false)}
                openMobile={isMobileNavOpen}
            />
            <Box className={classes.wrapper}>
                <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
                <Box className={classes.contentContainer}>
                    <Box className={classes.content}>
                        {props?.children}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        width: '100%'
    },
    wrapper: {
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden',
        flexDirection: 'column',
        [theme.breakpoints.up('lg')]: {
            paddingLeft: 256
        }
    },
    contentContainer: {
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden'
    },
    content: {
        flex: '1 1 auto',
        height: '100%',
        overflow: 'auto'
    }
}));

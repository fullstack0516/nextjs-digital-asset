import React, { useEffect, useState } from 'react';
import { Box, makeStyles, Typography, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { getLanguage } from '../../langauge/language';
import { useWindowSize } from '../../utils/client/use-window-size';
import cookieCutter from 'js-cookie';

export default function CookieInfo() {
    const classes = useStyles();
    const size = useWindowSize();

    const [open, setOpen] = useState(false);

    const handleSet = () => {
        cookieCutter.set('consent', 'true', { expires: 99 * 365 });
        setOpen(false);
    };

    const moveDashboard = () => {
        window.open("/dashboard/my-data", '_blank').focus();
    }

    useEffect(() => {
        const consent = cookieCutter.get('consent');
        if (!consent) {
            setOpen(true);
        }
    }, []);

    if (!open) {
        return null;
    }

    return (
        <Box
            className={classes.root}
            position="fixed"
            maxWidth={size.width > 599 ? 400 : '80%'}
            right={size.width > 599 ? 100 : 20}
            bottom={size.width > 599 ? 60 : 20}
        >
            <Box display="flex" flexDirection="column" p={2} position="relative">
                <Typography variant="h5" color="textSecondary" style={{ lineHeight: '26px' }}>
                    Awake doesn't process your data unless you log in and agree.
                    With our data transparency dashboard, you can control your data.
                </Typography>
                <Box mt={size.width > 599 ? 2 : 1}>
                    <Button
                        variant="contained"
                        style={{ color: 'white', marginRight: 8, background: '#175CFF' }}
                        onClick={handleSet}
                    >
                        <Typography variant="h5">{getLanguage().iUnderstand}</Typography>
                    </Button>
                    <Button variant="contained" color="primary" onClick={moveDashboard}>
                        <Typography variant="h5">{getLanguage().openData}</Typography>
                    </Button>
                </Box>
                {/* triangle bottom arrow */}
                <Box position="absolute" bottom={-14}>
                    <Box className="triangle-bottom" />
                </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2.5} padding={`${size.width > 599 ? 16 : 8}px 16px`}>
                <Typography variant="h5">{getLanguage().whynocookies}</Typography>
                <CloseIcon onClick={() => setOpen(() => false)} />
            </Box>
        </Box>
    );
}


const useStyles = makeStyles((theme) => ({
    root: {
        zIndex: 100,
        '& h5': {
            margin: "0px !important"
        },
        '& > div:nth-child(1)': {
            background: '#FBFEFF',
            borderRadius: theme.spacing(2.5),
            border: '1px solid #C5D5DB',
            '& .triangle-bottom': {
                width: 0,
                height: 0,
                borderTop: '14px solid #C5D5DB',
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                position: 'relative',
                '&:after': {
                    content: '" "',
                    position: 'absolute',
                    left: -10,
                    bottom: 2,
                    borderTop: '12px solid #FBFEFF',
                    borderLeft: '10px solid transparent',
                    borderRight: '10px solid transparent',
                }
            }
        },
        '& > div:nth-child(2)': {
            background: '#313F46',
            boxShadow: '0px 10px 15px rgba(68, 68, 89, 0.2)',
            borderRadius: theme.spacing(1),
            color: theme.palette.secondary.main,
            '& > svg': {
                cursor: 'pointer'
            }
        }
    },
}));

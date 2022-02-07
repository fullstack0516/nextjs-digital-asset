import React, { useRef, useState, } from 'react';
import {
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Popover,
    Tooltip,
    Typography,
    makeStyles,
    Badge
} from '@material-ui/core';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';

export default function Notifications() {
    const classes = useStyles();
    const notifications = [];
    const ref = useRef(null);
    const [isOpen, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Tooltip title="Notifications">
                <IconButton color="inherit" ref={ref} onClick={handleOpen} className={classes.icon}>
                    <Badge color="primary" variant="dot" classes={{ badge: classes.badge }}>
                        <NotificationsNoneIcon />
                    </Badge>
                </IconButton>
            </Tooltip>
            <Popover
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                classes={{ paper: classes.popover }}
                anchorEl={ref.current}
                onClose={handleClose}
                open={isOpen}
            >
                <Box p={2}>
                    <Typography variant="h6" color="textPrimary">Notifications</Typography>
                </Box>
                {notifications.length === 0 ? (
                    <Box p={2}>
                        <Typography variant="h6" color="textPrimary">There are no notifications</Typography>
                    </Box>
                ) : (
                    <>
                        <List disablePadding>
                            {notifications.map((notification) => {
                                return (
                                    <ListItem divider key={notification.id}>
                                        <ListItemText
                                            primary={notification.title}
                                            primaryTypographyProps={{ variant: 'subtitle2', color: 'textPrimary' }}
                                            secondary={notification.description}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                        <Box p={1} display="flex" justifyContent="center">
                            <Button size="small">Mark all as read</Button>
                        </Box>
                    </>
                )}
            </Popover>
        </>
    );
}

const useStyles = makeStyles((theme) => ({
    popover: {
        width: 320
    },
    icon: {
        '& svg': {
            color: '#92929D',
            width: 28,
            height: 28
        }
    },
    badge: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginTop: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
        background: '#FF7534'
    },
}));

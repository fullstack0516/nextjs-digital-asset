import React from 'react';
import { makeStyles, Tab, TabProps } from '@material-ui/core';

export default function StyledTab({
    darkMode,
    ...tabProps
}: TabProps &
    { darkMode?: boolean }
) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Tab
                disableRipple
                disableFocusRipple
                style={{ color: darkMode && 'white' }}
                {...tabProps}
            />
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& .MuiTab-root': {
            opacity: 1,
            textTransform: 'none',
            letterSpacing: '0.1px',
            color: theme.palette.secondary.contrastText,
            height: '100%',
            width: '100%',
            minWidth: 'max-content',
            padding: '6px 24px',
            [theme.breakpoints.down('xs')]: {
                padding: '6px 15px',
            },
            '&:hover': {
                color: theme.palette.text.primary,
            },
            '& .MuiTab-wrapper': {
                display: 'flex',
                flexFlow: 'row',
                height: '100%',
                '& svg': {
                    overflow: 'unset !important',
                    marginRight: `${theme.spacing(1)}px !important`,
                    marginBottom: 0
                }
            },
        },
        // color for selected tab
        '& .Mui-selected': {
            color: theme.palette.text.primary
        }
    }
}));

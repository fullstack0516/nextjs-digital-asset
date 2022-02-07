import React from 'react';
import { makeStyles, Tabs, TabsProps } from '@material-ui/core';

interface StyledTabsConfig extends Omit<TabsProps, 'onChange' | 'textColor'> {
    indicatorwidth?: string | number;
    onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

export default function StyledTabs(props: StyledTabsConfig) {
    const classes = useStyles();
    return (
        <Tabs
            {...props}
            TabIndicatorProps={{ children: <span style={{ width: props.indicatorwidth ?? 120 }} /> }}
            className={classes.root}
        />
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
        '& .MuiTabs-fixed': {
            display: 'flex',
            justifyContent: 'center',
            height: '100%',
            [theme.breakpoints.down('xs')]: {
                '& > div': {
                    width: '100%',
                    '& button': {
                        width: '100%'
                    }
                }
            },
            '& .MuiTabs-flexContainer': {
                width: '100%'
            }
        },
        '& .MuiTabs-indicator': {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            transition: 'none !important',
            '& > span': {
                height: 120,
                backgroundColor: theme.palette.primary.main,
                borderRadius: theme.spacing(1),
                marginTop: -1
            },
        },
    },
}));

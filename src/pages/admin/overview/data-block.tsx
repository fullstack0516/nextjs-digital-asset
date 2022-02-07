import React from 'react';
import { Box, Typography, makeStyles, } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

export default function DataBlock(props: {
    title: string,
    value: number,
    rate?: number,
    description: string
}) {
    const classes = useStyles();
    const { title, value, rate, description } = props

    let rateText = '';
    let color = '';
    if (rate > 1) {
        rateText = `+${(rate * 100 - 100).toFixed(1)}%`
        color = '#3DD598';
    }
    if (rate < 1 && rate != 0) {
        rateText = `-${(100 - rate * 100).toFixed(1)}%`
        color = '#d62c2c';
    }

    return (
        <Box display="flex" flexDirection="column" className={classes.root}>
            <Typography variant="h5" className="title">{title}</Typography>
            <Box className="data" display="flex" alignItems="center">
                <Typography variant="h2" color="textPrimary">{value.toLocaleString()}</Typography>
                {
                    rate ?
                        <>
                            <Typography variant="h5" style={{ color: color }}>{rateText}</Typography>
                            {
                                rate > 1
                                    ? <ArrowUpwardIcon style={{ color: color }} />
                                    : rate < 1
                                        ? <ArrowDownwardIcon style={{ color: color }} />
                                        : ''
                            }
                        </>
                        :
                        ''
                }
            </Box>
            <Typography variant="h6" className="description">{description}</Typography>
        </Box>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.secondary.main,
        borderRadius: theme.spacing(2.5),
        padding: `${theme.spacing(2.5)}px ${theme.spacing(3)}px`,
        '& .title': {
            color: '#171725',
            marginBottom: theme.spacing(3),
        },
        '& .data': {
            marginBottom: theme.spacing(1),
            '& h2': {
                marginRight: theme.spacing(1)
            },
            '& h5': {
                marginRight: theme.spacing(0.2)
            },
            '& svg': {
                width: 18,
            }
        },
        '& .description': {
            marginBottom: theme.spacing(0.5),
            color: '#696974'
        }
    }
}));

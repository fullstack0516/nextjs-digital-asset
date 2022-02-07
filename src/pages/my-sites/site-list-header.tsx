import React from 'react';
import { Box, makeStyles, Typography, Hidden, } from '@material-ui/core';
import { getLanguage } from '../../langauge/language';
import { useWindowSize } from '../../utils/client/use-window-size';

export default function ListHeader() {
    const classes = useStyles();
    const size = useWindowSize();

    return (
        <Box
            display="grid"
            gridTemplateColumns={size.width > 599 ? "1fr 1fr 1fr 1fr" : "minmax(120px, 2.5fr) 1fr 20px"}
            pl={size.width > 599 ? 4 : 3}
            pr={size.width > 599 ? 3 : 2}
            gridGap={8}
            height={50}
            alignItems="center"
            className={classes.root}
        >
            <Hidden xsDown>
                <Typography variant="h6" component="span" color="textSecondary">{getLanguage().siteName}</Typography>
                <Typography variant="h6" component="span" color="textSecondary">{getLanguage().siteUrl}</Typography>
            </Hidden>
            <Hidden smUp>
                <Typography variant="h6" component="span" color="textSecondary">{getLanguage().siteName}</Typography>
                <Typography variant="h6" component="span" color="textSecondary">{getLanguage().totalVisits}</Typography>
            </Hidden>
        </Box>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.common.black,
    },
}));

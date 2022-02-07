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
            gridTemplateColumns={size.width > 768 ? "33% 26% 12% 1fr" : "minmax(170px, 2.5fr) 1fr 40px"}
            pl={size.width > 768 ? 4 : 3}
            pr={size.width > 768 ? 3 : 2}
            gridGap={8}
            height={50}
            alignItems="center"
            className={classes.root}
        >
            <Hidden smDown>
                <Typography variant="h6" component="span" color="textSecondary">{getLanguage().pageName}</Typography>
                <Typography variant="h6" component="span" color="textSecondary">{getLanguage().stats}</Typography>
                <Typography variant="h6" component="span" color="textSecondary">{getLanguage().dateUpdated}</Typography>
            </Hidden>
            <Hidden mdUp>
                <Typography variant="h6" component="span" color="textSecondary">{getLanguage().pageName}</Typography>
                <Typography variant="h6" component="span" color="textSecondary">{getLanguage().visits}</Typography>
            </Hidden>
        </Box>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.common.black,
    },
}));

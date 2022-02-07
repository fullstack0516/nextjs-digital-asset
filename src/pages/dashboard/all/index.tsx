import React, { useState } from 'react';
import { Box, makeStyles, } from "@material-ui/core";
import MenuBar from "../menu-bar";
import { useWindowSize } from '../../../utils/client/use-window-size';

export default function All() {
    const classes = useStyles();
    const size = useWindowSize();
    const [sortBy, setSortBy] = useState<number>(0);

    return (
        <>
            <MenuBar onChangeSort={(newValue) => setSortBy(() => newValue)} />
            <Box className={classes.root}>
                All
            </Box>
        </>

    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1170,
        width: '100%',
        marginTop: theme.spacing(32),
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(15),
        },
    },
}));

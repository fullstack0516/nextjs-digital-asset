import React from 'react';
import { Divider, DividerProps, makeStyles } from '@material-ui/core';

export default function CustomDivider(props: DividerProps) {
    const classes = useStyles()
    return (
        <Divider {...props} className={classes.root} />
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        border: '1px solid #F2F2FE',
        height: 0,
    }
}))

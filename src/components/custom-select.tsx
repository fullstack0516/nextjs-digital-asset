import React from 'react';
import { makeStyles, Select, Typography, Box, MenuItem } from '@material-ui/core';

export default function CustomSelect(props: {
    optionMap: { [key: string]: string },
    value?: any,
    onChange?: (event: object, child?: object) => void,
    helperText?: string
}) {
    const classes = useStyles();
    const { optionMap, value, onChange, helperText } = props

    return (
        <Select
            renderValue={(value: string) => (
                <Box display="flex" alignItems="center" width="100%">
                    <Typography variant="h5" color="textSecondary">
                        {helperText}:&nbsp;<b>{optionMap[value]}</b>
                    </Typography>
                </Box>
            )}
            value={value}
            onChange={onChange}
            className={classes.root}
            displayEmpty
        >
            {
                Object.keys(optionMap).map((key) => (
                    <MenuItem value={key} key={key}>{optionMap[key]}</MenuItem>
                ))
            }
        </Select>
    )
}

const useStyles = makeStyles(() => ({
    root: {
        width: 200,
        backgroundColor: 'transparent !important',
        border: 'none',
        height: '45px !important',
    },
}));

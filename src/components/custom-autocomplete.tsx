import React from 'react';
import { makeStyles, InputAdornment, Typography, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function CustomAutocomplete(props: {
    options?: any[],
    value?: any,
    onChange?: (event: object, value: any | any[], reason: string) => void,
    helperText?: string
}) {
    const classes = useStyles();
    return (
        <Autocomplete
            options={props?.options}
            getOptionLabel={(option) => option}
            className={classes.root}
            value={props?.value}
            onChange={props?.onChange}
            renderInput={(params) => {
                return (
                    <TextField
                        {...params}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: <InputAdornment position="start">
                                <Typography variant="h6" component="p" className="turncate" style={{ maxWidth: '100%' }}>
                                    {props?.helperText}:
                                </Typography>
                            </InputAdornment>,
                        }}
                    />
                )
            }}
        />
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: 300,
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            marginLeft: 0,
            marginBottom: 0
        },
        '& .MuiAutocomplete-inputRoot': {
            width: '100%',
            background: theme.palette.secondary.main,
            border: '1.5px solid #F2F2FE',
            padding: `0 ${theme.spacing(1)}px`,
            fontWeight: 500,
            '& p': {
                color: '#696974',
            },
        },
    },
}));

import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import 'react-phone-input-2/lib/style.css';

export default function CustomPagination(props?: {
    count: number;
    page: number;
    onChange?: (event: React.ChangeEvent<unknown>, page: number) => void;
}) {
    const classes = useStyles();
    return (
        <Pagination
            count={props?.count}
            page={props?.page ?? 1}
            shape="rounded"
            onChange={props?.onChange}
            // size={size.width > 800 ? 'medium' : 'small'}
            siblingCount={0}
            className={classes.root}
        />
    );
}


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        '& .MuiPaginationItem-page.Mui-selected': {
            background: 'unset',
            color: theme.palette.primary.main,
            fontWeight: 'bold'
        },
        '& button[aria-label="Go to previous page"]': {
            border: '1px solid #E2E2EA',
            borderRadius: theme.spacing(1),
            boxSizing: 'border-box'
        },
        '& button[aria-label="Go to next page"]': {
            border: '1px solid #E2E2EA',
            borderRadius: theme.spacing(1),
            boxSizing: 'border-box'
        },
        '& .MuiPaginationItem-root': {
            color: '#92929D'
        }
    },
}));

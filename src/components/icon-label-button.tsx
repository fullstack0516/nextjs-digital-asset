import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

export default function IconLabelButton({
    label,
    active,
    startIcon,
    ...buttonProps
}: ButtonProps & {
    label: string | number,
    active?: boolean,
    startIcon?: React.ReactNode
}) {
    const classes = useStyles();

    return (
        <Button
            {...buttonProps}
            variant="contained"
            className={classes.button}
            color={active ? "primary" : "secondary"}
            startIcon={startIcon}
            style={{ border: !active && '1px solid #E3E7F0' }}
        >
            {label}
        </Button>
    );
}

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(0.5),
        minWidth: 80
    },
}));

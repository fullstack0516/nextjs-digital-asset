import React, { useState } from 'react';
import { makeStyles, ClickAwayListener, Popper } from '@material-ui/core';

export default function CustomPopper(props: {
    anchorEl: null | HTMLElement,
    children: any,
    onClose: () => void
}) {
    const classes = useStyles();
    const [arrowRef, setArrowRef] = useState(null);

    const open = Boolean(props?.anchorEl);

    return (
        <Popper
            open={open}
            anchorEl={props?.anchorEl}
            placement="bottom-end"
            disablePortal={true}
            modifiers={{
                flip: {
                    enabled: true,
                },
                preventOverflow: {
                    enabled: true,
                    boundariesElement: 'scrollParent',
                },
                arrow: {
                    enabled: true,
                    element: arrowRef,
                },
            }}
            className={classes.popper}

        >
            <ClickAwayListener onClickAway={props?.onClose}>
                <div>
                    <span className={classes.arrow} ref={setArrowRef} />
                    {props?.children}
                </div>
            </ClickAwayListener>
        </Popper>
    );
}

const useStyles = makeStyles((theme) => ({
    popper: {
        background: '#44444F',
        boxShadow: '0px 5px 15px rgba(68, 68, 79, 0.1)',
        borderRadius: 7,
        padding: `${theme.spacing(0.8)}px ${theme.spacing(1.5)}px`,
        zIndex: 99999,
        marginTop: 5,
        '&[x-placement*="bottom-end"] $arrow': {
            top: 0,
            right: 0,
            marginTop: '-0.53em',
            marginRight: 0,
            '&::before': {
                transformOrigin: '0 75%',
            },
        },
    },
    arrow: {
        overflow: 'hidden',
        position: 'absolute',
        width: '0.75em',
        height: '0.75em',
        boxSizing: 'border-box',
        '&::before': {
            content: '""',
            margin: 'auto',
            display: 'block',
            width: '100%',
            height: '100%',
            boxShadow: theme.shadows[1],
            backgroundColor: '#44444F',
            transform: 'rotate(45deg)',
        },
    },
}))

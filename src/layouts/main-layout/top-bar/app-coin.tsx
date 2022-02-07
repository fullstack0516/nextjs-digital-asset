import React, { useContext, useRef, useState } from 'react';
import {
    Grid,
    ButtonBase,
    Hidden,
    makeStyles,
    Typography,
    Box
} from '@material-ui/core';
import SvgAppCoin from '../../../../public/app-coin.svg';
import SvgAppCoinLight from '../../../../public/app-coin-light.svg';
import { UserContext } from '../../../utils/client/user-state';

export default function AppCoin(props: {
    darkMode?: boolean,
}) {
    const classes = useStyles();
    const ref = useRef<any>(null);
    const { darkMode } = props;
    const [isOpen, setOpen] = useState<boolean>(false);
    const userCtx = useContext(UserContext)
    const coin = userCtx.userState.coin

    return (
        <Grid component={ButtonBase} ref={ref}>
            <Box display="flex" alignItems="center" onClick={() => setOpen((prev) => !prev)} >
                {
                    darkMode
                        ? <SvgAppCoinLight width={32} height={32} />
                        : <SvgAppCoin width={32} height={32} />
                }
                <Hidden xsDown>
                    <Typography variant="h6" color="textSecondary" style={{ color: darkMode && 'white', marginLeft: 8 }}>{coin}</Typography>
                    <div className={classes.arrowBtn} style={{ transform: isOpen && 'rotate(180deg)' }} />
                </Hidden>
            </Box>
        </Grid>
    );
}


const useStyles = makeStyles((theme) => ({
    arrowBtn: {
        marginLeft: theme.spacing(3),
        width: 0,
        height: 0,
        borderLeft: '5.35px solid transparent',
        borderRight: '5.35px solid transparent',
        borderTop: '6.67px solid #92929D',
    },
}));

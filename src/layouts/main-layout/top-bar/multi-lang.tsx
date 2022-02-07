import React, { useRef, useState } from 'react';
import { Grid, ButtonBase, Hidden, makeStyles, Typography, Box } from '@material-ui/core';
import OptionsMenu from '../../../components/options-menu';
import SvgNorsk from '../../../../public/norsk.svg';
import { getLanguage } from '../../../langauge/language';

export type MenuOptions = 'xxx'

export default function MultiLang(props: {
    darkMode?: boolean,
    requiredOptions?: MenuOptions[]
}) {
    const classes = useStyles();
    const ref = useRef<any>(null);
    const { darkMode, requiredOptions } = props;
    const [isOpen, setOpen] = useState<boolean>(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleMove = (url?: string) => () => {
        if (url) {
            window.location.href = url;
        }
    }

    const defaultMenuOptions = [
        { id: 'xxx' as MenuOptions, icon: <></>, text: '', onClick: handleMove() },
    ]

    let menuOptions = requiredOptions ? requiredOptions.map(e => defaultMenuOptions.find(option => option.id === e)) : defaultMenuOptions;
    menuOptions = menuOptions.filter(e => e)

    return (
        <Box mr={2}>
            <Grid component={ButtonBase} ref={ref}>
                <Box display="flex" alignItems="center" onClick={() => setOpen(() => true)} >
                    <SvgNorsk width={22} height={16} />
                    <Hidden xsDown>
                        <Typography variant="h6" color="textSecondary" style={{ color: darkMode && 'white', marginLeft: 8 }}>{getLanguage().nr}</Typography>
                        <div className={classes.arrowBtn} style={{ transform: isOpen && 'rotate(180deg)' }} />
                    </Hidden>
                </Box>
            </Grid>
            <OptionsMenu
                open={isOpen}
                onClose={handleClose}
                anchorEl={ref.current}
                options={menuOptions}
                disableBottomMenus
            />
        </Box>
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

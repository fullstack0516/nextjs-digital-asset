import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import TopBar from './top-bar';
import BottomBar from './bottom-bar';

export default function MainLayout(props: {
    children: any,
    footer?: boolean
}) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TopBar />
            <div id='scroller-main' className={clsx(classes.wrapper, 'scrollable')} style={{ marginBottom: props?.footer && 70 }}>
                {props?.children}
            </div>
            {props?.footer && <BottomBar />}
        </div >
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        width: '100%'
    },
    wrapper: {
        display: 'flex',
        flex: '1 1 auto',
        marginTop: 70,
        padding: '0px 18px',
        background: '#FAFAFB',
        justifyContent: 'center',
    },
}));

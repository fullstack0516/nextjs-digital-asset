import { makeStyles, Box, } from '@material-ui/core';
import Logo from '../../../components/logo';
import { getLanguage } from '../../../langauge/language';
import { useWindowSize } from '../../../utils/client/use-window-size';

export default function TopBar() {
    const classes = useStyles();
    const size = useWindowSize();

    return (
        <Box display="flex" alignItems="center" position="fixed" bottom={0} width="100%" height={70} className={classes.root}>
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" p={0} pr={3} pl={3}>
                {size.width > 599 && <Logo />}
                <div className={classes.links}>
                    <a target="" href="/privacy-policy">
                        {getLanguage().privacyPolicy}
                    </a>
                    <a target="" href="/terms-and-conditions">
                        {getLanguage().termsAndConditions}
                    </a>
                </div>
            </Box>
        </Box>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.secondary.main,
        boxShadow: 'inset 0px 1px 0px #F6F6F9',
    },
    links: {
        '& a': {
            marginRight: 48,
            [theme.breakpoints.down('xs')]: {
                marginRight: 0,
            },
            textDecoration: 'none',
            cursor: 'pointer',
            letterSpacing: '0.5px',
            lineHeight: '26px',
            color: ' #181a1b'
        },
        [theme.breakpoints.down('xs')]: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
        }
    }
}));

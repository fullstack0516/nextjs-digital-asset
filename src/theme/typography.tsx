
import { createTheme } from '@material-ui/core/styles';
const theme = createTheme();

export default {
    h1: {
        fontWeight: 500,
        fontSize: 35,
        [theme.breakpoints.down('xs')]: {
            fontSize: 28,
        },
    },
    h2: {
        fontWeight: 500,
        fontSize: 29,
        lineHeight: '32px',
        [theme.breakpoints.down('xs')]: {
            fontSize: 24,
        },
    },
    h3: {
        fontWeight: 400,
        fontSize: 24,
        lineHeight: '32px',
        [theme.breakpoints.down('xs')]: {
            fontSize: 20,
        },
    },
    h4: {
        fontWeight: 400,
        fontSize: 20,
        lineHeight: '26px',
        [theme.breakpoints.down('xs')]: {
            fontSize: 16,
        },
    },
    h5: {
        fontWeight: 400,
        fontSize: 16,
        lineHeight: '18px',
        [theme.breakpoints.down('xs')]: {
            fontSize: 14,
        },
    },
    h6: {
        fontSize: 14,
        fontWeight: 400,
        [theme.breakpoints.down('xs')]: {
            fontSize: 12,
        },
    },
};

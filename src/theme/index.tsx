/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import { createTheme as createThemeF } from '@material-ui/core/styles';
import typography from './typography';
import overrides from './overrides';

const THEMES = {
    light: 'light',
    dark: 'dark',
};

const baseConfig = {
    palette: {
        primary: {
            main: '#FF7534',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#FFFFFF',
            contrastText: '#546E7A'
        },
        background: {
            default: '#FAFAFB',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#37474F',
            secondary: '#546E7A',
        },
        warning: {
            main: '#FF0000',
        },
        error: {
            main: "#FF0000",
        },
        info: {
            main: "#F6F6FE",
        },
        common: {
            black: '#F1F1F5'
        }
    },
    typography,
    overrides
};

const themeConfigs = [
    {
        name: THEMES.light,
        palette: {
            primary: {
                main: '#FF7534',
                contrastText: '#FFFFFF',
            },
            secondary: {
                main: '#FFFFFF',
                contrastText: '#546E7A'
            },
            background: {
                default: '#FFFFFF',
                paper: '#FFFFFF',
                dark: 'FFFFFF',
            },
            text: {
                primary: '#37474F',
                secondary: '#546E7A',
            },
            warning: {
                main: '#FF0000',
            },
            error: {
                main: "#FF0000",
            },
            info: {
                main: "#F6F6FE",
            },
            common: {
                black: '#F1F1F5'
            }
        },
    },
    {
        name: THEMES.dark,
        palette: {
            type: 'dark',
            action: {
                active: 'rgba(255, 255, 255, 0.54)',
                hover: 'rgba(255, 255, 255, 0.04)',
                selected: 'rgba(255, 255, 255, 0.08)',
                disabled: 'rgba(255, 255, 255, 0.26)',
                disabledBackground: 'rgba(255, 255, 255, 0.12)',
                focus: 'rgba(255, 255, 255, 0.12)'
            },
            background: {
                default: '#181820',
                paper: '#181820',
                dark: '#181820',
            },
            primary: {
                main: '#8a85ff'
            },
            secondary: {
                main: '#8a85ff'
            },
            text: {
                primary: '#e6e5e8',
                secondary: '#adb0bb'
            }
        },
    },
];

export function createTheme(colorTheme?: string) {
    let themeConfig = themeConfigs.find((theme) => theme.name === colorTheme) ?? {};

    let theme = createThemeF(
        _.merge(
            {},
            baseConfig,
            themeConfig
        )
    );

    return theme;
}

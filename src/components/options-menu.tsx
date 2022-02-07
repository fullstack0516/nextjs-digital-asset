import React from 'react';
import { Menu, MenuItem, makeStyles, Typography, } from '@material-ui/core';
import { getLanguage } from '../langauge/language';
import CustomDivider from './custom-divider';
interface MenuOption {
    onClick?: () => void,
    icon?: any,
    text?: string
}

export default function OptionsMenu(props: {
    anchorEl: any,
    open?: boolean,
    onClose?: () => void,
    options?: MenuOption[],
    disableBottomMenus?: boolean
}) {
    const classes = useStyles();
    const { anchorEl, open, options, onClose, disableBottomMenus } = props

    return (
        <Menu
            open={open}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            keepMounted
            PaperProps={{ className: classes.popover }}
            getContentAnchorEl={null}
            anchorEl={anchorEl}
        >
            {
                options.length ? options.map((option, index) => {
                    return (
                        <MenuItem onClick={option?.onClick} key={index}>
                            {option?.icon && option.icon}
                            <Typography variant="h6">{option.text}</Typography>
                        </MenuItem>
                    )
                }) : ''
            }
            {
                !disableBottomMenus &&
                <div>
                    {options.length ? <CustomDivider /> : ''}
                    <MenuItem onClick={() => window.location.href = '/terms-and-conditions'}>
                        <Typography variant="h6" style={{ marginLeft: 0 }}>{getLanguage().termsAndConditions}</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => window.location.href = '/privacy-policy'}>
                        <Typography variant="h6" style={{ marginLeft: 0 }}>{getLanguage().privacyPolicy}</Typography>
                    </MenuItem>
                </div>
            }
        </Menu>
    );
}

const useStyles = makeStyles((theme) => ({
    popover: {
        minWidth: 160 - 16,
        padding: `${theme.spacing(1)}px 0`,
        background: theme.palette.background.paper,
        border: '1px solid #F1F1F5',
        boxShadow: '0px 5px 15px rgba(68, 68, 79, 0.1)',
        borderRadius: theme.spacing(1),
        marginTop: theme.spacing(1),
        color: '#696974',
        '& ul': {
            padding: 0,
            '& li': {
                padding: '0px 10px',
                minHeight: 36,
                '& h6': {
                    marginLeft: theme.spacing(1.5),
                    fontWeight: 'normal'
                },
                '&:hover': {
                    borderRadius: theme.shape.borderRadius,
                }
            },
            '& li + li': {
                marginTop: theme.spacing(0.8),
            },
        },
        '& hr': {
            margin: '10px 0'
        }
    },
}));

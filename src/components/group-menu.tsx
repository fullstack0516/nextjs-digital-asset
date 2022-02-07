import React from 'react';
import { Menu, MenuItem, makeStyles, Typography, } from '@material-ui/core';

interface MenuOption {
    onClick: () => void,
    icon?: any,
    text: string
}

interface GroupMenuOption {
    title: string
    options: MenuOption[]
}

export default function GroupMenu(props: {
    anchorEl: any,
    open?: boolean,
    onClose?: () => void,
    groups?: GroupMenuOption[],
}) {
    const classes = useStyles();
    const { anchorEl, open, groups, onClose } = props

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
                groups?.length ? groups.map(({ title, options }) => {
                    return (
                        <div key={title}>
                            <div className="title">{title}</div>
                            {
                                options.map((option) =>
                                    <MenuItem onClick={option?.onClick} key={option.text}>
                                        {option?.icon && option.icon}
                                        <Typography variant="h6">{option.text}</Typography>
                                    </MenuItem>
                                )
                            }
                        </div>
                    )

                }) : ''
            }
        </Menu>
    );
}


const useStyles = makeStyles((theme) => ({
    popover: {
        minWidth: 160 - 16,
        padding: theme.spacing(1.5),
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
            '& li:last-child': {
                marginBottom: theme.spacing(1.5)
            }
        },
        '& .title': {
            color: theme.palette.primary.main,
            marginBottom: theme.spacing(1)
        },
    },
}));

import React, { useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Collapse, ListItem, makeStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

export default function NavItem(props: {
    title: string,
    href?: string,
    depth?: number,
    children?: any,
    icon?: any,
    open?: boolean,
}) {
    const classes = useStyles();
    const [open, setOpen] = useState(props?.open);
    const router = useRouter();
    const { title, href, depth, icon: Icon, children } = props;

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    // let paddingLeft = 8;

    // if (depth > 0) {
    //     paddingLeft = 32 + 8 * depth;
    // }

    // const style = { paddingLeft };

    if (children) {
        return (
            <ListItem className={classes.item} disableGutters key={title}>
                <Button
                    className={classes.button}
                    onClick={handleToggle}
                // style={style}
                >
                    {Icon && (
                        <Icon className={classes.icon} size="20" />
                    )}
                    <span className={classes.title}>
                        {title}
                    </span>
                    {open ? (
                        // @ts-ignore
                        <ExpandLessIcon size="small" color="inherit" />
                    ) : (
                        // @ts-ignore
                        <ExpandMoreIcon size="small" color="inherit" />
                    )}
                </Button>
                <Collapse in={open}>
                    {children}
                </Collapse>
            </ListItem>
        );
    }

    return (
        <ListItem className={classes.itemLeaf} disableGutters key={title}>
            <Link href={href ?? ''}>
                <a
                    className={clsx(classes.buttonLeaf, `depth-${depth}`, router.pathname === href ? 'active' : '')}
                // style={style}
                >
                    {Icon && (
                        <Icon className={classes.icon} size="20" />
                    )}
                    <span className={classes.title}>
                        {title}
                    </span>
                </a>
            </Link>
        </ListItem>
    );
}

const useStyles = makeStyles((theme) => ({
    item: {
        display: 'block',
        paddingTop: 0,
        paddingBottom: 0
    },
    itemLeaf: {
        display: 'flex',
        paddingTop: 0,
        paddingBottom: 0,
        position: 'relative',
        marginBottom: theme.spacing(3),
        '& .active': {
            color: theme.palette.primary.main,
            '& $title': {
                fontWeight: theme.typography.fontWeightMedium
            },
            '& $icon': {
                color: theme.palette.primary.main
            },
            '&:after': {
                content: '" "',
                position: 'absolute',
                top: 0,
                left: 0,
                width: 8,
                height: '100%',
                background: theme.palette.primary.main,
                borderRadius: 4,
                marginLeft: -4
            }
        }
    },
    button: {
        color: theme.palette.text.secondary,
        padding: '10px 8px',
        justifyContent: 'flex-start',
        textTransform: 'none',
        letterSpacing: 0,
        width: '100%'
    },
    buttonLeaf: {
        color: theme.palette.text.secondary,
        padding: theme.spacing(0.6),
        paddingLeft: theme.spacing(2.5),
        justifyContent: 'flex-start',
        textTransform: 'none',
        letterSpacing: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        '&.depth-0': {
            '& $title': {
                fontWeight: theme.typography.fontWeightMedium
            }
        }
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        marginRight: theme.spacing(3.5)
    },
    title: {
        marginRight: 'auto'
    },
}));

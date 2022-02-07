import React, { useContext, useState } from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { PageContext } from '../utils/client/page-state';

export default function Tag(props: {
    name: string,
    darkMode?: boolean,
    highlighted?: boolean,
    deletable?: boolean,
    onDelete?: () => void
}) {
    const { name, darkMode, highlighted, deletable, onDelete } = props
    const classes = useStyles();
    const [hovered, setHovered] = useState<boolean>(false);
    const pageCtx = useContext(PageContext);
    const page = pageCtx.pageState.page;

    return (
        <Box
            display="flex"
            alignItems="center"
            position="relative"
            className={classes.root}
            style={{
                background: (hovered || highlighted) ? (darkMode ? page?.pageColor : '#546e7a26') : 'transparent',
                border: `1px solid ${darkMode ? '#2F2F3A' : '#E2E2EA'}`,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Typography variant="h6" color="textSecondary" style={{ color: (hovered || highlighted) && darkMode && '#FFFFFF', fontSize: 12 }}>
                {name ?? ''}
            </Typography>
            {/* score */}
            {/* <Typography variant="h6" color="textSecondary" style={{ marginLeft: 12, color: hovered && darkMode && '#FFFFFF' }}>{tag?.count}</Typography> */}
            {
                deletable && hovered &&
                <Typography variant="h6" color="textSecondary" className='cross' onClick={onDelete}>
                    &#x274C;
                </Typography>
            }
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: theme.spacing(2),
        padding: `${theme.spacing(0.5)}px ${theme.spacing(1.5)}px`,
        cursor: 'pointer',
        margin: theme.spacing(0.5),
        '& .cross': {
            fontSize: 11,
            fontWeight: 'bold',
            marginLeft: 8,
            opacity: 0.5,
            '&:hover': {
                opacity: 1
            }
        }
    },
}));

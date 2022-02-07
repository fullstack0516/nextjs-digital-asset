import React, { useState } from 'react';
import { Box, makeStyles, Typography, Checkbox } from '@material-ui/core';
import Demographic, { FamilyHealth, MyProperty, ConsumerActivity } from './icons';

export default function ShareItem(props: {
    caption: string,
    dataValue: number,
    iconWidth?: string,
    iconHeight?: string,
    iconName?: string,
    guessValue?:number,
    onChecked: (val: number) => void
}) {
    const classes = useStyles();
    const [hovered, setHovered] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);

    const onSelect = () => {
        if (checked) {
            switch (props.iconName) {
                case 'Demographic':
                    props.onChecked(props.dataValue-141);
                    break;
                case 'FamilyHealth':
                    props.onChecked(props.dataValue-271);
                    break;
                case 'MyProperty':
                    props.onChecked(props.dataValue-513);
                    break;
                case 'ConsumerActivity':
                    props.onChecked(props.dataValue-854);
                    break;
            }
        } else {
            switch (props.iconName) {
                case 'Demographic':
                    props.onChecked(props.dataValue+141);
                    break;
                case 'FamilyHealth':
                    props.onChecked(props.dataValue+271);
                    break;
                case 'MyProperty':
                    props.onChecked(props.dataValue+513);
                    break;
                case 'ConsumerActivity':
                    props.onChecked(props.dataValue+854);
                    break;
            }
        }
    }

    let icon, guessValue;
    switch (props.iconName) {
        case 'Demographic':
            icon = <Demographic checked={checked} />;
            guessValue = <span style={{ padding: '3px 0px 5px 0px' }}>$141</span>;
            break;
        case 'FamilyHealth':
            icon = <FamilyHealth checked={checked} />;
            guessValue = <span style={{padding:'10px 0px 5px 0px'}}>$271</span>;
            break;
        case 'MyProperty':
            icon = <MyProperty checked={checked} />
            guessValue = <span style={{padding:'10px 0px 5px 0px'}}>$513</span>;
            break;
        case 'ConsumerActivity':
            icon = <ConsumerActivity checked={checked} />
            guessValue = <span style={{padding:'10px 0px 5px 0px'}}>$854</span>;
            break;
    }

    return (
        <Box
            className={classes.root}
            style={{
                background: checked ? '#FE7435' : hovered ? '#546e7a26' : 'transparent',
                border: `1px solid #E2E2EA`,
                color: checked ? '#FFFFFF' : '#546E7A',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {icon}
            {guessValue}
            <Typography style={{ color: checked ? '#FFFFFF' : '#57586E' }} color="textSecondary" className={classes.shareData}>{checked ? 'Data Shared' : 'Share data'}</Typography>
            <Typography style={{ color: checked ? '#FFFFFF' : '#0A083B' }} className={classes.shareCaption}>{props?.caption ?? ''}</Typography>
            <Box display="flex" alignItems="center" justifyContent="center" style={{ marginBottom:'8px' }}>
                <Checkbox
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    onClick={() => onSelect()}
                    color={checked ? "secondary" : "default"}
                    disableRipple
                />
                <Typography style={{color: checked ? '#FFFFFF' : '#57586E', padding:'13px 0px'}}>{checked ? 'Selected' : 'Select'}</Typography>
            </Box>
        </Box>   
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '245px',
        height: '250px',
        maxWidth: '245px',
        borderRadius: theme.spacing(2),
        padding: `${theme.spacing(0.5)}px ${theme.spacing(1.5)}px`,
        cursor: 'pointer',
        margin: theme.spacing(0.5),
        font: 'Roboto',
        justifyContent: 'end',
        alignItems: 'center',
        fontSize: '14px',
        [theme.breakpoints.down('xs')]: {
            margin: 'auto',
            marginBottom: '16px',
        },
    },
    itemName: {
        fontSize: '18px',
        color: '#0A083B'
    },
    shareCaption: {
        fontSize: '18px',
        padding: '8px 0px'
    },
    shareData: {
        padding: '3px 0px'
    }
}));

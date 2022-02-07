import React, { useState } from 'react';
import { Box, makeStyles, Button, Typography } from "@material-ui/core";
import loadable from '@loadable/component';
import CustomHeader from '../../../components/custom-header';
import ShareItem from './share-item';
import ShareSlider from './share-slider';

const MenuBar = loadable(() => import('../menu-bar'));

export default function MyDataWorth() {
    const classes = useStyles();
    const [dataValue, setDataValue] = useState<number>(0);
    const [shareLevel, setShareLevel] = useState<number>(0);

    return (
        <>
            <CustomHeader title="Awake - Dashboard - MyDataWorth" />
            <Box className={classes.root}>
                <p className={classes.title}>How much do companies make from your data?</p>
                <Typography color="textSecondary" className={classes.smallTitle}>Use our calculator to check how much multibillion-dollar data broker industry might pay for your personal data.</Typography>
                <ShareSlider dataValue={dataValue} onSetLevel={setShareLevel} />
                <Box className={classes.shareItemContainer}>
                    <ShareItem caption="Demographic" iconName='Demographic' dataValue={dataValue} onChecked={setDataValue} />
                    <ShareItem caption="Family & Health" iconName="FamilyHealth" dataValue={dataValue} onChecked={setDataValue} />
                    <ShareItem caption="Property" iconName="MyProperty" dataValue={dataValue} onChecked={setDataValue} />
                    <ShareItem caption="Cousumer & Activity" iconName="ConsumerActivity" dataValue={dataValue} onChecked={setDataValue} />
                </Box>
                <Typography color="textSecondary" className={classes.valueCaption}>Current value of my data</Typography>
                <p className={classes.valueText}>${(dataValue*(1+shareLevel*0.1)).toFixed(2)}</p>
                <Typography className={classes.valueDescription}>*data based on a typical Meta user.</Typography>
                <Button variant="contained" className={classes.shareDataButton} color="primary" disableRipple disabled={dataValue ? false : true}>Share data</Button>
            </Box>
        </>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        font: 'Roboto',
        textAlign: 'center',
        background: `url('../../data-calculator.jpg')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 100%',
        backgroundSize: '100% auto',
        backgroundColor: '#FFFFFF',
        height: '1150px',
        [theme.breakpoints.down('xs')]: {
            background: 'none',
        },
    },
    title: {
        fontSize: '44px',
        marginTop: '133px',
        padding: '6px 0px',
        [theme.breakpoints.down('xs')]: {
            fontSize: '22px',
            marginTop: '67px',
        },
    },
    shareItemContainer: {
        display: 'flex',
        maxWidth: '1170px',
        justifyContent: 'space-evenly',
        margin: 'auto',
        [theme.breakpoints.down('xs')]: {
            display: 'block',
        },
    },
    smallTitle: {
        fontSize: '20px',
        margin: 'auto',
        maxWidth: '700px',
        height: '80px',
        lineHeight: '2',
        [theme.breakpoints.down('xs')]: {
            fontSize: '16px',
            lineHeight: '1.5',
        },
    },
    valueCaption: {
        marginTop: '50px',
        padding: '4px 0px',
        fontSize: '20px',
    },
    valueText: {
        fontSize: '50px',
        color: '#0A083B',
        padding: '3px 0px',
        marginTop: '8px',
        marginBottom: '12px'
    },
    valueDescription: {
        color: 'gray',
        marginBottom: '32px'
    },
    shareDataButton: {
        maxWidth: '210px',
        width: '210px',
        height: '62px',
        borderRadius: '30px',
        font: 'Roboto',
        fontSize: '17px',
        fontStyle: 'bold',
        marginBottom: '92px'
    }
}));

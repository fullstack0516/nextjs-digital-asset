import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { useWindowSize } from '../../../utils/client/use-window-size';
import { User } from '../../../models/user';
import CustomHeader from '../../../components/custom-header';
import ComingSoon from '../../../components/coming-soon';

export default function Settings(props: {
    customerMap: { [customerId: string]: User }
}) {
    const size = useWindowSize();
    const classes = useStyles();

    return (
        <Box padding={size.width > 599 ? "36px 40px" : "36px 24px"}>
            <CustomHeader title="Awake - Admin - Settings" />
            <ComingSoon />
        </Box>
    );
}

const useStyles = makeStyles((theme) => ({
}))

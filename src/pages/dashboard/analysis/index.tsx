import React, { useState } from 'react';
import { Box, makeStyles } from "@material-ui/core";
import MenuBar from "../menu-bar";
import ComingSoon from '../../../components/coming-soon';
import CustomHeader from '../../../components/custom-header';
import { fetchDataPointsCountSF, server } from '../../../utils/server/graphql_server';

export default function Analysis(props: {
    numOfDataPoints: number
}) {
    const classes = useStyles();
    const [sortBy, setSortBy] = useState<number>(0);

    return (
        <>
            <CustomHeader title="Awake - Dashboard - Analysis" />
            <MenuBar onChangeSort={(newValue) => setSortBy(() => newValue)} numOfDataPoints={props?.numOfDataPoints} />
            <Box className={classes.root}>
                {/* coming soon page */}
                <ComingSoon />
            </Box>
        </>

    )
}

export const getServerSideProps = async (context) => {
    const { req, res } = context;
    await server({ req, res });
    const numOfDataPoints = await fetchDataPointsCountSF()

    return {
        props: {
            numOfDataPoints
        },
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1170,
        width: '100%',
        marginTop: theme.spacing(32),
        [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing(15),
        },
    },
}));

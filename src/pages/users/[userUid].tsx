import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    makeStyles,
    Avatar,
} from '@material-ui/core';
import { getLanguage } from '../../langauge/language';
import { useWindowSize } from '../../utils/client/use-window-size'
import StyledTabs from '../../components/styled-tabs';
import StyledTab from '../../components/styled-tab';
import CustomDivider from '../../components/custom-divider';
import CustomInput from '../../components/custom-input';
import SvgPlus from '../../../public/plus.svg';
import CustomHeader from '../../components/custom-header';
import { fetchUserLightSF, server } from '../../utils/server/graphql_server';
import { UserLight } from '../../models/user-light';

export default function Profile(props: {
    user: UserLight
}) {
    const classes = useStyles();
    const size = useWindowSize();
    const [tabIndex, setTabIndex] = useState<number | false>(0);
    const { username, profileMedia } = props.user ?? {};

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <div className={classes.root}>
            <CustomHeader title="Awake - Profile" />
            <Card >
                <Box display="flex" alignItems="center" justifyContent="space-between" className={classes.profileHeader}>
                    <StyledTabs value={tabIndex} onChange={handleTabChange} indicatorwidth={size.width < 599 ? '100%' : 150}>
                        <StyledTab label={getLanguage().profile} />
                    </StyledTabs>
                </Box>
                <CustomDivider />
                <CardContent className={classes.profileContent}>
                    {
                        tabIndex === 0 &&
                        <>
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                mb={4}
                                className={classes.upload}
                            >
                                {
                                    profileMedia?.url ?
                                        <Avatar src={profileMedia.url} alt="User" />
                                        :
                                        <Box display="flex" p={4} mb={1}>
                                            <SvgPlus width={18} height={18} fill="white" />
                                        </Box>
                                }
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item container xs={12} md={6}>
                                    <Grid item xs={12}>
                                        <CustomInput
                                            label={`${getLanguage().username}`}
                                            name="username"
                                            value={username ?? ''}
                                            maxLength={17}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CustomInput
                                            label={`${getLanguage().email}`}
                                            name="email"
                                            value={""}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CustomInput
                                            label={`${getLanguage().sms}`}
                                            name="phoneNumber"
                                            value={""}
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container xs={12} md={6}>
                                    <Grid item xs={12}>
                                        <CustomInput
                                            label={`${getLanguage().bio}`}
                                            name="bio"
                                            value={""}
                                            multiline={true}
                                            rows={11}
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    }
                    {
                        tabIndex === 1 && ''
                    }
                </CardContent>
            </Card>
        </div>
    );
}

export const getServerSideProps = async (context) => {
    const { req, res, query } = context;
    await server({ req, res })

    const user = await fetchUserLightSF({ userLightUid: query.userUid })

    return {
        props: {
            user
        },
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 770,
        width: '100%',
        marginTop: theme.spacing(6),
        [theme.breakpoints.down('xs')]: {
            marginTop: 0,
        },
    },
    profileHeader: { height: 70 },
    profileContent: {
        padding: theme.spacing(2),
        [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(4)
        },
    },
    upload: {
        cursor: 'pointer',
        '& .MuiAvatar-root': {
            width: 86,
            height: 86
        },
        '& > div': {
            borderRadius: '50%',
            background: theme.palette.info.main,
            border: '2px solid #F2F2FE',
        },
        '& > a': {
            lineHeight: '32px',
            textDecorationLine: 'underline',
        },
        '& > span': {
            lineHeight: '26px',
        }
    },
}));

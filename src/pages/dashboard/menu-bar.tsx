import React, { useContext, useState, useEffect } from 'react';
import {
    Box,
    makeStyles,
    Typography,
    Select,
    MenuItem,
    Hidden,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { useRouter } from "next/router";
import { getLanguage } from '../../langauge/language';
import { useWindowSize } from '../../utils/client/use-window-size'
import { UserContext } from '../../utils/client/user-state';
import StyledTabs from '../../components/styled-tabs';
import StyledTab from '../../components/styled-tab';

export default function MenuBar(props: {
    onChangeSort?: (newValue: number) => void,
    sortOptions?: { [sortValue: number]: string },
    sortValue?: number,
    numOfDataPoints?: number
}) {
    const classes = useStyles();
    const router = useRouter();
    const size = useWindowSize();
    const [tablndicatorIndex, setTabIndicatorIndex] = useState<number | false>(false);
    const [expanded, setExpanded] = useState<boolean>(false);
    const userCtx = useContext(UserContext);
    const user = userCtx.userState.user;

    useEffect(() => {
        switch (router.pathname) {
            case '/dashboard/my-data':
                setTabIndicatorIndex(0)
                break;
            case '/dashboard/analysis':
                setTabIndicatorIndex(1)
                break;
            default:
                setTabIndicatorIndex(false)
                break;
        };
    }, [router.pathname])

    const handleTabChange = async (event, newValue) => {
        setTabIndicatorIndex(newValue);
        switch (newValue) {
            case 0:
                router.push('/dashboard/my-data')
                break;
            case 1:
                router.push('/dashboard/analysis')
            default:
                break;
        };
    };

    const Title = () => {
        return (
            <Box className={classes.title}>
                <Typography variant="h2" color="textPrimary">{`${getLanguage().appName} ${getLanguage().data}`}</Typography>
                <Typography variant="h5" component="p">
                    {getLanguage().hey}&nbsp;
                    <b>{user?.username ?? getLanguage().there}</b>,
                    you have&nbsp;
                    <b>{`${props?.numOfDataPoints?.toLocaleString()} ${getLanguage().dataPoints} `}</b>
                    on {getLanguage().appName}
                </Typography>
                <DataWorthLink />
            </Box>
        )
    }

    const DataWorthLink = () => {
        return (
            <Box display="flex" alignItems="center" mt={3}>
                <Typography variant="h5" color="textSecondary" style={{ color: '#92929D' }}>
                    What is your data&nbsp;
                    <Typography
                        variant="h5"
                        color="primary"
                        component="a"
                        style={{
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                        onClick={() => window.open('/dashboard/my-data-worth', '_blank').focus()}
                    >
                        worth
                    </Typography>
                    ?
                </Typography>
            </Box>
        )
    }

    const Tabs = () => {
        return (
            <Box display="flex" height={78} className={classes.tabs}>
                <StyledTabs value={tablndicatorIndex} onChange={handleTabChange} indicatorwidth='100%'>
                    <StyledTab label={getLanguage().myData} />
                    <StyledTab label={getLanguage().analysis} />
                </StyledTabs>
            </Box>
        )
    }

    const SortByDropDown = () => {
        return (
            <Select
                renderValue={(value: string) => (
                    <Box display="flex" alignItems="center" width="100%">
                        <Typography variant="h6" component="p" className="turncate" style={{ maxWidth: '100%' }}>
                            {getLanguage().sortBy}:&nbsp;&nbsp;<b style={{ textTransform: 'capitalize' }}>{props?.sortOptions?.[value]}</b>
                        </Typography>
                    </Box>
                )}
                name="sortBy"
                value={props?.sortValue ?? ''}
                onChange={(e) => props?.onChangeSort(parseInt(e.target.value as string))}
                className={classes.select}
                displayEmpty
            >
                {
                    props?.sortOptions
                        ? Object.keys(props.sortOptions).map(value => <MenuItem value={value} key={value}>{props.sortOptions[value]}</MenuItem>)
                        : ''
                }
            </Select>
        )
    }

    return (
        <Box
            className={classes.root}
            position="fixed"
            display="flex"
            justifyContent="center"
            pt={size.width > 599 ? 4 : 0}
            width="calc(100% - 5px)"
        >
            <Hidden smUp>
                <Accordion
                    square
                    expanded={expanded}
                    onChange={() => setExpanded((prev) => !prev)}
                    className={classes.collapse}
                    TransitionProps={{
                        timeout: 600,
                        unmountOnExit: true
                    }}
                >
                    <AccordionSummary className="summary" expandIcon={<ExpandMoreIcon />} style={{ background: expanded ? '#F6F6FE' : 'white' }}>
                        {
                            expanded ?
                                <Box display="flex" alignItems="center">
                                    <HighlightOffIcon style={{ width: 20 }} />
                                    <Typography variant="h5" color="textPrimary" style={{ fontWeight: 500, lineHeight: '19px', marginLeft: 8 }}>
                                        {getLanguage().close}
                                    </Typography>
                                </Box>
                                :
                                <Typography variant="h3" color="textPrimary" style={{ fontWeight: 500 }}>
                                    {`${getLanguage().appName} ${getLanguage().data}`}
                                </Typography>
                        }
                    </AccordionSummary>
                    <AccordionDetails className="detail">
                        <Box width="100%" display="flex" flexDirection="column">
                            <Box display="flex" pb={2} flexDirection="column">
                                <Title />
                            </Box>
                            <Box display="flex" flexDirection="column" alignItems="flex-start">
                                <SortByDropDown />
                                <Tabs />
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Hidden>

            {/* desktop mode */}
            <Hidden xsDown>
                <Box maxWidth={1170} padding="0 24px" width="100%" display="flex" flexDirection="column">
                    <Box display="grid" gridTemplateColumns="1.5fr 1fr" gridGap={20} pb={2} alignItems="center">
                        <Title />
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Tabs />
                        <SortByDropDown />
                    </Box>
                </Box>
            </Hidden>
        </Box >
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.secondary.main,
        borderBottom: '2px solid #ECECF4',
        zIndex: 100,
    },
    title: {
        '& p': {
            color: '#92929D',
            marginTop: theme.spacing(2),
            lineHeight: '22px',
            '& b': {
                color: theme.palette.text.primary,
                textTransform: 'lowercase'
            },
        }
    },
    select: {
        width: 228,
        background: theme.palette.secondary.main,
        border: '1.5px solid #F2F2FE',
        height: '45px !important',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            marginLeft: 0,
            marginBottom: theme.spacing(2)
        },
        '& p': {
            color: '#696974',
            '& b': {
                color: '#44444F',
            }
        },
    },
    tabs: {
        '& .Mui-selected': {
            color: theme.palette.primary.main
        }
    },
    collapse: {
        width: '100%',
        boxShadow: 'unset',
        '& .summary': {
            display: 'flex',
            alignItems: 'center',
            height: 60,
            minHeight: 'unset !important',
            padding: `0px ${theme.spacing(3)}px`,
            boxShadow: 'inset 0px -1px 0px #F6F6F9'
        },
        '& .detail': {
            padding: `${theme.spacing(3)}px ${theme.spacing(2)}px 0`,
            background: theme.palette.secondary.main,
            display: 'flex',
            flexFlow: 'column',
        }
    },
    dataWorthButton: {
        // font: 'Roboto'
    }
}));

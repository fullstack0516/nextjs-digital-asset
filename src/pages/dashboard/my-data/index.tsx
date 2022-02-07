import React, { useState, useEffect } from 'react';
import { Grid, Box, makeStyles, Dialog, Button } from "@material-ui/core";
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { UserDataTag } from '../../../models/user-data-tag';
import CustomDivider from '../../../components/custom-divider';
import { getLanguage } from '../../../langauge/language';
import { fetchMyData, setCategoryBlacklisted } from '../../../utils/client/user-actions';
import { Player } from '@lottiefiles/react-lottie-player';
import fetching from '../../../../public/lottie/loading-fetch.json';
import noData from '../../../../public/lottie/no-data.json';
import loadable from '@loadable/component';
import CustomHeader from '../../../components/custom-header';
import { useWindowSize } from '../../../utils/client/use-window-size';
import { fetchDataPointsCountSF, fetchMyDataSF, server } from '../../../utils/server/graphql_server';

const MenuBar = loadable(() => import('../menu-bar'));
const Category = loadable(() => import('./category'));

export default function MyData(props: {
    myDataMap: { [category: string]: { [tagUid: string]: UserDataTag } },
    numOfDataPoints: number
}) {
    const classes = useStyles();
    const [sortBy, setSortBy] = useState<number>(0);
    const [myData, setMyData] = useState<{ [category: string]: { [tagUid: string]: UserDataTag } }>(props?.myDataMap)
    const [showMoreOpen, setShowMoreOpen] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [noMore, setNoMore] = useState<boolean>(false);
    const size = useWindowSize()

    const sortOptions = {
        0: 'A-Z'
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            let sortedMydata = {}
            switch (sortBy) {
                case 0:
                    Object.keys(myData).sort().forEach(categoryName => {
                        sortedMydata[categoryName] = myData[categoryName]
                    })
                    break;

                default:
                    break;
            }
            setMyData(() => sortedMydata)
        }
        return () => { mounted = false }
    }, [sortBy])

    const handleShowMore = (categoryName) => async () => {
        setIsLoading(() => true);
        setShowMoreOpen(() => true);
        setSelectedCategory(() => categoryName);

        // find the last tag of the selected category
        let currentCategory = myData[categoryName];
        const currentTags = Object
            .values(currentCategory)
            .sort((a, b) => {
                if (a.tagRecordedForUserIso < b.tagRecordedForUserIso) {
                    return -1
                }
                if (a.tagRecordedForUserIso > b.tagRecordedForUserIso) {
                    return 1
                }

                return 0
            });

        const res = await fetchMyData(currentTags[0].tagRecordedForUserIso, categoryName)
        if (res.count < 200) {
            setNoMore(() => true)
        }
        // create the map of tags for selected category
        res.myData[categoryName].forEach(tag => {
            currentCategory = { ...currentCategory, [tag.uid]: tag }
        })
        const updatedMyData = { ...myData, [categoryName]: currentCategory }
        setMyData(() => updatedMyData);
        setIsLoading(() => false);
    }

    const handleRemoveCategory = (categoryName) => async () => {
        await setCategoryBlacklisted(categoryName);
        let myDataMap = {};
        const res = await fetchMyData(new Date().toISOString())
        Object.keys(res.myData).map(category => {
            let tagMap = {};
            res[category].forEach(tag => {
                tagMap = { ...tagMap, [tag.uid]: tag }
            })
            myDataMap = {
                ...myDataMap,
                [category]: tagMap
            }
        })
        setMyData(() => myDataMap);
    }

    return (
        <>
            <CustomHeader title="Awake - Dashboard - MyData" />
            <MenuBar
                onChangeSort={(newValue) => setSortBy(() => newValue)}
                sortOptions={sortOptions}
                sortValue={sortBy}
                numOfDataPoints={props?.numOfDataPoints}
            />
            <Box className={classes.root}>
                {
                    Object.keys(myData).length ?
                        <Grid container spacing={4}>
                            {Object.keys(myData).map(category =>
                                <Grid item xs={12} sm={6} md={4} key={category}>
                                    <Category
                                        category={category}
                                        tags={myData[category]}
                                        onShowMore={handleShowMore(category)}
                                        onRemoveCategory={handleRemoveCategory(category)}
                                    />
                                </Grid>
                            )}
                        </Grid>
                        :
                        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
                            <Player autoplay loop src={JSON.stringify(noData)} style={{ width: size.width > 599 ? 500 : `${size.width - 20}px`, }} />
                        </Box>
                }
            </Box>
            {/* dialog for specific category tags */}
            <Dialog aria-labelledby="customized-dialog-title" open={showMoreOpen}>
                <MuiDialogContent >
                    <Category category={selectedCategory} tags={myData[selectedCategory]} />
                </MuiDialogContent>
                <CustomDivider />
                <MuiDialogActions>
                    <Box display="flex" justifyContent="space-between" p={2} pb={3} width="100%" className={classes.actions}>
                        <Button variant="contained" color="secondary" onClick={() => setShowMoreOpen(() => false)}>
                            {getLanguage().close}
                        </Button>
                        {
                            !noMore &&
                            <Button variant="contained" color="primary" onClick={handleShowMore(selectedCategory)} disabled={isLoading} >
                                {
                                    isLoading &&
                                    <Player
                                        autoplay
                                        loop
                                        src={JSON.stringify(fetching)}
                                        style={{ height: 25, width: 25, marginRight: 5 }}
                                    />
                                }
                                {getLanguage().showMore}
                            </Button>
                        }
                    </Box>
                </MuiDialogActions>
            </Dialog>
        </>
    )
}

export const getServerSideProps = async (context) => {
    const { req, res } = context;
    await server({ req, res });
    let myDataMap = {};
    // Promise.all can reduce the time of delay
    const rest = await Promise.all([
        fetchMyDataSF({ fromIso: new Date().toISOString() }),
        fetchDataPointsCountSF()
    ]);
    const myData = rest[0]
    const numOfDataPoints = rest[1]

    Object.keys(myData).map(category => {
        let tagMap = {};
        myData[category].forEach(tag => {
            tagMap = { ...tagMap, [tag.uid]: tag }
        })
        myDataMap = {
            ...myDataMap,
            [category]: tagMap
        }
    })

    return {
        props: {
            myDataMap,
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
            marginTop: theme.spacing(10),
        },
    },
    actions: {
        [theme.breakpoints.down('xs')]: {
            flexFlow: 'column-reverse',
            '& button:nth-child(2)': {
                marginBottom: 12
            },
        },
    },
}));

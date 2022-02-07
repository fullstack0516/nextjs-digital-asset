import React, { useState } from 'react';
import { Box, Button, makeStyles, Typography, Hidden, Tooltip } from '@material-ui/core';
import moment from 'moment'
import { sortByProperty } from '../../utils/helpers';
import { Page } from '../../models/page';
import { getLanguage } from '../../langauge/language';
import { Site } from '../../models/site';
import { useWindowSize } from '../../utils/client/use-window-size';
import SvgDelete from '../../../public/delete.svg';
import SvgEdit from '../../../public/edit.svg';
import ConfirmDialog from '../../components/confirm-dialog';
import { deletePage } from '../../utils/client/page-action';

export default function PageList(props: {
    pages: { [pageUid: string]: Page },
    onRemoved: (removedUid: string) => void,
    site: Site
}
) {
    const classes = useStyles();
    const size = useWindowSize();
    const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean | undefined>(false);
    const [selectedPageUid, setSelectedPageUid] = useState<string>('');

    const handleRemove = (uid) => async (event) => {
        event.stopPropagation();
        setOpenConfirmDelete(() => true)
        setSelectedPageUid(() => uid)
    }

    const remove = async () => {
        setOpenConfirmDelete(() => false)
        try {
            const res = await deletePage(selectedPageUid);
            if (res) {
                props.onRemoved(selectedPageUid);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const goPreview = (page) => () => {
        window.open(`/pages/${props?.site?.url}/${page?.url}/${page.isPublished ? '' : 'preview'}`, '_black').focus()
    }

    const goEdit = (page) => (event) => {
        event.stopPropagation();
        window.location.href = `/page-edit/${props?.site?.url}/${page?.url}`
    }

    const pages = sortByProperty(props?.pages, 'lastUpdateIso', 'desc');

    return (
        <>
            {
                pages.length ?
                    pages.map((page) =>
                        <Box
                            key={page.uid}
                            display="grid"
                            gridTemplateColumns={size.width > 768 ? "33% 26% 12% 1fr" : "minmax(170px, 2.5fr) 1fr 50px"}
                            gridGap={8}
                            alignItems="center"
                            pl={size.width > 768 ? 4 : 3}
                            pr={size.width > 768 ? 3 : 2}
                            height={size.width > 599 ? 104 : 67}
                            className={classes.root}
                            onClick={size.width <= 599 ? goPreview(page) : null}
                        >
                            <Hidden smDown>
                                <Box display="grid" gridTemplateColumns="48px 1fr" gridGap={22} alignItems="center">
                                    <img className={classes.avatar} src={props?.site.siteIcon.url} />
                                    <Box display="flex" flexDirection="column">
                                        <Box maxWidth='200px'>
                                            <Tooltip title={page.title}>
                                                <Typography variant="h5" color="textPrimary" className="turncate">{page.title}</Typography>
                                            </Tooltip>
                                        </Box>
                                        <Typography variant="h6" color="textPrimary" style={{ marginTop: 4 }} className="multi-line-turncate">{page.url}</Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Box width="50%">
                                        <Typography variant="h6" color="textSecondary">{getLanguage().visits}</Typography>
                                        <Typography variant="h6" color="textSecondary" style={{ marginTop: 9 }}>{page.totalVisits}</Typography>
                                    </Box>
                                    <Box width="50%">
                                        <Typography variant="h6" color="textSecondary">{getLanguage().impressions}</Typography>
                                        <Typography variant="h6" color="textSecondary" style={{ marginTop: 9 }}>{page.totalImpressions}</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="h6" color="textSecondary">{moment(page.lastUpdateIso).format("Do MMM YYYY")}</Typography>
                                <Box display="flex" alignItems="center" justifyContent="flex-end" className={classes.actions}>
                                    <Button variant="contained" onClick={goPreview(page)}>
                                        {getLanguage().preview}
                                    </Button>
                                    <Button variant="contained" onClick={goEdit(page)}>{getLanguage().editPage}</Button>
                                    <SvgDelete width={20} height={20} onClick={handleRemove(page.uid)} />
                                </Box>
                            </Hidden>
                            <Hidden mdUp>
                                <Box display="grid" gridTemplateColumns={`${size.width > 599 ? 48 : 34}px 1fr`} gridGap={10} alignItems="center">
                                    <img className={classes.avatar} src={props?.site.siteIcon.url} />
                                    <Typography variant="h6" color="textPrimary" className="multi-line-turncate">
                                        {page.title}
                                    </Typography>
                                </Box>
                                <Typography variant="h6" color="textSecondary">{page.totalVisits}</Typography>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <SvgEdit width={20} height={20} onClick={goEdit(page)} fill="#92929D" />
                                    <SvgDelete width={20} height={20} onClick={handleRemove(page.uid)} />
                                </Box>
                            </Hidden>
                        </Box>
                    )
                    :
                    (
                        <Box display="flex" justifyContent="center" p={4}>
                            <Typography variant="h6" color="textSecondary" style={{ lineHeight: '26px', width: 324, textAlign: 'center' }}>
                                You don’t have any page available right now, please add a new page
                            </Typography>
                        </Box>
                    )
            }
            <ConfirmDialog open={openConfirmDelete} onSave={remove} onClose={() => setOpenConfirmDelete(false)} message="Are you sure you want to delete this page?" />
        </>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        borderBottom: "1.5px solid #F2F2FE",
        '& img': {
            cursor: 'pointer',
            objectFit: 'cover'
        },
        '& svg': {
            cursor: 'pointer'
        }
    },
    avatar: {
        width: '100%',
        height: 48,
        borderRadius: 4,
        [theme.breakpoints.down('xs')]: {
            height: 34,
        },
    },
    actions: {
        '& button': {
            marginRight: theme.spacing(2),
            color: '#696974',
            background: theme.palette.common.black,
            fontSize: 12,
            fontWeight: 600,
            minWidth: 'unset !important',
            '&:hover': {
                background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
            },
            '& + &': {
                marginRight: theme.spacing(1)
            },
        },

    },
}));

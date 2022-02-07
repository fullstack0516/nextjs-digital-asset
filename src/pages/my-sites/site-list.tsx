import React, { useState } from 'react';
import Link from 'next/link';
import { Box, Button, makeStyles, Typography, Hidden, } from '@material-ui/core';
import { Site } from '../../models/site';
import { sortByProperty } from '../../utils/helpers';
import { getLanguage } from '../../langauge/language';
import { useWindowSize } from '../../utils/client/use-window-size';
import UploadImageEditor from '../../components/upload-image-editor';
import SvgDelete from '../../../public/delete.svg';
import ConfirmDialog from '../../components/confirm-dialog';
import { deleteSite, updateSite } from '../../utils/client/site-action';

export default function SiteList(props: {
    sites: { [siteUid: string]: Site },
    onRemoved: (removedUid: string) => void,
    onUpdated: (updateUid: string, site: Site) => void
}
) {
    const classes = useStyles();
    const size = useWindowSize();
    const [openLogoEdit, setOpenLogoEdit] = useState<boolean | undefined>(null);
    const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean | undefined>(false);
    const [selectedSiteId, setSelectedSiteId] = useState<string>('');

    const handleRemove = (uid) => async (event) => {
        event.stopPropagation();
        setOpenConfirmDelete(() => true)
        setSelectedSiteId(() => uid)
    }

    const remove = async () => {
        setOpenConfirmDelete(() => false)
        try {
            console.log('selected side', selectedSiteId)
            const res = await deleteSite(selectedSiteId);
            if (res) {
                props.onRemoved(selectedSiteId);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleUpdateLogo = async (url) => {
        const res = await updateSite({
            siteToUpdateUid: selectedSiteId,
            siteIcon: {
                type: 'photo',
                url: url
            }
        })
        if (res) {
            props?.onUpdated(selectedSiteId, res)
        }
    }

    const goSite = (site) => (event) => {
        if (size.width <= 599) {
            window.location.href = `/my-sites/${site.url}`
        }
    }

    const siteLogoEdit = (uid) => (event) => {
        event.stopPropagation();
        setSelectedSiteId(() => uid)
        setOpenLogoEdit(true)
    }

    const closeImageEditor = () => {
        setOpenLogoEdit(() => false)
        setSelectedSiteId(() => null)
    }

    const closeConfirmDlg = () => {
        setOpenConfirmDelete(() => false)
        setSelectedSiteId(() => null)
    }

    const sites = sortByProperty(props?.sites, 'lastSiteUpdatedIso', 'desc');

    return (
        <>
            {
                sites.length ?
                    sites.map((site) =>
                        <Box
                            key={site.uid}
                            display="grid"
                            gridTemplateColumns={size.width > 599 ? "1fr 1fr 1fr 1fr" : "minmax(120px, 2.5fr) 1fr 20px"}
                            gridGap={8}
                            alignItems="center"
                            pl={size.width > 599 ? 4 : 3}
                            pr={size.width > 599 ? 3 : 2}
                            height={size.width > 599 ? 96 : 67}
                            className={classes.root}
                            onClick={goSite(site)}
                        >
                            <Hidden xsDown>
                                <Box display="grid" gridTemplateColumns="48px 1fr" gridGap={22} alignItems="center">
                                    <img className={classes.avatar} src={site.siteIcon?.url} onClick={siteLogoEdit(site.uid)} />
                                    <Typography variant="h6" color="textPrimary" className="multi-line-turncate">{site.name}</Typography>
                                </Box>
                                <Typography variant="h6" color="textSecondary" className="multi-line-turncate">{site.url}</Typography>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h6" color="textSecondary">{getLanguage().totalVisits}</Typography>
                                        <Typography variant="h6" color="textSecondary" style={{ marginTop: 9 }}>{site.totalVisits}</Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="flex-end" className={classes.actions}>
                                    <Link href={`/my-sites/${site.url}`}>
                                        <Button variant="contained">{getLanguage().viewPages}</Button>
                                    </Link>
                                    <SvgDelete width={20} height={20} onClick={handleRemove(site.uid)} />
                                </Box>
                            </Hidden>
                            <Hidden smUp>
                                <Box display="grid" gridTemplateColumns={`${size.width > 599 ? 48 : 34}px 1fr`} gridGap={10} alignItems="center">
                                    <img src={site.siteIcon.url} className={classes.avatar} onClick={siteLogoEdit(site.uid)} />
                                    <Typography variant="h6" color="textPrimary" className="multi-line-turncate">
                                        {site.name}
                                    </Typography>
                                </Box>
                                <Typography variant="h6" color="textSecondary">{site.totalVisits}</Typography>
                                <SvgDelete width={20} height={20} onClick={handleRemove(site.uid)} />
                            </Hidden>
                        </Box>
                    )
                    :
                    (
                        <Box display="flex" justifyContent="center" p={4}>
                            <Typography variant="h6" color="textSecondary" style={{ lineHeight: '26px', width: 324, textAlign: 'center' }}>
                                You don’t have any site available right now, please add a new site
                            </Typography>
                        </Box>
                    )
            }
            <UploadImageEditor open={openLogoEdit} close={closeImageEditor} onSave={handleUpdateLogo} />
            <ConfirmDialog open={openConfirmDelete} onSave={remove} onClose={closeConfirmDlg} message="Are you sure you want to delete this site?" />
        </>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        borderBottom: "1.5px solid #F2F2FE",
        '& img': {
            cursor: 'pointer',
            objectFit: 'cover'
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
            marginRight: theme.spacing(3),
            color: '#696974',
            background: theme.palette.common.black,
            fontSize: 12,
            fontWeight: 600,
            minWidth: 'unset !important',
            '&:hover': {
                background: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
            }
        }
    },
}));

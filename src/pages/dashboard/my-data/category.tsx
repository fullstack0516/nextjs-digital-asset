import React, { useState } from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import CustomDivider from '../../../components/custom-divider';
import { getLanguage } from '../../../langauge/language';
import CustomPopper from '../../../components/custom-popper';
import { HighlightOffOutlined } from '@material-ui/icons';
import { UserDataTag } from '../../../models/user-data-tag';
import { sortByProperty } from '../../../utils/helpers';
import loadable from '@loadable/component';
import ConfirmDialog from '../../../components/confirm-dialog';

const Tag = loadable(() => import('../../../components/tag'));

export default function Category(props: {
    category: string,
    tags: { [tagUid: string]: UserDataTag },
    onShowMore?: () => void,
    onRemoveCategory?: () => void
}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openConfirmRemove, setOpenConfirmRemove] = useState<boolean>(false)

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleTest = () => {
        setAnchorEl(() => null)
    }

    const tags = sortByProperty(props?.tags, 'tagRecordedForUserIso', 'desc');
    // just show 6 tags at max in card UI. tags can be shown more in show-more modal
    const limitOfTags = props?.onShowMore ? 6 : tags.length;

    return (
        <Box className={classes.root}>
            <Box p={2} display="flex" justifyContent="space-between" className={classes.title}>
                <Typography variant="h5" color="textPrimary" component="p">
                    {props?.category}
                </Typography>
                <MoreHorizIcon onClick={handleClick} />
            </Box>
            <CustomDivider />
            <Box display="flex" flexWrap="wrap" p={2} ml={-0.5} className="scrollable" maxHeight={300}>
                {
                    tags.slice(0, limitOfTags).map(tag =>
                        <Tag name={tag.tagString} key={tag.uid} />
                    )
                }
                {/* load more tags */}
                {
                    props?.onShowMore &&
                    <Box display="flex" alignItems="center" className={classes.showMore} onClick={props.onShowMore}>
                        <Typography variant="h6" component="span">{getLanguage().showMore}</Typography>
                        <AddIcon />
                    </Box>
                }

                <CustomPopper anchorEl={anchorEl} onClose={handleTest} >
                    <Box display="flex" flexDirection="column">
                        {/* <Box display="flex" alignItems="center" className={classes.actions}>
                            <AddIcon />
                            <Typography variant="h6">{getLanguage().addNewData}</Typography>
                        </Box> */}
                        <Box display="flex" alignItems="center" className={classes.actions} mt={0.25} onClick={() => setOpenConfirmRemove(() => true)}>
                            <HighlightOffOutlined />
                            <Typography variant="h6">{getLanguage().removeGroup}</Typography>
                        </Box>
                    </Box>
                </CustomPopper>
            </Box>

            <ConfirmDialog
                open={openConfirmRemove}
                onSave={props?.onRemoveCategory}
                onClose={() => setOpenConfirmRemove(() => false)}
                message="Are you sure you want to remove this data points?"
            />
        </Box>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.secondary.main,
        filter: 'drop-shadow(0.2px 0.2px 1px lightgray)',
        borderRadius: 10,
    },
    title: {
        '& p': {
            fontWeight: 500
        },
        '& svg': {
            color: '#92929D',
            height: 20,
            cursor: 'pointer'
        }
    },
    showMore: {
        borderRadius: theme.spacing(2),
        padding: `${theme.spacing(0.5)}px ${theme.spacing(1.5)}px`,
        cursor: 'pointer',
        margin: theme.spacing(0.5),
        color: theme.palette.secondary.main,
        background: theme.palette.primary.main,
        '& span': {
            fontSize: 12,
            marginRight: 12
        },
        '& svg': {
            color: theme.palette.secondary.main,
            height: 20,
        }
    },
    actions: {
        cursor: 'pointer',
        '& svg': {
            width: 16,
            color: theme.palette.secondary.main
        },
        '& h6': {
            fontSize: 12,
            marginLeft: theme.spacing(1.2),
            color: '#FAFAFB',
            lineHeight: '22px'
        }
    }
}));

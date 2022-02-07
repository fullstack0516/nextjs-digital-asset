import React, { useContext, useState } from 'react';
import { Box, makeStyles, Typography, Tooltip, Button, Dialog } from '@material-ui/core';
import { useWindowSize } from '../../utils/client/use-window-size';
import { getLanguage } from '../../langauge/language';
import CustomDivider from '../../components/custom-divider';
import { PageContext } from '../../utils/client/page-state';
import Tag from '../../components/tag';
import IconLabelButton from '../../components/icon-label-button';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import FlagIcon from '@material-ui/icons/Flag';
import SvgShare from '../../../public/share.svg';
import SvgMetaTag from '../../../public/meta-tag.svg';
import SvgDataTags from '../../../public/data-tags.svg';
import { isMobileDevice } from '../../utils/helpers';
import { reasonDescSchema, reasonMaxLength, reasonMinLength } from '../../models/report';
import CustomInput from '../../components/custom-input';
import { recordPageDislike, recordPageLike, reportPage } from '../../utils/client/page-action';
import { UserContext } from '../../utils/client/user-state';

export default function DataTags(props: {
    darkMode?: boolean,
    pageLiked: -1 | 0 | 1,
    totalComments: number
}) {
    const classes = useStyles();
    const { darkMode, totalComments } = props
    const [copied, setCopied] = useState<boolean | undefined>(null)
    const [openReport, setOpenReport] = useState<boolean>(false);
    const [reasonDesc, setReasonDesc] = useState<string | undefined>(null)
    const [reasonError, setReasonError] = useState<string | undefined>(null)
    const [pageLiked, setPageLiked] = useState<-1 | 0 | 1>(props.pageLiked)
    const size = useWindowSize();
    const pageCtx = useContext(PageContext);
    const userCtx = useContext(UserContext)
    const user = userCtx.userState.user
    const page = pageCtx.pageState.page

    const handleURLCopy = () => {
        if (isMobileDevice()) {
            navigator
                .share({
                    title: document.title,
                    text: document.location.href,
                    url: document.location.href,
                })
                .then(() => setCopied(() => true))
                .catch(err => console.error(err));
        }
        else {
            // copy url
            navigator.clipboard.writeText(document.location.href)
            setCopied(() => true)

        }
    }

    const useStyleTooltip = makeStyles(() => ({
        arrow: {
            color: page?.pageColor,
        },
        tooltip: {
            backgroundColor: page?.pageColor,
        },
    }))

    const handleReport = async () => {
        const reasonFieldError = reasonDescSchema.validate(reasonDesc).error;
        if (reasonFieldError) {
            setReasonError(reasonFieldError.message.replace('"value"', 'Reason'));
        } else {
            await reportPage(page.uid, reasonDesc);
            handleReportClose();
        }
    }

    const handleReportClose = () => {
        setOpenReport(false);
        setReasonDesc(null);
        setReasonError(null);
    }

    const handleLike = (liked: 1 | -1) => async () => {
        if (user) {
            if (liked === 1) {
                await recordPageLike(page?.uid);
            }

            if (liked === -1) {
                await recordPageDislike(page?.uid);
            }

            setPageLiked((prev) => prev === liked ? 0 : liked)

            return
        }

        return window.open('/auth', '_blank').focus();
    }

    let categories = {}
    page?.contentCategories.forEach(category => {
        categories = { ...categories, [category]: category }
    })

    const countOfDataTags = Object.keys(categories).length + Object.keys(page?.dataTags ?? []).length

    const isAuthor = user?.uid === page?.pageOwner

    return (
        <Box className={classes.root}>
            <Box
                display={size.width > 768 ? "grid" : "flex"}
                flexWrap="wrap"
                justifyContent="center"
                gridTemplateColumns="max-content max-content max-content max-content 1fr max-content max-content"
            >
                <IconLabelButton label={page?.likes} active={pageLiked === 1} startIcon={<ThumbUpAltOutlinedIcon />} onClick={handleLike(1)} />
                <IconLabelButton label={page?.dislikes} active={pageLiked === -1} startIcon={<ThumbDownOutlinedIcon />} onClick={handleLike(-1)} />
                <IconLabelButton label={totalComments} active={false} startIcon={<ChatBubbleIcon />} href='#comments' />
                {/* total views */}
                <IconLabelButton label={page?.totalVisits} active={false} startIcon={<VisibilityIcon />} />
                <Box />
                {/* copy of page url */}
                <Tooltip
                    title={copied ? 'Copied' : 'Copy to clipboard'}
                    placement="top"
                    classes={useStyleTooltip()}
                    arrow
                >
                    <Box>
                        <IconLabelButton
                            label={getLanguage().share}
                            startIcon={<SvgShare width={20} height={20} fill="#546E7A" />}
                            onClick={handleURLCopy}
                            onMouseLeave={() => setCopied(() => null)}
                        />
                    </Box>
                </Tooltip>
                {/* report page */}
                {user && !isAuthor &&
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{
                            border: '1px solid #E3E7F0',
                            margin: 4,
                            minWidth: 80
                        }}
                        onClick={() => setOpenReport(() => true)}
                    >
                        <FlagIcon />
                    </Button>
                }
            </Box>

            {/* meta-tags */}
            <Box className={classes.tags} style={{ background: props.darkMode ? '#14141D' : '#F2F7FA' }} padding={3.25}>
                <Box display="grid" gridTemplateColumns="max-content 1fr" gridGap={10} alignItems="center">
                    <SvgMetaTag />
                    <Typography
                        variant="h3"
                        color="textPrimary"
                        style={{
                            color: darkMode && '#FFFFFF',
                            fontWeight: 600,
                            lineHeight: '33px'
                        }}
                    >
                        {getLanguage().metaTags}
                    </Typography>
                </Box>
                <Box
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="initial"
                    ml={size.width > 599 ? 0 : 1}
                    mt={1}
                    pl={size.width > 599 ? 1.5 : 0.5}
                    pr={size.width > 599 ? 1.5 : 0.5}
                >
                    {
                        (page?.userMetaTags ?? []).map(metaTag =>
                            <Tag key={metaTag.uid} name={metaTag.tagString} darkMode={darkMode} />
                        )
                    }
                </Box>
            </Box>

            {/* data-tags */}
            <Box className={classes.tags} style={{ background: props.darkMode ? '#14141D' : '#F2F7FA' }}>
                <Box display="grid" gridTemplateColumns="max-content 1fr" gridGap={10} padding={3.25}>
                    <SvgDataTags />
                    <Box
                        display="flex"
                        alignItems={size.width > 599 ? "center" : "flex-start"}
                        flexDirection={size.width > 599 ? "row" : "column"}
                        justifyContent="space-between"
                    >
                        <Typography
                            variant="h3"
                            color="textPrimary"
                            style={{
                                color: darkMode && '#FFFFFF',
                                fontWeight: 600,
                                lineHeight: '33px'
                            }}
                        >
                            {getLanguage().collectedDataTagsWhenVisitingPage}
                        </Typography>
                        <Typography
                            variant="h5" color="textSecondary"
                            style={{
                                color: darkMode && '#95B9CA ',
                                fontWeight: 600,
                                marginTop: size.width <= 599 && 12,
                                lineHeight: '18px'
                            }}
                        >
                            {`${countOfDataTags} ${getLanguage().dataTags}`}
                        </Typography>
                    </Box>
                </Box>
                <CustomDivider />
                <Box
                    display="flex"
                    flexWrap="wrap"
                    justifyContent={size.width > 599 ? "center" : "initial"}
                    pt={size.width > 599 ? 4 : 3}
                    pb={size.width > 599 ? 4.5 : 3.5}
                    pl={size.width > 599 ? 1.5 : 0.5}
                    pr={size.width > 599 ? 1.5 : 0.5}
                    ml={size.width > 599 ? 0 : 1}
                >
                    {/* main categories */}
                    {
                        Object.keys(categories).map(category =>
                            <Tag key={category} name={category} darkMode={darkMode} highlighted />
                        )
                    }
                    {/* data tags */}
                    {
                        (page?.dataTags ?? []).map((tag) =>
                            <Tag key={tag?.uid} name={tag?.tagString} darkMode={darkMode} />
                        )
                    }
                </Box>
            </Box>

            {/* Reprot Dialog */}
            <Dialog open={openReport}>
                <Box p={4}>
                    <CustomInput
                        label={`${getLanguage().reasonDescription}`}
                        onChange={(event) => setReasonDesc(event.target.value)}
                        value={reasonDesc ?? ''}
                        maxLength={reasonMaxLength}
                        minLength={reasonMinLength}
                        multiline={true}
                        rows={8}
                        placeholder="Please write the reason why you report this page..."
                        errMsg={reasonError}
                    />
                    <Box display="flex" justifyContent="space-between" className={classes.reportAction}>
                        <Button variant="contained" color="secondary" onClick={handleReportClose}>
                            {getLanguage().cancel}
                        </Button>
                        <Button variant="contained" color="primary" type="submit" onClick={handleReport} disabled={!reasonDesc || reasonDesc.length < 10}>
                            {getLanguage().report}
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </Box>
    );
}


const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1000,
        padding: '0 24px',
        margin: '0 auto',
    },
    tags: {
        borderRadius: 8,
        marginTop: theme.spacing(4),
        '& h2': {
            color: '#0A083B',
        },
        '& svg': {
            width: 22.5,
            height: 22.5,
            fill: theme.palette.primary.main,
            marginTop: `${theme.spacing(0.5)}px !important`,
        }
    },
    reportAction: {
        [theme.breakpoints.down('xs')]: {
            flexFlow: 'column-reverse',
            '& button:nth-child(2)': {
                marginBottom: theme.spacing(2)
            },
        },
    },
}));

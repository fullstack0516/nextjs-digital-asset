import { Box, Button, makeStyles, Typography } from "@material-ui/core"
import { useContext, useState, useRef } from "react"
import CommentAvatar from "../../components/custom-avatar"
import { Comment } from "../../models/comment"
import { createComment, deleteComment, fetchComments, recordCommentLike, recordCommetDislike } from "../../utils/client/comment_action"
import { useWindowSize } from "../../utils/client/use-window-size"
import { UserContext } from "../../utils/client/user-state"
import { sortByProperty, timeDifference } from "../../utils/helpers"
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ReplyIcon from '@material-ui/icons/Reply';
import { getLanguage } from "../../langauge/language"
import loadable from '@loadable/component';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import OptionsMenu from '../../components/options-menu';

const TextEditor = loadable(() => import('../../components/rich-text-editor'));

export default function CommentComponent(props: {
    data: Comment,
    darkMode: boolean,
    ml?: number
}) {
    const { data, darkMode, ml } = props

    const classes = useStyles()

    const [content, setContent] = useState<string>('')
    const [replyMap, setReplyMap] = useState<{ [commentUid: string]: Comment }>({})
    const [openReplyBox, setOpenReplyBox] = useState<boolean>(false)
    const [openReplies, setOpenReplies] = useState<boolean>(false)
    const [existMoreReplies, setExistMoreReplies] = useState<boolean>(data.count > 0)
    const [myReplies, setMyReplies] = useState<Comment[]>([])
    const [comment, setComment] = useState<Comment>(data)
    const [commentLiked, setCommentLiked] = useState<-1 | 0 | 1>(data.userLiked ?? 0)
    const [openOptions, setOpenOptions] = useState<boolean>(false)
    const optionsRef = useRef();

    const userCtx = useContext(UserContext)
    const user = userCtx.userState.user

    const size = useWindowSize()
    const bigSize = size.width > 599

    const handleOpenReply = () => {
        if (user) {
            return setOpenReplyBox((prev) => !prev)
        }

        return window.location.href = "/auth"
    }

    const handleReply = async () => {
        if (user) {
            const res = await createComment({
                pageUid: comment.pageUid,
                content: content,
                parentUid: comment.uid
            })

            if (res) {
                setOpenReplies(() => true)
                setContent(() => '')
                setOpenReplyBox(() => false)
                setComment((prev) => ({
                    ...prev,
                    count: prev.count + 1
                }))
                setMyReplies((prev) => ([
                    ...prev,
                    res,
                ]))
            }
            return
        }

        return window.location.href = "/auth"
    }

    const loadReplies = async () => {
        if (!openReplies) {
            const newReplies = await fetchComments({
                pageUid: comment.pageUid,
                parentUid: comment.uid,
            })

            newReplies.forEach(r => {
                setReplyMap((prev) => ({
                    ...prev,
                    [r.uid]: r
                }))
            })
        }
        else {
            setMyReplies(() => ([]))
            setReplyMap(() => ({}))
            setExistMoreReplies(() => true)
        }

        setOpenReplies((prev) => !prev)
    }

    const loadMoreReplies = async () => {
        const sortedReplies = sortByProperty(replyMap, 'createdIso', 'desc')

        const moreReplies = await fetchComments({
            pageUid: sortedReplies[0].pageUid,
            parentUid: comment.uid,
            fromIso: sortedReplies[0].createdIso
        })

        if (moreReplies.length === 0) {
            return setExistMoreReplies(() => false)
        }

        const myReplyUids = myReplies.map(c => c.uid)

        moreReplies.forEach(c => {
            if (!myReplyUids.includes(c.uid)) {
                setReplyMap((prev) => ({
                    ...prev,
                    [c.uid]: c
                }))
            }
        })
    }

    const handleLike = (liked: 1 | -1) => async () => {
        if (user) {
            let res: Comment | null
            if (liked === 1) {
                res = await recordCommentLike(comment.uid);
            }

            if (liked === -1) {
                res = await recordCommetDislike(comment.uid);
            }

            if (res) {
                setComment(() => res)
                setCommentLiked((prev) => prev === liked ? 0 : liked)
            }

            return
        }

        return window.open('/auth', '_blank').focus();
    }

    const handleDeleteComment = async () => {
        const res = await deleteComment(comment.uid);

        if (res) {
            setComment(() => res)
        }
    }

    const replies = [...sortByProperty(replyMap, 'createdIso', 'asc'), ...myReplies]

    return (
        <Box
            display="grid"
            gridTemplateColumns={`${bigSize ? 48 : 32}px calc(100% - ${bigSize ? 66 : 40}px)`}
            gridGap={bigSize ? 18 : 8}
            className={classes.root}
            style={{ color: darkMode && '#95B9CA' }}
            mt={2}
            ml={ml ?? 0}
            minWidth={300}
        >
            <Box display="flex" justifyContent="space-between">
                <CommentAvatar user={comment.author} width={bigSize ? 48 : 32} />
            </Box>
            <Box>
                <Box height={bigSize ? 48 : 32} display="flex" alignItems="center">
                    <Typography variant="h5" color="textPrimary" style={{ fontWeight: 600, color: darkMode && '#FFFFFF' }}>
                        {comment.author.username}
                    </Typography>
                    <Box ml={2} display="flex" alignItems="center">
                        <Box display="flex" alignItems="center">
                            <ThumbUpAltIcon className="thumb" onClick={handleLike(1)} color={commentLiked === 1 ? 'primary' : 'inherit'} />
                            <Typography variant="h6" style={{ fontWeight: 600 }}>
                                {comment.likes}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" ml={bigSize ? 2 : 1}>
                            <ThumbDownAltIcon className="thumb" onClick={handleLike(-1)} color={commentLiked === -1 ? 'primary' : 'inherit'} />
                            <Typography variant="h6" style={{ fontWeight: 600 }}>
                                {comment.dislikes}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display="flex" justifyContent="flex-end" width="100%">
                        {
                            (user.isAdmin || user.uid === comment.author.uid) && !comment.isDeleted &&
                            <MoreHorizIcon ref={optionsRef} onClick={() => setOpenOptions(true)} style={{ cursor: 'pointer' }} />
                        }
                    </Box>
                    {
                        openOptions &&
                        <OptionsMenu
                            anchorEl={optionsRef.current}
                            options={[
                                { icon: <DeleteForeverIcon />, onClick: handleDeleteComment, text: getLanguage().delete },
                            ]}
                            onClose={() => setOpenOptions(false)}
                            open={openOptions}
                            disableBottomMenus
                        />
                    }
                </Box>
                <Typography
                    variant='h5'
                    style={{
                        lineHeight: '24px',
                        marginBottom: 8,
                        marginTop: bigSize ? 0 : 8,
                        marginLeft: bigSize ? 0 : -40,
                        alignSelf: 'center'
                    }}
                    dangerouslySetInnerHTML={{ __html: comment.isDeleted ? getLanguage().commentDeleted : comment.content.html }}
                />
                <Box
                    display="grid"
                    gridTemplateColumns="max-content max-content 1fr max-content"
                    alignItems="center"
                    ml={bigSize ? 0 : -5}
                >
                    <Box display="flex" alignItems="center" onClick={handleOpenReply}>
                        <ReplyIcon className='reply' />
                        <Typography variant='h6' color="primary" style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                            {getLanguage().reply}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        {
                            comment.count > 0 &&
                            <>
                                <Typography variant='h6' style={{ fontWeight: 600, margin: '0px 6px', }}>
                                    •
                                </Typography>
                                <Typography
                                    variant='h6'
                                    style={{ fontWeight: 600, cursor: 'pointer' }}
                                    onClick={loadReplies}
                                >
                                    {openReplies ? getLanguage().hiddenReplies : `${comment.count} ${getLanguage().replies}`}
                                </Typography>
                            </>
                        }
                    </Box>
                    <Box></Box>
                    <Typography variant='h6' style={{ fontWeight: 600, marginLeft: 8 }}>
                        {timeDifference(comment.createdIso)}
                    </Typography>
                </Box>
                {/* Replies */}
                {
                    openReplies &&
                    <Box
                        display="flex"
                        flexDirection="column"
                        ml={bigSize ? 0 : -2}
                    >
                        {
                            replies.map((reply) => (
                                <CommentComponent data={reply} darkMode={darkMode} key={reply.uid} />
                            ))
                        }
                        {
                            (Object.keys(replyMap).length && existMoreReplies)
                                ? <Typography variant="h6" color="primary" style={{ marginTop: 8, fontWeight: 600, cursor: 'pointer' }} onClick={loadMoreReplies}>
                                    {getLanguage().loadMoreReplies}
                                </Typography>
                                : ''
                        }
                    </Box>
                }
                {/* reply for specific comment */}
                {
                    openReplyBox &&
                    <Box
                        display="grid"
                        gridTemplateColumns={`${bigSize ? 48 : 36}px calc(100% - ${bigSize ? 66 : 44}px)`}
                        gridGap={bigSize ? 18 : 8}
                        mt={2}
                        ml={bigSize ? 0 : -5}
                    >
                        <CommentAvatar user={user} width={bigSize ? 48 : 36} />
                        <Box display="flex" flexDirection="column">
                            <TextEditor onChange={(e) => setContent(() => e)} />
                            {
                                content.length >= 1 &&
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleReply}
                                    style={{ width: bigSize ? 100 : 50, minWidth: 'unset' }}
                                    size={bigSize ? 'medium' : 'small'}
                                >
                                    {getLanguage().reply}
                                </Button>
                            }

                        </Box>
                    </Box>
                }
            </Box>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        color: theme.palette.text.secondary,
        '& .thumb': {
            width: 18,
            marginRight: theme.spacing(1),
            cursor: 'pointer',
            '&:hover': {
                opacity: 0.8
            }
        },
        '& .reply': {
            color: theme.palette.primary.main,
            width: 25,
            marginRight: theme.spacing(0.5),
            cursor: 'pointer',
            '&:hover': {
                opacity: 0.8
            }
        },
        '& .delete': {
            color: theme.palette.primary.main,
            width: 20,
            cursor: 'pointer',
            '&:hover': {
                opacity: 0.8
            }
        },
        '& p': {
            margin: 0
        }
    }
}));

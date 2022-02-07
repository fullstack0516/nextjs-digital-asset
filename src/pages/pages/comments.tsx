import React, { useContext, useState } from 'react';
import { Box, makeStyles, Typography, Button } from '@material-ui/core';
import { PageContext } from '../../utils/client/page-state';
import { useWindowSize } from '../../utils/client/use-window-size';
import { getLanguage } from '../../langauge/language';
import { Comment } from '../../models/comment';
import { sortByProperty } from '../../utils/helpers';
import loadable from '@loadable/component';
import { createComment, fetchComments } from '../../utils/client/comment_action';
import CommentComponent from './comment';

const TextEditor = loadable(() => import('../../components/rich-text-editor'));

export default function Comments(props: {
    darkMode: boolean,
    initialComments: { [commentUid: string]: Comment },
}) {
    const { darkMode, initialComments } = props
    const [newContent, setNewContent] = useState<string>('')
    const [commentMap, setCommentMap] = useState<{ [commentUid: string]: Comment }>(initialComments)
    const [myComments, setMyComments] = useState<Comment[]>([])
    const [existMoreComments, setExistMoreComments] = useState<boolean>(true)

    const classes = useStyles({ ...props });
    const pageContext = useContext(PageContext)
    const page = pageContext.pageState.page

    const size = useWindowSize()
    const bigSize = size.width > 599

    const onContentChange = (markdown) => {
        setNewContent(() => markdown)
    }

    const handlePostComment = async () => {
        const res = await createComment({
            pageUid: page.uid,
            content: newContent
        })

        if (res) {
            setNewContent(() => '')
            setMyComments((prev) => ([
                res,
                ...prev
            ]))
        }
    }

    const handleLoadMore = async () => {
        const sortedComments = sortByProperty(commentMap, 'createdIso', 'desc')

        const moreComments = await fetchComments({
            pageUid: page.uid,
            fromIso: sortedComments[0].createdIso
        })

        if (moreComments.length === 0) {
            return setExistMoreComments(() => false)
        }

        const myCommentUids = myComments.map(c => c.uid)

        moreComments.forEach(c => {
            if (!myCommentUids.includes(c.uid)) {
                setCommentMap((prev) => ({
                    ...prev,
                    [c.uid]: c
                }))
            }

        })
    }

    const comments = [...myComments, ...sortByProperty(commentMap, 'createdIso', 'asc')]

    return (
        <Box display="flex" flexDirection="column" className={classes.root} id="comments">
            {/* post-comment box */}
            <Box
                display="flex"
                flexDirection="column"
                padding={`${bigSize ? 55 : 30}px ${bigSize ? 30 : 20}px`}
                borderRadius={30}
                style={{ background: darkMode ? '#0F0F15' : '#F8F0EC' }}
            >
                <Typography variant="h2" color="textPrimary" style={{ marginBottom: 24, color: darkMode && '#FFFFFF' }}>
                    {getLanguage().leaveCommentOnThisPost}
                </Typography>
                <TextEditor onChange={onContentChange} />
                <Button
                    variant="contained"
                    color="primary"
                    style={{ background: page?.pageColor, width: 50, marginTop: bigSize ? 16 : 8 }}
                    onClick={handlePostComment}
                >
                    {getLanguage().post}
                </Button>
            </Box>
            {/* comments */}
            <Box
                display="flex"
                flexDirection="column"
                padding={`0px ${bigSize ? 30 : 10}px`}
                mt={bigSize ? 8 : 5}
            >
                <Typography variant="h3" color="textPrimary" style={{ marginBottom: 10, fontWeight: 600, color: darkMode && '#FFFFFF' }}>
                    {`${comments.length || getLanguage().no} ${getLanguage().comments}`}
                </Typography>
                <Box style={{ overflowX: 'auto' }}>
                    {
                        comments.map((comment) => (
                            <CommentComponent data={comment} key={comment.uid} darkMode={props.darkMode} />
                        ))
                    }
                </Box>
                {/* load more */}
                {
                    Object.keys(commentMap).length && existMoreComments
                        ? <Typography variant="h6" color="primary" style={{ marginTop: 12, fontWeight: 600, cursor: 'pointer' }} onClick={handleLoadMore}>
                            {getLanguage().loadMoreComments}
                        </Typography>
                        : ''
                }
            </Box>
        </Box>
    )
}


const useStyles = makeStyles((theme) => ({
    root: props => ({
        maxWidth: 950,
        padding: '0 10px',
        margin: "0 auto",
        marginTop: theme.spacing(12),
        marginBottom: theme.spacing(11),
        [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing(5),
            marginBottom: theme.spacing(5),
        },
        '& .MuiInputBase-root': {
            // @ts-ignore
            background: props.darkMode ? '#181820' : 'white',
        }
    }),
}));

import React, { useContext, useState } from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { useWindowSize } from '../../utils/client/use-window-size';
import { PageContext } from '../../utils/client/page-state';
import ContentSection, {
    ContentHeader,
    ContentImageRow,
    ContentTextBlock,
    ContentTextImageLeft,
    ContentTextImageRight,
    ContentTripleImageCol,
    ContentTypes,
    ContentVideoRowEmbed,
    ContentVideoBlock
} from '../../models/content-section';
import ImgsViewer from '../../components/imgs-viewer';
import { getAllImages } from '../../utils/helpers';
import { VideoPlayer } from '../../components/video-player';

const SectionHeader = (props: {
    section?: ContentSection<ContentHeader>
}) => {
    const section = props?.section;
    const size = useWindowSize();

    return (
        <Typography
            style={{ marginTop: size.width > 599 ? 48 : 24, textAlign: 'center', fontWeight: 600 }}
            component="div"
            dangerouslySetInnerHTML={{ __html: section?.content.text.html }}
        />
    )
}

const SectionTextBlock = (props: {
    section?: ContentSection<ContentTextBlock>
}) => {
    const section = props?.section;
    const size = useWindowSize();

    return (
        <Typography
            style={{ marginTop: size.width > 599 ? 48 : 24 }}
            dangerouslySetInnerHTML={{ __html: section?.content.text.html }}
        />
    )
}

const SectionTextImageLeft = (props: {
    section?: ContentSection<ContentTextImageLeft>,
    onImgClick?: (url: string) => void
}) => {
    const section = props?.section;
    const size = useWindowSize();

    return (
        <Box
            display={size.width > 599 ? 'grid' : 'flex'}
            flexDirection="column"
            gridTemplateColumns="minmax(0px, 400px) minmax(50%, 1fr)"
            gridGap={size.width > 599 ? 64 : 32}
            mt={size.width > 599 ? 10 : 6}
        >
            <img src={section?.content.image.url} onClick={() => props.onImgClick(section?.content.image.url)} />
            <Typography
                style={{ alignSelf: 'center' }}
                dangerouslySetInnerHTML={{ __html: section?.content.text.html }}
            />
        </Box>
    )
}

const SectionTextImageRight = (props: {
    section?: ContentSection<ContentTextImageLeft>,
    onImgClick?: (url: string) => void
}) => {
    const section = props?.section;
    const size = useWindowSize();

    return (
        <Box
            display={size.width > 599 ? 'grid' : 'flex'}
            flexDirection="column"
            gridTemplateColumns="minmax(50%, 1fr) minmax(0px, 400px)"
            gridGap={size.width > 599 ? 64 : 32}
            mt={size.width > 599 ? 10 : 6}
        >
            <Typography
                style={{ alignSelf: 'center' }}
                dangerouslySetInnerHTML={{ __html: section?.content.text.html }}
            />
            <img src={section?.content.image.url} onClick={() => props.onImgClick(section?.content.image.url)} />
        </Box>
    )
}

const CustomRatioImage = (props: {
    url?: string,
    onClick?: () => void
}) => {
    return (
        <Box paddingTop={`${9 * 100 / 16}%`} position="relative">
            <img src={props?.url ?? ''} style={{ position: 'absolute', top: 0, left: 0, height: '100%' }} onClick={props.onClick} />
        </Box>
    )
}

const SectionImageRow = (props: {
    section?: ContentSection<ContentImageRow>,
    onImgClick?: (url: string) => void
}) => {
    const section = props?.section;
    const size = useWindowSize();

    return (
        <Box mt={size.width > 599 ? 10 : 4}>
            <CustomRatioImage url={section?.content.image.url} onClick={() => props.onImgClick(section?.content.image.url)} />
        </Box>
    )
}

const SectionTripleImageCol = (props: {
    section?: ContentSection<ContentTripleImageCol>,
    onImgClick?: (url: string) => void
}) => {
    const section = props?.section;
    const size = useWindowSize();
    return (
        <Box mt={size.width > 599 ? 10 : 4}>
            <CustomRatioImage url={section?.content?.images?.[0]?.url} onClick={() => props.onImgClick(section?.content?.images?.[0]?.url)} />
            <Box
                display={size.width > 599 ? 'grid' : 'flex'}
                flexDirection="column"
                gridTemplateColumns="1fr 1fr"
                gridGap={8}
                mt={1}
            >
                <CustomRatioImage url={section?.content?.images?.[1]?.url} onClick={() => props.onImgClick(section?.content?.images?.[1]?.url)} />
                <CustomRatioImage url={section?.content?.images?.[2]?.url} onClick={() => props.onImgClick(section?.content?.images?.[2]?.url)} />
            </Box>
        </Box>
    )
}

const SectionVideoRowEmbedOnly = (props: {
    section?: ContentSection<ContentVideoRowEmbed>
}) => {
    const section = props?.section;
    const size = useWindowSize();

    return (
        <Box paddingTop='56.25%' position="relative" mt={size.width > 599 ? 6 : 3}>
            <iframe
                src={section?.content.link}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', objectFit: 'cover' }}
            />
        </Box>
    )
}

const SectionVideoBlock = (props: {
    section?: ContentSection<ContentVideoBlock>
}) => {
    const section = props?.section;
    const size = useWindowSize();

    return (
        <Box mt={size.width > 599 ? 6 : 3}>
            <VideoPlayer src={section?.content?.video?.url} />
            <Box mt={2}>
                <Typography variant="h4" color="textPrimary" gutterBottom>{section?.content?.title || ''}</Typography>
                <Typography
                    color="textSecondary"
                    variant='h6'
                    dangerouslySetInnerHTML={{ __html: section?.content?.text?.html || '' }}
                />
            </Box>
        </Box>
    )
}

export default function Contents(props: {
    darkMode?: boolean
}) {
    const [currImg, setCurrImg] = useState<string>('')
    const [openImgView, setOpenImgView] = useState<boolean>(false)
    const pageCtx = useContext(PageContext);
    const page = pageCtx.pageState.page;
    const classes = useStyles({ ...props, pageColor: page?.pageColor });
    // check last uri
    const urls = window.location.href.split('/');
    const last = urls[urls.length - 1];
    // parse the content sections according to the last uri
    let contentSections = (last === 'preview' ? page?.contentDraftSections : page?.contentSections) ?? [] as ContentSection<ContentTypes>[];

    // need to remove the first header section since it was used in the page big title.
    let count = 0;
    contentSections = contentSections.filter((section) => {
        if (section.type === 'header') {
            count++;
            if (count === 1) return false;
        }
        return true;
    })

    const handleSelectImage = (url) => {
        setOpenImgView(() => true)
        setCurrImg(() => url)
    }

    return (
        <Box
            display="flex"
            alignItems="center"
            flexDirection="column"
            className={classes.root}
            style={{ color: props?.darkMode && '#95B9CA' }}
        >
            {
                contentSections.map((section) => {
                    let block = null;
                    switch (section?.type) {
                        case 'header':
                            block = <SectionHeader section={section as ContentSection<ContentHeader>} />
                            break;
                        case 'text-block':
                            block = <SectionTextBlock section={section as ContentSection<ContentTextBlock>} />
                            break;
                        case 'text-image-right':
                            block = <SectionTextImageRight section={section as ContentSection<ContentTextImageRight>} onImgClick={handleSelectImage} />
                            break;
                        case 'text-image-left':
                            block = <SectionTextImageLeft section={section as ContentSection<ContentTextImageLeft>} onImgClick={handleSelectImage} />
                            break;
                        case 'image-row':
                            block = <SectionImageRow section={section as ContentSection<ContentImageRow>} onImgClick={handleSelectImage} />
                            break;
                        case 'triple-image-col':
                            block = <SectionTripleImageCol section={section as ContentSection<ContentTripleImageCol>} onImgClick={handleSelectImage} />
                            break;
                        case 'video-row-embed-only':
                            block = <SectionVideoRowEmbedOnly section={section as ContentSection<ContentVideoRowEmbed>} />
                        case 'video-block':
                            block = <SectionVideoBlock section={section as ContentSection<ContentVideoBlock>} />
                            break;
                        default:
                            block = null;
                            break;
                    }
                    return <Box key={section?.uid} width="100%">{block}</Box>
                })
            }

            {
                openImgView &&
                <ImgsViewer
                    images={getAllImages(contentSections)}
                    currImg={currImg}
                    onClose={() => setOpenImgView(() => false)}
                />
            }
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: props => ({
        maxWidth: 1024,
        margin: '0 auto',
        padding: '0 24px',
        color: theme.palette.text.secondary,
        marginBottom: `${theme.spacing(7)}px !important`,
        [theme.breakpoints.down('xs')]: {
            marginBottom: `${theme.spacing(4)}px !important`,
        },
        '& p': {
            margin: 0,
            lineHeight: '30px',
            wordBreak: 'break-word',
            fontSize: 18,
            [theme.breakpoints.down('xs')]: {
                fontSize: 14,
            },
        },
        '& a': {
            // @ts-ignore
            color: props?.pageColor
        },
        '& ul': {
            paddingInlineStart: 30,
        }
    }),
}));

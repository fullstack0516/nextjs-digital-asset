import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, makeStyles, Typography, Button, Input, Hidden, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx';
import { getLanguage } from '../../langauge/language';
import { dispatchPage, PageContext, PageStoreProvider } from '../../utils/client/page-state';
import { pageSectionAdd, pageSectionDelete, pageSectionPublish, pageSectionsReorder, pageSectionUpdate, updatePage } from '../../utils/client/page-action';
import ContentSection, {
    ContentHeader,
    ContentImageRow,
    ContentSectionTypes,
    ContentTextBlock,
    ContentTextImageLeft,
    ContentTextImageRight,
    ContentTripleImageCol,
    ContentTypes,
    ContentVideoBlock,
    ContentVideoRowEmbed
} from '../../models/content-section';
import { Site } from '../../models/site';
import { Page } from '../../models/page';
import UploadImageEditor from '../../components/upload-image-editor';
import OptionsMenu from '../../components/options-menu';
import GroupMenu from '../../components/group-menu';
import SvgMobile from '../../../public/mobile.svg';
import SvgDesktop from '../../../public/desktop.svg';
import SvgTablet from '../../../public/tablet.svg';
import loadable from '@loadable/component';
import CustomHeader from '../../components/custom-header';
import { Player } from '@lottiefiles/react-lottie-player';
import fetching from '../../../public/lottie/loading-fetch.json';
import notView from '../../../public/lottie/not-view.json';
import SvgLeftArrow from '../../../public/left-arrow.svg';
import { useWindowSize } from '../../utils/client/use-window-size';
import { fetchPageViaUrlSF, fetchSiteViaUrlSF, server } from '../../utils/server/graphql_server';
import { dispatchModal } from '../../utils/client/modal-state';
import ModalError, { ModalAlert } from '../../components/modal-error';
import { getAllImages, getImageUrls, getAllProcessingVideos, bytesToSize } from '../../utils/helpers';
import { getAllTexts } from '../../utils/helpers';
import UploadFile from '../../components/upload-file';
import { VideoPlayer } from '../../components/video-player';
import { uploadAndProcess } from '../../utils/client/user-actions';
import { greyImage } from '../../variables';
import Loading from '../../components/loading';
import Tag from '../../components/tag';

const TextEditor = loadable(() => import('../../components/rich-text-editor'));
const PageEditorSidebar = loadable(() => import('./sidebar'));

const SectionWrapper = (props: {
    children?: any,
    style?: React.HTMLAttributes<HTMLDivElement>['style'];
    section?: ContentSection<ContentTypes>
}) => {
    const [isHover, setIsHover] = useState<boolean | undefined>(false);
    const [openSectionMenu, setOpenSectionMenu] = useState<boolean | undefined>(false);
    const pageCtx = useContext(PageContext);
    const deviceMode = pageCtx.pageState.deviceMode;
    const pageUid = pageCtx.pageState.page?.uid;
    const contentDraftSections = pageCtx.pageState.page?.contentDraftSections ?? [] as ContentSection<ContentTypes>[];
    const classes = useStyles();
    const sectionRef = useRef();
    const sections = [
        // { onClick: () => handleAddNewSection('header'), text: 'Header' },
        { onClick: () => handleAddNewSection('text-block'), text: 'Text-Block' },
        { onClick: () => handleAddNewSection('text-image-right'), text: 'Text-Image-Right' },
        { onClick: () => handleAddNewSection('text-image-left'), text: 'Text-Image-Left' },
        { onClick: () => handleAddNewSection('image-row'), text: 'Image-Row' },
        { onClick: () => handleAddNewSection('triple-image-col'), text: 'Triple-Image-Col' },
        { onClick: () => handleAddNewSection('video-row-embed-only'), text: 'Video-Row-Embed-Only' },
        { onClick: () => handleAddNewSection('video-block'), text: 'Video-Block' }
    ]

    const handleRemoveByIcon = async () => {
        await pageSectionDelete(pageUid, props?.section?.uid);
    }

    const handleSectionMoveByArrow = (val) => async () => {
        const fromIndex = contentDraftSections.findIndex((section) => section.uid === props?.section?.uid);
        let toIndex = fromIndex + val;
        if (toIndex < 0) {
            toIndex = contentDraftSections.length - 1;
        }
        if (toIndex > contentDraftSections.length - 1) {
            toIndex = 0;
        }
        await pageSectionsReorder(pageUid, fromIndex, toIndex);
    }

    const handleAddNewSection = async (type: ContentSectionTypes) => {
        const index = contentDraftSections.findIndex((section) => section.uid === props?.section?.uid);
        // add the new section at the following position of current section
        await pageSectionAdd(pageUid, type, index + 1);
        setOpenSectionMenu(false);
    }

    return (
        <Box
            mb={deviceMode === 'mobile' ? 1 : 2}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            position="relative"
            style={{
                outline: isHover && 'dashed 2px #FF7534',
                padding: deviceMode === 'mobile' ? 20 : 30,
                ...props?.style
            }}
            className={classes.sectionWrapper}
        >
            {props?.children}
            {
                isHover &&
                <>
                    <Box position="absolute" display="flex" top={-16} right={2} margin="0 10px">
                        <Box className="action" onClick={handleSectionMoveByArrow(-1)} mr={1}>
                            <ExpandLessIcon />
                        </Box>
                        <Box className="action" onClick={handleSectionMoveByArrow(1)} mr={2.5}>
                            <ExpandMoreIcon />
                        </Box>
                        <Box className="action" onClick={handleRemoveByIcon}>
                            <DeleteIcon />
                        </Box>
                    </Box>
                    <Box position="absolute" display="flex" bottom={0} right={"calc(50% - 15px)"}>
                        <Box className="action" onClick={() => setOpenSectionMenu(true)}>
                            <AddIcon ref={sectionRef} />
                        </Box>
                    </Box>
                </>
            }
            {
                openSectionMenu &&
                <OptionsMenu
                    anchorEl={sectionRef.current}
                    options={sections}
                    onClose={() => setOpenSectionMenu(false)}
                    open={openSectionMenu}
                    disableBottomMenus
                />
            }
        </Box>
    )
}

const HoverComponent = (props: {
    onEdit?: () => void,
    children?: any,
    hoverDisabled?: boolean,
    editButtonText?: string,
    style?: React.HTMLAttributes<HTMLDivElement>['style'];
}) => {
    const [isHover, setIsHover] = useState<boolean | undefined>(false);

    return (
        <Box
            position="relative"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            style={{ outline: !props?.hoverDisabled && isHover && 'dashed 2px #FF7534', ...props?.style }}
        >
            {props?.children}
            {
                !props?.hoverDisabled && isHover &&
                <Box
                    position="absolute"
                    height="100%"
                    width="100%"
                    top={0}
                    left={0}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Box
                        position="absolute"
                        height="100%"
                        width="100%"
                        style={{ background: '#FF7534', opacity: 0.4 }}
                    />
                    <Button color="primary" variant="contained" style={{ background: '#37474F' }} onClick={props?.onEdit}>
                        {props?.editButtonText || getLanguage().editText}
                    </Button>
                </Box>
            }
        </Box>
    )
}

const SectionHeader = (props: {
    section: ContentSection<ContentHeader>,
    onSectionTextUpdate: (newText: string) => void
}) => {
    const section = props?.section;
    const [isBlur, setIsBlur] = useState<boolean | undefined>(true);
    const pageCtx = useContext(PageContext);
    const deviceMode = pageCtx.pageState?.deviceMode;

    const sectionUpdate = async (markdown) => {
        props.onSectionTextUpdate(markdown)
        setIsBlur(true)
    }

    return (
        <SectionWrapper section={props?.section}>
            <HoverComponent onEdit={() => setIsBlur(false)} hoverDisabled={!isBlur}>
                {
                    isBlur ?
                        <Typography
                            color="textPrimary"
                            style={{
                                fontSize: deviceMode === 'mobile' ? 24 : 32,
                                minHeight: 40,
                                textAlign: 'center',
                            }}
                            dangerouslySetInnerHTML={{ __html: section?.content.text.html || 'Blog Post Title' }}
                        />
                        :
                        <TextEditor html={section.content.text.html} onBlur={sectionUpdate} />
                }
            </HoverComponent>
        </SectionWrapper>
    )
}

const SectionTextBlock = (props: {
    section: ContentSection<ContentTextBlock>,
    onSectionTextUpdate: (newText: string) => void
}) => {
    const section = props?.section;
    const [isBlur, setIsBlur] = useState<boolean | undefined>(true);
    const pageCtx = useContext(PageContext);
    const deviceMode = pageCtx.pageState?.deviceMode;

    const sectionUpdate = async (markdown) => {
        props.onSectionTextUpdate(markdown)
        setIsBlur(true)
    }

    return (
        <SectionWrapper section={props?.section}>
            <HoverComponent onEdit={() => setIsBlur(false)} hoverDisabled={!isBlur}>
                {
                    isBlur ?
                        <Typography
                            variant={deviceMode === 'mobile' ? "h5" : "h4"}
                            color="textSecondary"
                            style={{
                                lineHeight: '32px',
                                alignSelf: 'center',
                                minHeight: 40
                            }}
                            dangerouslySetInnerHTML={{ __html: section?.content.text.html || 'Text Block' }}
                        />
                        :
                        <TextEditor html={section.content.text.html} onBlur={sectionUpdate} />
                }
            </HoverComponent>
        </SectionWrapper>
    )
}

const SectionTextImageLeft = (props: {
    section: ContentSection<ContentTextImageLeft>,
    onEditImg: () => void,
    onSectionTextUpdate: (newText: string) => void
}) => {
    const section = props?.section;
    const [isBlur, setIsBlur] = useState<boolean | undefined>(true);
    const pageCtx = useContext(PageContext);
    const deviceMode = pageCtx.pageState?.deviceMode;

    const sectionUpdate = async (markdown) => {
        props.onSectionTextUpdate(markdown)
        setIsBlur(true)
    }

    return (
        <SectionWrapper style={{ background: 'white' }} section={props?.section}>
            <Box
                display={deviceMode === 'mobile' ? 'flex' : 'grid'}
                flexDirection="column"
                gridTemplateColumns="1fr 1fr"
                gridGap={deviceMode === 'mobile' ? 30 : 40}
            >
                <HoverComponent editButtonText={getLanguage().editImage} onEdit={props?.onEditImg}>
                    <img src={section?.content.image.url} />
                </HoverComponent>
                <HoverComponent onEdit={() => setIsBlur(false)} hoverDisabled={!isBlur}>
                    {
                        isBlur ?
                            <Typography
                                variant={deviceMode === 'mobile' ? "h5" : "h4"}
                                color="textSecondary"
                                style={{ lineHeight: '32px', alignSelf: 'center', minHeight: 40 }}
                                dangerouslySetInnerHTML={{ __html: section?.content.text.html || 'Text Block' }}
                            />
                            :
                            <TextEditor html={section.content.text.html} onBlur={sectionUpdate} />
                    }
                </HoverComponent>
            </Box>
        </SectionWrapper>
    )
}

const SectionTripleImageCol = (props: {
    section: ContentSection<ContentTripleImageCol>,
    onEditImg: (imagePosition: number) => void
}) => {
    const section = props?.section;
    const pageCtx = useContext(PageContext);
    const deviceMode = pageCtx.pageState?.deviceMode;

    return (
        <SectionWrapper style={{ background: 'white' }} section={props?.section}>
            <Box display="grid">
                <HoverComponent editButtonText={getLanguage().editImage} onEdit={() => props?.onEditImg(0)} style={{ paddingTop: '56.25%' }}>
                    <img src={section?.content?.images?.[0].url} style={{ position: 'absolute', top: 0, left: 0, }} />
                </HoverComponent>
                <Box
                    display={deviceMode === 'mobile' ? 'flex' : 'grid'}
                    flexDirection="column"
                    gridTemplateColumns="1fr 1fr"
                    gridGap={8}
                    mt={1}
                >
                    <HoverComponent editButtonText={getLanguage().editImage} onEdit={() => props?.onEditImg(1)} style={{ paddingTop: '56.25%' }}>
                        <img src={section?.content?.images?.[1]?.url} style={{ position: 'absolute', top: 0, left: 0, }} />
                    </HoverComponent>
                    <HoverComponent editButtonText={getLanguage().editImage} onEdit={() => props?.onEditImg(2)} style={{ paddingTop: '56.25%' }}>
                        <img src={section?.content?.images?.[2]?.url} style={{ position: 'absolute', top: 0, left: 0, }} />
                    </HoverComponent>
                </Box>
            </Box>
        </SectionWrapper>
    )
}

const SectionTextImageRight = (props: {
    section: ContentSection<ContentTextImageLeft>,
    onEditImg: () => void,
    onSectionTextUpdate: (newText: string) => void
}) => {
    const section = props?.section;
    const [isBlur, setIsBlur] = useState<boolean | undefined>(true);
    const pageCtx = useContext(PageContext);
    const deviceMode = pageCtx.pageState?.deviceMode;

    const sectionUpdate = async (markdown) => {
        props.onSectionTextUpdate(markdown)
        setIsBlur(true)
    }

    return (
        <SectionWrapper style={{ background: 'white' }} section={props?.section}>
            <Box
                display={deviceMode === 'mobile' ? 'flex' : 'grid'}
                flexDirection="column"
                gridTemplateColumns="1fr 1fr"
                gridGap={deviceMode === 'mobile' ? 30 : 40}
            >
                <HoverComponent onEdit={() => setIsBlur(false)} hoverDisabled={!isBlur}>
                    {
                        isBlur ?
                            <Typography
                                variant={deviceMode === 'mobile' ? "h5" : "h4"}
                                color="textSecondary"
                                style={{ lineHeight: '32px', alignSelf: 'center', minHeight: 40 }}
                                dangerouslySetInnerHTML={{ __html: section?.content.text.html || 'Text Block' }}
                            />
                            :
                            <TextEditor html={section.content.text.html} onBlur={sectionUpdate} />
                    }
                </HoverComponent>
                <HoverComponent editButtonText={getLanguage().editImage} onEdit={props?.onEditImg}>
                    <img src={section?.content.image.url} />
                </HoverComponent>
            </Box>
        </SectionWrapper>
    )
}

const SectionImageRow = (props: {
    section: ContentSection<ContentImageRow>,
    onEditImg: () => void
}) => {
    const section = props?.section;

    return (
        <SectionWrapper style={{ background: 'white' }} section={props?.section}>
            <HoverComponent editButtonText={getLanguage().editImage} onEdit={props?.onEditImg} style={{ paddingTop: '56.25%' }}>
                <img src={section?.content.image.url} style={{ position: 'absolute', top: 0, left: 0, }} />
            </HoverComponent>
        </SectionWrapper>
    )
}

const SectionVideoRowEmbedOnly = (props: {
    section: ContentSection<ContentVideoRowEmbed>,
    onVideoSave: (link: string) => void
}) => {
    const classes = useStyles()
    const section = props?.section;
    const [open, setOpen] = useState<boolean>(false)
    const [videoLink, setvideoLink] = useState<string>(section?.content.link)

    function getId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        return (match && match[2].length === 11)
            ? match[2]
            : null;
    }

    const handleVideSave = async () => {
        if (videoLink && props?.onVideoSave) {
            const videoId = getId(videoLink)
            await props.onVideoSave(`https://www.youtube-nocookie.com/embed/${videoId}`)
        }
        setOpen(() => false);
    }

    return (
        <SectionWrapper style={{ background: 'white' }} section={props?.section}>
            <HoverComponent editButtonText={getLanguage().editVideo} onEdit={() => setOpen(true)} style={{ paddingTop: open ? 0 : '56.25%' }} hoverDisabled={open}>
                {
                    !open ?
                        <iframe
                            src={section?.content.link}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', objectFit: 'cover' }}
                            allowFullScreen
                        /> :
                        <Box className={classes.select} mb={3}>
                            <Typography variant="h6" color="textPrimary">{getLanguage().videoUrl}</Typography>
                            <Box display="flex" mt={1}>
                                <Input name="videoUrl" onChange={(e) => setvideoLink(e.target.value)} value={videoLink} />
                                <Button variant="contained" color="primary" onClick={handleVideSave}>{getLanguage().save}</Button>
                            </Box>
                        </Box>
                }
            </HoverComponent>
        </SectionWrapper>
    )
}

const SectionVideoBlock = (props: {
    section?: ContentSection<ContentVideoBlock>,
    onVideoSave?: ({ newTitle, newVideoUrl, processing }: { newTitle: string, newVideoUrl: string, processing: boolean }) => void,
    onSectionTextUpdate: (newText: string) => void
}) => {
    const classes = useStyles()
    const section = props?.section;
    const pageCtx = useContext(PageContext);
    const [open, setOpen] = useState<boolean>(false)
    const [isVideoUploading, setIsVideoUploading] = useState(false);
    const [progress, setProgress] = useState(0.0);

    const [videoTitle, setVideoTitle] = useState<string>(section?.content.title);
    const [videoFile, setVideoFile] = useState<File>();

    const sectionUpdate = async (markdown) => {
        props.onSectionTextUpdate(markdown);
    }

    const onUploadProgress = (progress) => {
        setProgress(progress.loaded / progress.total)
    }

    const handleVideoSave = async () => {
        if (!videoFile) {
            return dispatchModal({
                type: 'add',
                modal: <ModalError text={getLanguage().videoFileMissing} />,
            });
        }

        if (videoFile && videoFile.size && props?.onVideoSave) {
            if (videoFile.size > 1 * 1024 * 1024 * 1024) { // Limit is 2 GB for now
                return dispatchModal({
                    type: 'add',
                    modal: <ModalError text={getLanguage().videoMaxSizeError} />,
                });
            }

            try {
                setIsVideoUploading(true);
                const { videoUrl } = await uploadAndProcess(
                    {
                        fileName: videoFile.name,
                        fileType: videoFile.type,
                        pageUid: pageCtx.pageState.page?.uid,
                        sectionUid: section?.uid,
                        file: videoFile
                    },
                    onUploadProgress
                );
                await props.onVideoSave({ newTitle: videoTitle, newVideoUrl: videoUrl, processing: true })
                dispatchModal({
                    type: 'add',
                    modal: <ModalAlert text={getLanguage().videoProcessingContactAdmin} />,
                });
            } catch (error) {
                dispatchModal({
                    type: 'add',
                    modal: <ModalError text={getLanguage().videoUploadError} />,
                });
            } finally {
                setIsVideoUploading(false);
            }
        }
        setOpen(false);
    }

    return (
        <SectionWrapper style={{ background: 'white' }} section={props?.section}>
            {isVideoUploading && (
                <Box
                    position='fixed'
                    top='0'
                    left='0'
                    width='100vw'
                    height='100vh'
                    zIndex={100000000}
                    style={{ backdropFilter: isVideoUploading && 'blur(2px)' }}
                >
                    <Box position='fixed' top='50%' left='50%' style={{ transform: 'translate(-50%, -50%)' }}>
                        <Loading size={200} />
                        {videoFile && (
                            <Box color='#FF7534' fontSize={18} fontWeight={600} maxWidth={200} textAlign='center'>
                                Uploading - {(progress * 100).toFixed(2)}%
                                <br />({bytesToSize(progress * videoFile.size)} of {bytesToSize(videoFile.size)})
                            </Box>
                        )}
                    </Box>
                </Box>
            )}
            <HoverComponent editButtonText={getLanguage().editVideo} onEdit={() => setOpen(true)} hoverDisabled={open}>
                {!open ? (
                    <Box style={{ position: 'relative' }}>
                        <VideoPlayer src={section?.content?.video?.url ?? ''} />

                        <Box style={{ position: 'absolute', top: 12, right: 12 }}>
                            {section?.content?.processing && <Tag name={getLanguage().processing} darkMode highlighted />}
                        </Box>

                        <Box mt={2}>
                            <Typography variant='h4' color='textPrimary' gutterBottom>
                                {section?.content?.title || getLanguage().videoTitle}
                            </Typography>
                            <Typography
                                color='textSecondary'
                                variant='h6'
                                dangerouslySetInnerHTML={{ __html: section?.content?.text?.html || getLanguage().videoDescription }}
                            />
                        </Box>
                    </Box>
                ) : (
                    <Box className={classes.select} mb={1}>
                        <Typography gutterBottom variant='h6' color='textPrimary'>
                            {getLanguage().videoTitle} ({getLanguage().optional})
                        </Typography>
                        <Input name='videoUrl' onChange={(e) => setVideoTitle(e.target.value)} value={videoTitle} />
                        <Box m={2} />
                        <Typography gutterBottom variant='h6' color='textPrimary'>
                            {getLanguage().videoDescription} ({getLanguage().optional})
                        </Typography>
                        <TextEditor html={section?.content?.text?.html} onBlur={sectionUpdate} />
                        <Box m={2} />
                        <Typography gutterBottom variant='h6' color='textPrimary'>
                            {getLanguage().importVideo}
                        </Typography>
                        <UploadFile file={videoFile} setFile={setVideoFile} />
                        <Box display='flex' justifyContent='space-between' mt={3}>
                            <Button
                                variant='contained'
                                color='secondary'
                                onClick={() => setOpen(false)}
                                disabled={isVideoUploading}
                            >
                                {getLanguage().cancel}
                            </Button>
                            <Button variant='contained' color='primary' onClick={handleVideoSave} disabled={isVideoUploading}>
                                {getLanguage().save}
                            </Button>
                        </Box>
                    </Box>
                )}
            </HoverComponent>
        </SectionWrapper>
    );
}

const DraftContentHeader = () => {
    const classes = useStyles();
    type Device = 'desktop' | 'tablet' | 'mobile';
    const pageCtx = useContext(PageContext);
    const deviceMode = pageCtx.pageState?.deviceMode;
    const devices = ['desktop', 'tablet', 'mobile'] as Device[];
    const [isPublishing, setIsPublishing] = useState<boolean>(false);
    const [isOpen, setOpen] = useState<boolean>(false);
    const [isUnpublishing, setIsUnpublishing] = useState<boolean>(false);
    const page = pageCtx.pageState.page
    const site = pageCtx.pageState.site
    const size = useWindowSize()
    const ref = useRef()

    useEffect(() => {
        const processings = getAllProcessingVideos(page.contentDraftSections)
        if (processings.length) {
            dispatchModal({
                type: 'add',
                modal: <ModalAlert text={getLanguage().videoProcessingContactAdmin} />,
            });
        }
    }, [])

    const handleDevice = (device) => () => {
        pageCtx.dispatchPage({ type: 'setDevice', data: device })
    }

    const handlePreview = () => {
        window.open(`/pages/${site.url}/${page.url}/preview`, '_blank').focus();
    }

    const handlePublish = async () => {
        if (page.contentDraftSections.length === 0) {
            return dispatchModal({
                type: 'add',
                modal: <ModalError text="This page doesn't include any sections. Cannot publish this page. Add sections to continue." />
            })
        }

        const processings = getAllProcessingVideos(page.contentDraftSections)
        if (processings.length) {
            return dispatchModal({
                type: 'add',
                modal: <ModalError text="This page includes videos that are still processing. Cannot publish this page. Please wait until the processing is complete or contact admin if it has taken over an hour." />
            })
        }

        const texts = getAllTexts(page.contentDraftSections)
        if (texts.length === 0) {
            return dispatchModal({
                type: 'add',
                modal: <ModalError text="This page doesn't include any texts. Cannot publish this page. Add contents to continue." />
            })
        }

        const images = getAllImages(page.contentDraftSections)
        if (images.length === 0) {
            return dispatchModal({
                type: 'add',
                modal: <ModalError text="This page doesn't include any image. Cannot publish this page. Add atleast one image to continue." />
            })
        }

        const imageUrls = getImageUrls(page.contentDraftSections)
        if (imageUrls.includes(greyImage)) {
            return dispatchModal({
                type: 'add',
                modal: <ModalError text="This page contains image placeholders. Cannot publish this page. Replace all image placeholders with image to continue." />
            })
        }

        setIsPublishing(() => true);
        const res = await pageSectionPublish(page.uid);
        setIsPublishing(() => false)
        if (res) {
            dispatchPage({ type: 'setPage', data: res });
            window.location.href = `/my-sites/${site.url}`
        }

    }

    const handleUnpublish = async () => {
        setIsUnpublishing(() => true)
        await updatePage({ pageToUpdateUid: page.uid, isPublished: false })
        setIsUnpublishing(() => false)
    }

    const handleClose = () => {
        setOpen(false);
    };

    let publishingOptions = [
        {
            id: 'publish',
            icon: isPublishing ?
                <Player
                    autoplay
                    loop
                    src={JSON.stringify(fetching)}
                    style={{ height: 35, width: 35, marginRight: 8 }}
                /> : '',
            text: `${isPublishing ? getLanguage().publishing : getLanguage().publish}`,
            onClick: isPublishing ? () => { } : handlePublish
        },
    ]
    if (page?.isPublished) {
        publishingOptions = [
            ...publishingOptions,
            {
                id: 'unpublish',
                icon: isUnpublishing ?
                    <Player
                        autoplay
                        loop
                        src={JSON.stringify(fetching)}
                        style={{ height: 35, width: 35, marginRight: 8 }}
                    /> : '',
                text: `${isUnpublishing ? getLanguage().unPublishing : getLanguage().unPublish}`,
                onClick: isUnpublishing ? () => { } : handleUnpublish
            },
        ]
    }
    const sizeOptions = [
        { id: 'desktop', icon: <SvgDesktop width={15} height={15} fill={deviceMode === 'desktop' ? '#FF7534' : 'gray'} />, text: "Desktop", onClick: handleDevice('desktop') },
        { id: 'tablet', icon: <SvgTablet width={15} height={15} fill={deviceMode === 'tablet' ? '#FF7534' : 'gray'} />, text: "Tablet", onClick: handleDevice('tablet') },
        { id: 'mobile', icon: <SvgMobile width={15} height={15} fill={deviceMode === 'mobile' ? '#FF7534' : 'gray'} />, text: "Mobile", onClick: handleDevice('mobile') }
    ]

    const menuOptions = [
        { title: getLanguage().publishing, options: publishingOptions },
        { title: 'Preview Sizes', options: sizeOptions },
    ]

    return (
        <Box
            className={classes.header}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            boxShadow="0px 1px 1px #E7E7EF"
            p={4}
        >
            <Box display="flex" alignItems="center">
                <Typography variant="h5" color="textPrimary">
                    {getLanguage().draftContent}&nbsp;
                </Typography>
                (&nbsp;<Typography variant="h5" color="textSecondary" className="turncate" style={{ maxWidth: 250 }}>{page?.url}</Typography>&nbsp;)
                <Typography variant="h5" color="primary" onClick={handlePreview} style={{ marginLeft: 8, textDecoration: 'underline', cursor: 'pointer' }}>
                    {getLanguage().preview}
                </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
                {
                    size.width > 1276 ?
                        <>
                            <Button variant="contained" color="primary" onClick={handlePublish} disabled={isPublishing} style={{ padding: '0px 20px' }}>
                                {
                                    isPublishing &&
                                    <Player
                                        autoplay
                                        loop
                                        src={JSON.stringify(fetching)}
                                        style={{ height: 35, width: 35, marginRight: 8 }}
                                    />
                                }
                                {isPublishing ? getLanguage().publishing : getLanguage().publish}
                            </Button>
                            {
                                page?.isPublished &&
                                <Button variant="contained" color="secondary" onClick={handleUnpublish} disabled={isUnpublishing} style={{ marginLeft: 8, padding: '0px 20px' }}>
                                    {
                                        isUnpublishing &&
                                        <Player
                                            autoplay
                                            loop
                                            src={JSON.stringify(fetching)}
                                            style={{ height: 35, width: 35, marginRight: 8 }}
                                        />
                                    }
                                    {isUnpublishing ? getLanguage().unPublishing : getLanguage().unPublish}
                                </Button>
                            }
                            {
                                devices.map((device) =>
                                    <Tooltip title={getLanguage()[device]} placement="bottom" key={device}>
                                        <Box
                                            className={clsx(classes.deviceIcon, deviceMode === device ? 'selected' : 'no-selected')}
                                            onClick={handleDevice(device)}
                                        >
                                            {
                                                device === 'desktop' &&
                                                <SvgDesktop
                                                    fill={deviceMode === 'desktop' ? 'white' : 'gray'}
                                                    width={18.33}
                                                    height={16.77}
                                                />
                                            }
                                            {
                                                device === 'tablet' &&
                                                <SvgTablet
                                                    fill={deviceMode === 'tablet' ? 'white' : 'gray'}
                                                    width={18.33}
                                                    height={16.77}
                                                />
                                            }
                                            {
                                                device === 'mobile' &&
                                                <SvgMobile
                                                    fill={deviceMode === 'mobile' ? 'white' : 'gray'}
                                                    width={18.33}
                                                    height={16.77}
                                                />
                                            }
                                        </Box>
                                    </Tooltip>
                                )
                            }
                        </>
                        :
                        <Button variant="text" onClick={() => setOpen(() => true)} className={classes.options}>
                            <Typography variant="h5" color="textSecondary" ref={ref}>Site Options</Typography>
                        </Button>
                }
            </Box>
            <GroupMenu open={isOpen} onClose={handleClose} anchorEl={ref.current} groups={menuOptions} />
        </Box>
    )
}

const DraftPreview = () => {
    const pageCtx = useContext(PageContext);
    const contentDraftSections = pageCtx.pageState.page?.contentDraftSections ?? [] as ContentSection<ContentTypes>[]
    const [openImgEditor, setOpenImgEditor] = useState<boolean | undefined>(false);
    const [selectedSection, setSelectedSection] = useState<string | undefined>(null);
    const [imagePosition, setImagePosition] = useState<number | undefined>(null);
    const [resizeHeightBackend, setResizeHeightBackend] = useState<number | undefined>(null);
    const [imgRatio, setImgRatio] = useState<number | undefined>(null);
    const deviceMode = pageCtx.pageState?.deviceMode;

    const handleOpenImgEditor = (section: ContentSection<ContentTypes>, ratio?: number, imgPos?: number) => {
        if (['image-row', 'triple-image-col'].includes(section.type)) {
            setResizeHeightBackend(850)
        }
        else {
            setResizeHeightBackend(null)
        }
        setOpenImgEditor(true);
        setSelectedSection(section.uid);
        setImagePosition(imgPos)
        setImgRatio(ratio);
    }

    const updatePhoto = async (url) => {
        if (url) {
            await pageSectionUpdate({
                pageUid: pageCtx.pageState.page?.uid,
                contentSectionUid: selectedSection,
                newImageUrl: url,
                nthImage: imagePosition
            });
        }
    }

    const handleUpdateEmbedVideo = async (newVideoUrl, sectionUid) => {
        if (newVideoUrl) {
            await pageSectionUpdate({
                pageUid: pageCtx.pageState.page?.uid,
                contentSectionUid: sectionUid,
                newVideoUrl
            });
        }
    }

    const handleUpdateVideo = async ({ newVideoUrl, newTitle, processing }, sectionUid) => {
        if (newVideoUrl) {
            await pageSectionUpdate({
                pageUid: pageCtx.pageState.page?.uid,
                contentSectionUid: sectionUid,
                newVideoUrl,
                newTitle,
                processing,
            });
        }
    }

    const handleUpdateText = (sectionUid) => async (newText) => {
        await pageSectionUpdate({
            pageUid: pageCtx.pageState.page?.uid,
            contentSectionUid: sectionUid,
            newText: newText || ' '
        });
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" className="scrollable" padding="48px 36px">
            <Box maxWidth={1024} width="100%" display="flex" flexDirection="column" alignItems="center">
                {
                    contentDraftSections.map((section) => {
                        let block = null;
                        switch (section?.type) {
                            case 'header':
                                block = <SectionHeader section={section as ContentSection<ContentHeader>} onSectionTextUpdate={handleUpdateText(section.uid)} />
                                break;
                            case 'text-block':
                                block = <SectionTextBlock section={section as ContentSection<ContentTextBlock>} onSectionTextUpdate={handleUpdateText(section.uid)} />
                                break;
                            case 'text-image-right':
                                block = <SectionTextImageRight section={section as ContentSection<ContentTextImageRight>} onEditImg={() => handleOpenImgEditor(section)} onSectionTextUpdate={handleUpdateText(section.uid)} />
                                break;
                            case 'text-image-left':
                                block = <SectionTextImageLeft section={section as ContentSection<ContentTextImageLeft>} onEditImg={() => handleOpenImgEditor(section)} onSectionTextUpdate={handleUpdateText(section.uid)} />
                                break;
                            case 'image-row':
                                block = <SectionImageRow section={section as ContentSection<ContentImageRow>} onEditImg={() => handleOpenImgEditor(section, 16 / 9)} />
                                break;
                            case 'triple-image-col':
                                block = <SectionTripleImageCol section={section as ContentSection<ContentTripleImageCol>} onEditImg={(imgPos) => handleOpenImgEditor(section, 16 / 9, imgPos)} />
                                break;
                            case 'video-row-embed-only':
                                block = <SectionVideoRowEmbedOnly section={section as ContentSection<ContentVideoRowEmbed>} onVideoSave={(link) => handleUpdateEmbedVideo(link, section.uid)} />
                                break;
                            case 'video-block':
                                block = <SectionVideoBlock section={section as ContentSection<ContentVideoBlock>} onVideoSave={({ newTitle, newVideoUrl, processing, }) => handleUpdateVideo({ newTitle, newVideoUrl, processing }, section.uid)} onSectionTextUpdate={handleUpdateText(section.uid)} />
                                break;
                            default:
                                block = null;
                                break;
                        }
                        return (
                            <Box key={section?.uid} width={deviceMode === 'mobile' ? 500 : deviceMode === 'desktop' ? '100%' : 800}>
                                {block}
                            </Box>
                        )
                    })
                }
                {/* upload-image editor dialog */}
                {
                    openImgEditor &&
                    <UploadImageEditor
                        open={openImgEditor}
                        close={() => setOpenImgEditor(false)}
                        onSave={updatePhoto}
                        cropMode="square"
                        ratio={imgRatio}
                        resizeHeightBackend={resizeHeightBackend}
                    />
                }
            </Box>
        </Box>
    )
}

export default function PageEditor(props: {
    page: Page,
    site: Site
}) {
    const classes = useStyles();
    const { site, page } = props;

    return (
        <PageStoreProvider page={page} site={site}>
            <Hidden smDown>
                <CustomHeader title={`Awake - Edit ${site.name}-${page.title}`} />
                <Box display="grid" gridTemplateColumns='350px 1fr' height="100%" className={classes.root}>
                    {/* left sidebar panel */}
                    <PageEditorSidebar />

                    {/* draft content */}
                    <Box display="grid" gridTemplateRows="83px 1fr" maxHeight='100vh'>
                        {/* draft content header */}
                        <DraftContentHeader />

                        {/* draft content preview */}
                        <DraftPreview />
                    </Box>
                </Box>
            </Hidden>
            <Hidden mdUp>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                    pl={2}
                    pr={2}
                    position="relative"
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        position="absolute"
                        top={15}
                        left={15}
                        onClick={() => window.location.href = "/my-sites/"}
                        style={{ cursor: 'pointer' }}
                    >
                        <SvgLeftArrow width={11} height={11} />
                        <Typography variant="h6" color="textSecondary" style={{ marginLeft: 10 }}>{getLanguage().backToPages}</Typography>
                    </Box>
                    <Player autoplay loop src={JSON.stringify(notView)} style={{ width: 160, }} />
                    <Typography variant="h3" color="primary" style={{ textAlign: 'center', wordBreak: 'break-word' }}>Page editor is only supported on larger screens</Typography>
                </Box>
            </Hidden>

        </PageStoreProvider>
    );
}

export async function getServerSideProps(context) {
    const { req, res, query } = context
    await server({ req, res });
    const [siteUrl, pageUrl] = query.pageUrl ?? [];
    let site, page;

    try {
        const rest = await Promise.all([
            fetchSiteViaUrlSF({ siteUrl }),
            fetchPageViaUrlSF({ url: `${siteUrl}/${pageUrl}` })
        ])
        site = rest[0];
        page = rest[1].page
    } catch (error) {
        console.log(error); // TODO: error-handling
        // const statusCode = error.response.data.statusCode
        // if (statusCode === 'no-page') {
        //     // temporarily redirect
        //     res.writeHead(307, { Location: "/404" });
        //     return res.end();
        // }
        // console.log(error);
    }

    return {
        props: {
            site,
            page
        },
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        '& img': {
            borderRadius: theme.spacing(0.5),
            objectFit: 'cover',
            width: '100%',
            height: '100%'
        }
    },
    header: {
        '& .selected': {
            backgroundColor: theme.palette.primary.main,
        },
        '& .no-selected': {
            background: '#E3E3E9',
            border: '1px solid #DADAE7',
            boxSizing: 'border-box'
        },
        '& button': {
            height: 40,
            fontSize: 14,
            minWidth: 'unset'
        }
    },
    deviceIcon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
        borderRadius: "50%",
        marginLeft: theme.spacing(1),
        cursor: 'pointer',
    },
    sectionWrapper: {
        '& .action': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
            height: 30,
            background: '#DADAE7',
            borderRadius: '50%',
            '& svg': {
                color: '#A6A6AD',
                cursor: 'pointer',
            },
            '&:hover': {
                background: theme.palette.primary.main,
                '& svg': {
                    color: theme.palette.secondary.main
                }
            },
        },
        '& p:first-child': {
            marginTop: 0
        },
        '& p:last-child': {
            marginBottom: 0
        }
    },
    select: {
        '& .MuiInputBase-root': {
            background: 'white',
            borderRadius: '0px !important',
            marginRight: theme.spacing(1)
        }
    },
    options: {
        boxShadow: 'unset !important'
    }
}));

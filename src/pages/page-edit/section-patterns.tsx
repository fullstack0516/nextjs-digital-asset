import { Box, Button, Typography } from "@material-ui/core";
import { useContext, useState } from "react";
import { getLanguage } from "../../langauge/language";
import { ContentSectionTypes } from "../../models/content-section";
import { pageSectionAdd } from "../../utils/client/page-action";
import { PageContext } from "../../utils/client/page-state";
import SvgImgShape from '../../../public/img-shape.svg';
import SvgPlus from '../../../public/plus.svg';
import VideoShape from '../../../public/video.svg';

const borderStyle = '1px solid #E8E8EF';

// wrapper component for section-type examples
const PatternWrapper = (props: {
    children: any,
    title: string,
    onAdd: () => void
}) => {
    const [isHover, setIsHover] = useState<boolean | undefined>(false);

    return (
        <Box mb={3}>
            <Typography variant="h6" color="textPrimary">{props.title}</Typography>
            <Box
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="24px 16px"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                border={borderStyle}
                style={{ background: 'white' }}
                mt={1.5}
            >
                {props.children}
                {
                    isHover &&
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
                            style={{ background: '#546E7A', opacity: 0.4 }}
                        />
                        <Button color="primary" variant="contained" onClick={props.onAdd}>
                            {getLanguage().addSection}
                            &nbsp;&nbsp;&nbsp;
                            <SvgPlus width={12} height={12} fill="white" />
                        </Button>
                    </Box>
                }
            </Box>
        </Box>
    )
}

export default function SectionPatterns() {
    const pageCtx = useContext(PageContext);

    const handleAddNewSection = (newContentSectionType: ContentSectionTypes) => async () => {
        await pageSectionAdd(pageCtx.pageState.page.uid, newContentSectionType);
    }

    return (
        <Box p={2} className="scrollable">
            <PatternWrapper title={getLanguage()['header']} onAdd={handleAddNewSection('header')}>
                <Typography variant="h1" color="textPrimary">Blog Post Title</Typography>
            </PatternWrapper>
            <PatternWrapper title={getLanguage()['text-block']} onAdd={handleAddNewSection('text-block')}>
                <Typography variant="h6" color="textSecondary">
                    Donec eget porttitor urna. Nullam eu ornare erat. Pellentesque nunc nulla, congue sed cursus vitae, interdum ut libero.
                    <br /><br />
                    Suspendisse potenti. Praesent sit amet tincidunt augue. In hac habitasse platea dictumst.
                </Typography>
            </PatternWrapper>
            <PatternWrapper title={getLanguage()['text-image-right']} onAdd={handleAddNewSection('text-image-right')}>
                <Box display='grid' gridTemplateColumns="1fr 1fr" gridGap={20} alignItems="center">
                    <Typography variant="h6" color="textSecondary">
                        Donec eget porttitor urna. Nullam eu ornare erat. Pellentesque nunc nulla, congue sed cursus vitae, interdum ut libero.
                    </Typography>
                    <SvgImgShape width="100%" />
                </Box>
            </PatternWrapper>
            <PatternWrapper title={getLanguage()['text-image-left']} onAdd={handleAddNewSection('text-image-left')}>
                <Box display='grid' gridTemplateColumns="1fr 1fr" gridGap={20} alignItems="center">
                    <SvgImgShape width="100%" />
                    <Typography variant="h6" color="textSecondary">
                        Donec eget porttitor urna. Nullam eu ornare erat. Pellentesque nunc nulla, congue sed cursus vitae, interdum ut libero.
                    </Typography>
                </Box>
            </PatternWrapper>
            <PatternWrapper title={getLanguage()['image-row']} onAdd={handleAddNewSection('image-row')}>
                <SvgImgShape width="100%" />
            </PatternWrapper>
            <PatternWrapper title={getLanguage()['triple-image-col']} onAdd={handleAddNewSection('triple-image-col')}>
                <Box display='grid'>
                    <SvgImgShape width="100%" />
                    <Box display='grid' gridTemplateColumns="1fr 1fr" gridGap={20} alignItems="center">
                        <SvgImgShape width="100%" />
                        <SvgImgShape width="100%" />
                    </Box>
                </Box>
            </PatternWrapper>
            <PatternWrapper title={getLanguage()['video-row-embed-only']} onAdd={handleAddNewSection('video-row-embed-only')}>
                <iframe width="100%" src="https://www.youtube.com/embed/tgbNymZ7vqY" style={{ border: 'none' }} />
            </PatternWrapper>
            <PatternWrapper title={getLanguage()['video-block']} onAdd={handleAddNewSection('video-block')}>
                <Box>
                    <VideoShape width="100%" />
                </Box>
            </PatternWrapper>
        </Box>
    )
}

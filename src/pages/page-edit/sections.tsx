import { useContext, useState } from "react";
import { getLanguage } from "../../langauge/language";
import ContentSection, { ContentTypes } from "../../models/content-section";
import { pageSectionDelete, pageSectionsReorder } from "../../utils/client/page-action";
import { PageContext } from "../../utils/client/page-state";
import SvgDelete from '../../../public/delete.svg';
import { Box, makeStyles, Typography } from "@material-ui/core";
import ReactDragListView from 'react-drag-listview';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import OptionsMenu from '../../components/options-menu';
import SvgTextBlock from '../../../public/text-block.svg';
import SvgAddBlock from '../../../public/add-block.svg';
import markdownToTxt from 'markdown-to-text';

let sectionRefs = {}
const borderStyle = '1px solid #E8E8EF';

export default function Sections(props: {
    onGoExamples: () => void,
}) {
    const classes = useStyles();
    const pageCtx = useContext(PageContext);
    const contentDraftSections = pageCtx.pageState.page?.contentDraftSections ?? [] as ContentSection<ContentTypes>[];
    const pageUid = pageCtx.pageState.page?.uid as string;
    const [openMenu, setOpenMenu] = useState<boolean | undefined>(false);
    const [selectedSection, setSelectedSection] = useState<string | undefined>(null);

    const dragProps = {
        nodeSelector: 'li',
        handleSelector: 'a',
        async onDragEnd(fromIndex, toIndex) {
            await pageSectionsReorder(pageUid, fromIndex, toIndex);
        },
        lineClassName: 'drag-line'
    };

    const handleMore = (uid) => () => {
        setSelectedSection(uid);
        setOpenMenu(true);
    }

    const handleSectionDelete = async () => {
        if (selectedSection) {
            await pageSectionDelete(pageUid, selectedSection);
            setOpenMenu(false);
        }
    }

    const moreOptions = [
        { icon: <SvgDelete width={13} height={13} />, text: getLanguage().delete, onClick: handleSectionDelete }
    ]

    return (
        <Box p={2} className="scrollable">
            <ReactDragListView {...dragProps}>
                {
                    contentDraftSections.map((section) =>
                        <Box key={section.uid} className={classes.section} component="li">
                            <Box
                                display="grid"
                                alignItems="center"
                                gridTemplateColumns="20px 1fr 20px 24px"
                                gridColumnGap={9}
                                pl={2}
                                pr={2}
                                height={60}
                            >
                                <SvgTextBlock width={20} height={20} />
                                <Typography variant="h6" color="textSecondary">
                                    {getLanguage()[section.type]}
                                </Typography>
                                <MoreHorizIcon
                                    ref={(ref) => {
                                        sectionRefs[section.uid] = ref;
                                    }}
                                    onClick={handleMore(section.uid)}
                                />
                                <Box display="flex" alignItems="center" component="a" className="grab">
                                    <DragHandleIcon />
                                </Box>
                            </Box>
                            {
                                // these 2 section doesn't require the text preview
                                !['image-row', 'triple-image-col'].includes(section.type) &&
                                <Box display="flex" alignItems="center" height={50} pl={2} pr={2}>
                                    <Typography variant="h6" color="textSecondary" className="turncate">
                                        {
                                            section.type === 'video-block'
                                                ? getLanguage().uploadVideo
                                                : section.type === 'video-row-embed-only'
                                                    ? getLanguage().youtubeEmbed
                                                    // @ts-ignore
                                                    : markdownToTxt(section?.content?.text?.markdown)
                                        }
                                    </Typography>
                                </Box>
                            }
                        </Box>
                    )
                }
            </ReactDragListView>
            <Box
                display="grid"
                alignItems="center"
                gridTemplateColumns="20px 1fr"
                gridColumnGap={9}
                pl={2}
                pr={2}
                height={60}
                className={classes.section}
                onClick={props?.onGoExamples}
            >
                <SvgAddBlock width={20} height={20} />
                <Typography variant="h6" color="primary">{getLanguage().addSection}</Typography>
            </Box>
            <OptionsMenu
                open={openMenu}
                onClose={() => setOpenMenu(false)}
                options={moreOptions}
                anchorEl={sectionRefs[selectedSection] ?? null}
                disableBottomMenus={true}
            />
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    section: {
        background: theme.palette.secondary.main,
        marginBottom: theme.spacing(2),
        border: borderStyle,
        listStyle: 'none',
        cursor: 'pointer',
        '& > div:nth-child(2)': {
            background: '#EFEFF4',
            '& > h6': {
                height: 16,
                width: '80%',
            }
        },
        '& .grab': {
            '&:active': {
                cursor: 'grabbing'
            }
        }
    },
}));

import { Box, Input, makeStyles, MenuItem, Select, Tooltip, Typography } from "@material-ui/core";
import { useContext, useState } from "react";
import { getLanguage } from "../../langauge/language";
import { Page } from "../../models/page";
import { dispatchModal } from "../../utils/client/modal-state";
import { addMetaTag, removeMetaTag, updatePage } from "../../utils/client/page-action";
import { PageContext } from "../../utils/client/page-state";
import { SiteColors } from "../../variables";
import Tag from '../../components/tag';
import SvgEditPen from '../../../public/edit-pen.svg';
import ModalError from "../../components/modal-error";

const borderStyle = '1px solid #E8E8EF';

export default function Settings() {
    const classes = useStyles();
    const pageCtx = useContext(PageContext);
    const [page, setPage] = useState<Page | undefined>(pageCtx.pageState.page);
    const [titleEditable, setTitleEditable] = useState<boolean>(false)
    const [newMetaTag, setNewMetaTag] = useState<string>('')
    const { pageColor = SiteColors.purple, title } = page ?? {};
    const { userMetaTags } = pageCtx.pageState.page

    const handleChange = (event) => {
        setPage((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const pageTitleUpdate = async () => {
        if (title.length > 70) {
            return dispatchModal({
                type: 'add',
                modal: <ModalError text="Page Name should be less than or equals to 70 characters." />
            })
        }

        await updatePage({ pageToUpdateUid: page?.uid, title });
        setTitleEditable(() => false)
    }

    const pageColorUpdate = async () => {
        await updatePage({ pageToUpdateUid: page?.uid, pageColor });
    }

    const onKeyPressInTitle = (event) => {
        // enter key pressed
        if (event.charCode === 13) {
            pageTitleUpdate();
        }
    }

    const onKeyPressInMetaTag = async (event) => {
        // enter key pressed
        if (event.charCode === 13) {
            const metaTags = userMetaTags.map(e => e.tagString)

            if (!metaTags.includes(newMetaTag.trim())) {
                const res = await addMetaTag({ pageUid: page?.uid, newTagString: newMetaTag });
                if (res) {
                    setNewMetaTag(() => '')
                }
            }
            else {
                setNewMetaTag(() => '')
            }
        }
    }

    const onRemoveMetaTag = (metaTagUid) => async () => {
        await removeMetaTag({ pageUid: page?.uid, metaTagUid });
    }

    return (
        <Box className="scrollable">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding="0px 16px"
                height={80}
                borderBottom={borderStyle}
                style={{ background: 'white' }}
            >
                {
                    titleEditable ?
                        <Input
                            value={title}
                            name="title"
                            onChange={handleChange}
                            onBlur={pageTitleUpdate}
                            onKeyPress={onKeyPressInTitle}
                            autoFocus={true}
                        />
                        :
                        <>
                            <Tooltip title={`${title} (${getLanguage().seoFriendly})`} placement="right">
                                <Typography variant="h4" color="textPrimary" className="turncate">{title}</Typography>
                            </Tooltip>
                            <SvgEditPen width={24} height={24} onClick={() => setTitleEditable(() => true)} />
                        </>
                }
            </Box>
            <Box display="flex" flexDirection="column" p={2}>
                <Box className={classes.select}>
                    <Typography variant="h6" color="textPrimary">{getLanguage().siteUrl}</Typography>
                    <Input name="siteUrl" value="tony-bug" disabled={true} />
                </Box>
                <Box className={classes.select}>
                    <Typography variant="h6" color="textPrimary">{getLanguage().mainColorOfSite}</Typography>
                    <Select
                        value={pageColor}
                        renderValue={(value: string) => (
                            <Box display="flex" alignItems="center">
                                <Box width={10} height={10} borderRadius={5} style={{ background: value }} />
                                &nbsp;&nbsp;
                                {getLanguage()[Object.keys(SiteColors).find(key => SiteColors[key] === value)]}
                            </Box>
                        )}
                        name="pageColor"
                        onChange={handleChange}
                        onBlur={pageColorUpdate}
                    >
                        {
                            Object.keys(SiteColors).map(key =>
                                <MenuItem value={SiteColors[key]} key={key}>{getLanguage()[key]}</MenuItem>
                            )
                        }
                    </Select>
                </Box>
                <Box className={classes.select}>
                    <Typography variant="h6" color="textPrimary">{getLanguage().metaTags}</Typography>
                    <Input
                        name="metaTag"
                        value={newMetaTag}
                        placeholder='New Meta Tag'
                        onChange={(e) => setNewMetaTag(() => e.target.value)}
                        onKeyPress={onKeyPressInMetaTag}
                    />
                    {
                        newMetaTag &&
                        <Typography variant="h6" color="textPrimary" style={{ marginTop: 4, marginLeft: 4 }}>{getLanguage().pressEnterToSubmitMetaTag}</Typography>
                    }
                    <Box
                        display="flex"
                        flexWrap="wrap"
                        justifyContent="initial"
                        mt={1}
                    >
                        {/* data tags */}
                        {
                            (userMetaTags ?? []).map((tag) =>
                                <Tag key={tag.tagString} name={tag.tagString} deletable onDelete={onRemoveMetaTag(tag.uid)} />
                            )
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    select: {
        marginBottom: theme.spacing(3),
        '& > h6': {
            marginBottom: theme.spacing(0.8)
        },
        '& .MuiInputBase-root': {
            background: 'white',
            borderRadius: '0px !important'
        }
    },
}));

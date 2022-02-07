import React, { useState } from 'react';
import { Box, Dialog, makeStyles, Typography, Button } from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useWindowSize } from '../../utils/client/use-window-size';
import { getLanguage } from '../../langauge/language';
import CustomDivider from '../../components/custom-divider';
import CustomInput from '../../components/custom-input';
import { Site, siteNameSchema, urlSchema, siteIconSchema } from '../../models/site';
import UploadImageEditor from '../../components/upload-image-editor';
import { SiteColors } from '../../variables';
import SvgUpload from '../../../public/upload-2.svg';
import { createSite } from '../../utils/client/site-action';

export default function NewSiteDialog(props: {
    open: boolean,
    close: (newSite: Site | undefined) => void,
}) {
    const classes = useStyles();
    const size = useWindowSize();
    const [newSite, setNewSite] = useState<Site | undefined>(null);
    const [isSubmitting, setSubmitting] = useState<boolean | undefined>(false);
    const [openUploadIcon, setOpenUploadIcon] = useState<boolean | undefined>(false);
    // new site form errors
    const [siteNameError, setSiteNameError] = useState<string>('');
    const [urlError, setUrlError] = useState<string>('');
    const [siteIconError, setSiteIconError] = useState<string>('');

    const { name, url, description, siteColor = SiteColors.purple, siteIcon } = newSite ?? {}

    const handleChange = (event) => {
        setNewSite(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const handleSiteUrl = (url) => {
        if (url) {
            setNewSite(prev => ({ ...prev, siteIcon: { type: 'photo', url: url } }));
            setSiteIconError(() => '')
        }
    }

    // validate the field's values
    const validate = () => {
        const siteNameFieldError = siteNameSchema.validate(name).error;
        const urlFieldError = urlSchema.validate(url).error;
        const siteIconFieldError = siteIconSchema.validate(siteIcon).error;

        let res = true;

        if (siteIconFieldError) {
            setSiteIconError(siteIconFieldError.message.replace('"value"', 'Site Icon'));
            res = false;
        } else {
            setSiteIconError(null);
        }

        if (siteNameFieldError) {
            setSiteNameError(siteNameFieldError.message.replace('"value"', 'Site Name'));
            res = false;
        } else {
            setSiteNameError(null);
        }

        if (urlFieldError) {
            setUrlError(urlFieldError.message.replace('"value"', 'Site URL'));
            res = false;
        } else {
            setUrlError(null)
        }

        return res;
    }

    const handleCancel = () => {
        setSiteIconError('');
        setSiteNameError('');
        setUrlError('');
        props.close(null);
    }

    const handleAddSite = async (event) => {
        event.preventDefault();
        const isValid = validate();
        if (!isValid) return;

        setSubmitting(true);
        try {
            const newSite = await createSite({ siteIcon, name, url, description, siteColor });

            props.close(newSite);
            setNewSite(() => null)
        } catch (e) {
            console.log(e);
        }
        setSubmitting(false);
    }

    return (
        <Dialog aria-labelledby="customized-dialog-title" open={props.open ?? false} className={classes.root}>
            <Box p={size.width > 599 ? 4 : 3}>
                <>
                    <Box display="flex" alignItems="center" flexDirection={size.width > 599 ? "row" : "column"}>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            width={80}
                            height={80}
                            className={classes.upload}
                            onClick={() => setOpenUploadIcon(true)}
                            style={{ borderColor: siteIconError && '#FF0000' }}
                        >
                            {
                                siteIcon ?
                                    <Box
                                        width={70}
                                        height={70}
                                        style={{
                                            background: siteIcon && `url(${siteIcon.url}) no-repeat`,
                                            backgroundSize: siteIcon && '100%',
                                            backgroundPosition: 'center',
                                            borderRadius: 10
                                        }}
                                    />
                                    :
                                    <SvgUpload width={18} height={27} />
                            }
                        </Box>
                        <Box
                            ml={size.width > 599 ? 2 : 0}
                            mt={size.width > 599 ? 0 : 2}
                            textAlign={size.width > 599 ? "left" : "center"}
                        >
                            <Typography variant="h4" color="textPrimary">{getLanguage().uploadIcon}</Typography>
                        </Box>
                    </Box>
                    {
                        siteIconError &&
                        <Typography color="error" variant="h6" style={{ marginTop: 8, textAlign: size.width > 599 ? 'left' : 'center' }}>
                            {siteIconError}
                        </Typography>
                    }
                </>
                <Box display="flex" mt={4} className={classes.field}>
                    <Typography variant="h6" component="span" color="textPrimary">{getLanguage().siteName}</Typography>
                    <CustomInput
                        name="name"
                        onChange={handleChange}
                        value={name ?? ''}
                        placeholder="What’s name of your site?"
                        errMsg={siteNameError}
                    />
                </Box>
                <Box display="flex" mt={2} className={classes.field}>
                    <Typography variant="h6" component="span" color="textPrimary">{getLanguage().siteUrl}</Typography>
                    <CustomInput
                        name="url"
                        onChange={handleChange}
                        value={url ?? ''}
                        placeholder="e.g (olly-cars)"
                        errMsg={urlError && getLanguage().siteURLMatchInfo}
                    />
                </Box>
                <Box display="flex" mt={2} className={classes.field} >
                    <Typography variant="h6" component="span" color="textPrimary">{getLanguage().description}</Typography>
                    <CustomInput
                        name="description"
                        onChange={handleChange}
                        value={description ?? ''}
                        multiline={true}
                        rows={5}
                        placeholder="Enter your description here... "
                    />
                </Box>
            </Box>
            <CustomDivider />
            <MuiDialogActions>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    className={classes.actions}
                    padding={size.width > 599 ? '16px 24px' : '16px'}
                    width="100%"
                >
                    <Button variant="contained" color="secondary" onClick={handleCancel}>
                        {getLanguage().cancel}
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleAddSite} disabled={isSubmitting}>
                        {getLanguage().addNewSite}
                    </Button>
                </Box>
            </MuiDialogActions>
            {/* upload site icon dialog */}
            <UploadImageEditor
                open={openUploadIcon}
                close={() => setOpenUploadIcon(false)}
                cropMode="square"
                onSave={handleSiteUrl}
            />
        </Dialog >
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiDialog-paper': {
            maxWidth: '650px !important'
        }
    },
    actions: {
        [theme.breakpoints.down('xs')]: {
            flexFlow: 'column-reverse',
            '& button:nth-child(2)': {
                marginBottom: 12
            },
        },
    },
    upload: {
        border: '1.5px dashed #BEBECC',
        boxSizing: 'border-box',
        borderRadius: 10,
        cursor: 'pointer'
    },
    field: {
        '& > span': {
            width: 100,
            marginTop: 25,
            [theme.breakpoints.down('xs')]: {
                display: 'none',
                marginTop: 0,
            },
        },
        '& > div': {
            width: 'calc(100% - 100px)',
            [theme.breakpoints.down('xs')]: {
                width: '100%'
            },
        }
    },
}));

import React, { useState } from 'react';
import { Box, Dialog, makeStyles, Typography, Button, } from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useWindowSize } from '../../utils/client/use-window-size';
import { getLanguage } from '../../langauge/language';
import CustomDivider from '../../components/custom-divider';
import CustomInput from '../../components/custom-input';
import { Page, pageTitleSchema, pageUrlSchema, } from '../../models/page';
import { createPage } from '../../utils/client/page-action';

export default function NewPageDialog(props: {
    open: boolean,
    close: (newPage: Page | undefined) => void,
    siteUid: string
}) {
    const classes = useStyles();
    const size = useWindowSize();
    const [newPage, setNewPage] = useState<Page | undefined>(null);
    const [isSubmitting, setSubmitting] = useState<boolean | undefined>(false);
    // new site form errors
    const [pageNameError, setPageNameError] = useState<string>('');
    const [pageUrlError, setPageUrlError] = useState<string>('');

    const { title, url } = newPage ?? {};

    const handleChange = (event) => {
        setNewPage(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    // validate the field's values
    const validate = () => {
        const pageNameFieldError = pageTitleSchema.validate(title).error;
        const pageUrlFieldError = pageUrlSchema.validate(url).error;
        let res = true
        if (pageNameFieldError) {
            setPageNameError(pageNameFieldError.message.replace('"value"', 'Page Name'));
            res = false;
        } else {
            setPageNameError(null);
        }

        if (pageUrlFieldError) {
            setPageUrlError(pageUrlFieldError.message.replace('"value"', 'Page URL'));
            res = false;
        } else {
            setPageUrlError(null)
        }
        return res;
    }

    const handleCancel = () => {
        setPageNameError('');
        setPageUrlError('');
        props.close(null);
        setNewPage(null);
    }

    const handleAddPage = async (event) => {
        event.preventDefault();
        const isValid = validate();
        if (!isValid) return;

        setSubmitting(true);
        try {
            const newPage = await createPage({ title, url, siteUid: props.siteUid });
            if (newPage) {
                props.close(newPage);
            }
            setNewPage(null);
        } catch (e) {
            console.log(e);
        }
        setSubmitting(false);
    }


    return (
        <Dialog aria-labelledby="customized-dialog-title" open={props.open ?? false} className={classes.root}>
            <Box p={size.width > 599 ? 4 : 3}>
                <Box textAlign={size.width > 599 ? "left" : "center"}>
                    <Typography variant="h4" color="textPrimary">{getLanguage().newPage}</Typography>
                </Box>
                <Box display="flex" className={classes.field} mt={4}>
                    <Typography variant="h6" component="span" color="textPrimary">{getLanguage().pageName}</Typography>
                    <CustomInput
                        name="title"
                        onChange={handleChange}
                        value={title ?? ''}
                        placeholder="e.g Awake"
                        errMsg={pageNameError}
                    />
                </Box>
                <Box display="flex" className={classes.field} mt={2}>
                    <Typography variant="h6" component="span" color="textPrimary">{getLanguage().pageUrl}</Typography>
                    <CustomInput
                        name="url"
                        onChange={handleChange}
                        value={url ?? ''}
                        placeholder="e.g (olly-loves-cars ; olly-cars)"
                        errMsg={pageUrlError && getLanguage().pageURLMatchInfo}
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
                    <Button variant="contained" color="primary" onClick={handleAddPage} disabled={isSubmitting}>
                        {getLanguage().addNewPage}
                    </Button>
                </Box>
            </MuiDialogActions>
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

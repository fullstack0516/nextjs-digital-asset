import React, { useContext, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    makeStyles,
    Hidden,
    Typography,
    Avatar,
    Dialog,
} from '@material-ui/core';
import { User, emailSchema, usernameSchema, bioSchema, phoneNumberSchema, bioMaxLength } from '../../models/user';
import { getLanguage } from '../../langauge/language';
import { UserContext, dispatchUser } from '../../utils/client/user-state'
import { confirmChangeSMS, updateUser, deleteSelf, setCategoryBlacklisted, setCategoryUnblacklisted } from '../../utils/client/user-actions'
import { sendSMSCode } from '../../utils/client/auth-actions'
import { useWindowSize } from '../../utils/client/use-window-size'
import { dispatchModal } from '../../utils/client/modal-state';
import StyledTabs from '../../components/styled-tabs';
import StyledTab from '../../components/styled-tab';
import CustomDivider from '../../components/custom-divider';
import CustomInput from '../../components/custom-input';
import UploadImageEditor from '../../components/upload-image-editor';
import VerifySMSCode from '../../components/verify-sms-code';
import ModalError from '../../components/modal-error';
import { Categories, } from '../../variables';
import Tag from '../../components/tag';
import { removeTypename, sortByProperty } from '../../utils/helpers';
import SvgEdit from '../../../public/edit.svg';
import SvgPlus from '../../../public/plus.svg';
import CustomHeader from '../../components/custom-header';
import CustomAutocomplete from '../../components/custom-autocomplete';
import ConfirmDialog from '../../components/confirm-dialog';
import { getBlacklistedCategoriesSF, server } from '../../utils/server/graphql_server';
import ModalSaved from '../../components/modal-success';

export default function Profile(props: {
    blacklistedCategoryMap: { [category: string]: string }
}) {
    const classes = useStyles();
    const size = useWindowSize();
    const userContext = useContext(UserContext);
    const [tabIndex, setTabIndex] = useState<number | false>(0);
    const [isSubmitting, setSubmitting] = useState<boolean | undefined>(false);
    const [user, setUser] = useState<User | undefined>(userContext.userState.user);
    const [openImgEditor, setOpenImgEditor] = useState<boolean>(false);
    const [openSMSVerify, setOpenSMSVerify] = useState<boolean>(false);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [verificationId, setVerificationId] = useState<string>('');
    const [categoryMap, setCategoryMap] = useState<{ [category: string]: string } | null>(props?.blacklistedCategoryMap);
    const [codeLoading, setCodeLoading] = useState<boolean>(false);

    // form field errors
    const [userNameError, setUserNameError] = useState<string | undefined>(null);
    const [emailError, setEmailError] = useState<string | undefined>(null);
    const [phoneNumberError, setPhoneNumberError] = useState<string | undefined>(null);
    const [bioError, setBioError] = useState<string | undefined>(null);

    const { username, email, phoneNumber, bio, profileMedia } = user ?? {};

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser(previousProfile => ({ ...previousProfile, [name]: value }));
    }

    const userUpdate = async () => {
        setSubmitting(true);
        const res = await updateUser({ username, email, phoneNumber, bio, profileMedia: removeTypename(profileMedia) })
        if (res) {
            dispatchModal({
                type: 'add',
                modal: <ModalSaved text={Boolean(email) !== Boolean(userContext.userState.user.email) ? getLanguage().emailUpdated : ''} />
            })
        }
        setSubmitting(false);
    }

    // validate the field's values
    const validate = () => {
        const userNameFieldError = usernameSchema.validate(username).error;
        const emailFieldError = emailSchema.validate(email).error;
        const phoneFieldError = phoneNumberSchema.validate(phoneNumber).error;
        const bioFieldError = bioSchema.validate(bio).error;

        let res = true
        if (userNameFieldError) {
            setUserNameError(userNameFieldError.message.replace('"value"', 'Full Name'));
            res = false;
        } else {
            setUserNameError(null);
        }

        if (phoneFieldError) {
            setPhoneNumberError(phoneFieldError.message.replace('"value"', 'SMS'));
            res = false;
        } else {
            setPhoneNumberError(null)
        }

        // email & bio are optional fields
        if (email && emailFieldError) {
            setEmailError(emailFieldError.message.replace('"value"', 'Backup Email'));
            res = false;
        } else {
            setEmailError(null)
        }

        if (bio && bioFieldError) {
            setBioError(bioFieldError.message.replace('"value"', 'Bio'));
            res = false;
        } else {
            setBioError(null)
        }
        return res;
    }

    const handleUserUpdate = async (event) => {
        event.preventDefault();
        const isValid = validate();
        if (!isValid) return;

        // if phone number was changed, we need to confirm it first.
        if (phoneNumber !== userContext.userState.user.phoneNumber) {
            const { verificationCode, userExists } = await sendSMSCode(phoneNumber) ?? {};
            if (verificationCode) {
                if (userExists) {
                    return await dispatchModal({
                        type: 'add',
                        modal: <ModalError text="The user who uses the same phone number exists." />
                    })
                }
                setOpenSMSVerify(true);
                setVerificationId(verificationCode);
            }
            return;
        }

        await userUpdate();
    }

    const handleDelete = async () => {
        setConfirmDelete(() => true)
    }

    const deleteUser = async () => {
        await deleteSelf();
        setConfirmDelete(() => false)
        window.location.href = "/auth"
    }

    const handleSMSConfirm = async (code) => {
        setCodeLoading(true)
        const smsVerified = await confirmChangeSMS(verificationId, code, phoneNumber)
        setCodeLoading(false)
        if (smsVerified) {
            setOpenSMSVerify(false);
            await userUpdate();
        }
    }

    const updatePhoto = async (url) => {
        const res = await updateUser({ profileMedia: { url: url, type: 'photo' } });
        // update the user context with profileMedia url & type
        await dispatchUser({ type: 'setUser', data: res });
        setUser(() => res);
    }

    const handleBlacklisted = async (event, value) => {
        if (value) {
            const res = await setCategoryBlacklisted(value);
            if (res === true) {
                setCategoryMap((prev) => ({ ...prev, [value]: value }))
            }
        }
    }

    const handleUnBlacklisted = (value) => async () => {
        const res = await setCategoryUnblacklisted(value);
        if (res === true) {
            delete categoryMap[value];
            setCategoryMap(() => ({ ...categoryMap }));
        }
    }

    const categories = sortByProperty(categoryMap, '', 'desc');

    return (
        <div className={classes.root}>
            <CustomHeader title="Awake - Profile" />
            <Hidden smUp>
                <Box display="flex" alignItems="center" justifyContent="center" mr={4} className={classes.editProfile}>
                    <Typography variant="h6" color="textPrimary" component="span" style={{ fontSize: 14, fontWeight: 500 }}>
                        {getLanguage().editProfile}
                    </Typography>
                    <Box display="flex" justifyContent="center" alignItems="center" width={36} height={36}>
                        <SvgEdit width={12} height={12} fill="white" />
                    </Box>
                </Box>
            </Hidden>
            <Card >
                <Box display="flex" alignItems="center" justifyContent="space-between" className={classes.profileHeader}>
                    <StyledTabs value={tabIndex} onChange={handleTabChange} indicatorwidth={size.width < 599 ? '100%' : 150}>
                        <StyledTab label={getLanguage().mainProfile} />
                        <StyledTab label={getLanguage().dataCollection} />
                    </StyledTabs>
                    <Hidden xsDown>
                        <Box display="flex" alignItems="center" justifyContent="center" mr={4} className={classes.editProfile}>
                            <Typography variant="h6" color="textPrimary" component="span">{getLanguage().editProfile}</Typography>
                            <Box display="flex" justifyContent="center" width={36} height={36} alignItems="center">
                                <SvgEdit width={12} height={12} fill="white" />
                            </Box>
                        </Box>
                    </Hidden>
                </Box>
                <CustomDivider />
                <CardContent className={classes.profileContent}>
                    {
                        tabIndex === 0 &&
                        <>
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                mb={4}
                                className={classes.upload}
                                onClick={() => setOpenImgEditor(true)}
                            >
                                {
                                    profileMedia?.url ?
                                        <Avatar src={profileMedia.url} alt="User" />
                                        :
                                        <Box display="flex" p={4} mb={1}>
                                            <SvgPlus width={18} height={18} fill="white" />
                                        </Box>
                                }
                                <Typography variant="h5" component="a" color="primary">
                                    {profileMedia?.url ? getLanguage().changeAvatar : getLanguage().uploadPhoto}
                                </Typography>
                                <Typography variant="h6" component="span" color="textSecondary">
                                    {getLanguage().minimumImgSize}
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item container xs={12} md={6}>
                                    <Grid item xs={12}>
                                        <CustomInput
                                            label={`${getLanguage().username}*`}
                                            name="username"
                                            onChange={handleChange}
                                            value={username ?? ''}
                                            errMsg={userNameError}
                                            maxLength={17}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CustomInput
                                            label={`${getLanguage().backupEmail}`}
                                            name="email"
                                            onChange={handleChange}
                                            value={email ?? ''}
                                            errMsg={emailError}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CustomInput
                                            label={`${getLanguage().sms}*`}
                                            name="phoneNumber"
                                            onChange={handleChange}
                                            value={phoneNumber ?? ''}
                                            errMsg={phoneNumberError}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container xs={12} md={6}>
                                    <Grid item xs={12}>
                                        <CustomInput
                                            label={`${getLanguage().shortBiography}`}
                                            maxLength={bioMaxLength}
                                            name="bio"
                                            onChange={handleChange}
                                            value={bio ?? ''}
                                            multiline={true}
                                            rows={11}
                                            placeholder="Update your biography..."
                                            errMsg={bioError}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    }
                    {
                        tabIndex === 1 &&
                        <>
                            <Box display="flex" flexDirection={size.width > 599 ? 'row' : 'column'} justifyContent="space-between" alignItems="center" mt={4}>
                                <Box display="flex" flexDirection="column" mb={size.width < 599 ? 2 : 0} width="100%">
                                    <Typography variant="h4" color="textPrimary" style={{ marginBottom: 16, fontWeight: 500 }}>{getLanguage().dataFilters}</Typography>
                                    <Typography variant="h5" color="textSecondary">Choose what data you don't us to collect on you</Typography>
                                </Box>
                                <CustomAutocomplete
                                    options={Object.keys(Categories)}
                                    onChange={handleBlacklisted}
                                    helperText={getLanguage().category}
                                />
                            </Box>
                            <Box display="flex" flexWrap="wrap" mt={size.width > 599 ? 3 : 2} mb={size.width > 599 ? 6 : 3} ml={-0.5}>
                                {categories.map(category => <Tag name={category} key={category} onDelete={handleUnBlacklisted(category)} deletable />)}
                            </Box>
                        </>
                    }
                </CardContent>
                <CustomDivider />
                <Box display="flex" justifyContent="space-between" p={4} className={classes.profileAction}>
                    <Button variant="contained" color="secondary" onClick={handleDelete}>
                        {getLanguage().deleteAccount}
                    </Button>
                    <Button variant="contained" color="primary" type="submit" disabled={isSubmitting} onClick={handleUserUpdate}>
                        {getLanguage().saveChanges}
                    </Button>
                </Box>
                {/* delete-user confirm dialog */}
                <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(() => false)} onSave={deleteUser} message={getLanguage().sureDeleteYou} />
                {/* upload-image editor dialog */}
                <UploadImageEditor open={openImgEditor} close={() => setOpenImgEditor(false)} onSave={updatePhoto} cropMode="circle" />
                {/* SMS verification code dialog */}
                <Dialog aria-labelledby="customized-dialog-title" open={openSMSVerify} className={classes.dialog}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-around"
                        alignItems="center"
                        height={318}
                        width={size.width < 600 ? 300 : 400}
                        padding={size.width < 600 ? '0px 20px' : '0px 50px'}
                    >
                        <VerifySMSCode
                            onConfirm={handleSMSConfirm}
                            phoneNumber={`${phoneNumber && (phoneNumber[0] !== '+') && '+ '}${phoneNumber}`}
                            loading={codeLoading}
                        />
                    </Box>
                </Dialog>
            </Card>
        </div>
    );
}

export const getServerSideProps = async (context) => {
    const { req, res } = context;
    await server({ req, res })

    let blacklistedCategoryMap = {};
    const blacklistedCategories = await getBlacklistedCategoriesSF()

    blacklistedCategories.forEach(e => {
        blacklistedCategoryMap = { ...blacklistedCategoryMap, [e.category]: e.category }
    })

    return {
        props: {
            blacklistedCategoryMap
        },
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 770,
        width: '100%',
        marginTop: theme.spacing(6),
        [theme.breakpoints.down('xs')]: {
            marginTop: 0,
        },
    },
    profileHeader: { height: 70 },
    profileContent: {
        padding: theme.spacing(2),
        [theme.breakpoints.up('lg')]: {
            padding: theme.spacing(4)
        },
    },
    profileAction: {
        [theme.breakpoints.down('xs')]: {
            flexFlow: 'column-reverse',
            '& button:nth-child(2)': {
                marginBottom: theme.spacing(2)
            },
        },
    },
    editProfile: {
        [theme.breakpoints.down('xs')]: {
            marginRight: 0,
            padding: theme.spacing(5)
        },
        '& > div': {
            background: theme.palette.primary.main,
            borderRadius: '50%',
            marginLeft: theme.spacing(1),
        },
        '& span': {
            fontWeight: 500
        }
    },
    upload: {
        cursor: 'pointer',
        '& .MuiAvatar-root': {
            width: 86,
            height: 86
        },
        '& > div': {
            borderRadius: '50%',
            background: theme.palette.info.main,
            border: '2px solid #F2F2FE',
        },
        '& > a': {
            lineHeight: '32px',
            textDecorationLine: 'underline',
        },
        '& > span': {
            lineHeight: '26px',
        }
    },
    dialog: {
        '& .MuiDialog-paper': {
            width: 'max-content'
        }
    }
}));

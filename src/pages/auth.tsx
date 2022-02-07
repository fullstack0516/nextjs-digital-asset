import React, { useState } from 'react';
import { makeStyles, Divider, TextField, Button, Box, Card, Typography, Checkbox } from '@material-ui/core';
import PhoneInput from 'react-phone-input-2';
import { sendSMSCode, confirmSMS } from '../utils/client/auth-actions';
import { useWindowSize } from '../utils/client/use-window-size';
import { Col, Row } from '../components/col-row';
import VerifySMSCode from '../components/verify-sms-code';
import { getLanguage } from '../langauge/language';
import CustomHeader from '../components/custom-header';
import Logo from '../components/logo';
import { checkUsernameExist } from '../utils/client/user-actions';
import { dispatchModal } from '../utils/client/modal-state';
import ModalError from '../components/modal-error';

interface PhoneNumber {
    value: string;
    formattedValue: string;
}

export default function Sign() {
    const classes = useStyles();
    // window size
    const size = useWindowSize();
    // it represents where the current page is
    const [status, setStatus] = useState<'welcome' | 'phone' | 'verify' | 'name'>('welcome');
    const [userName, setUserName] = useState<string>(undefined);
    const [phoneNumber, setPhoneNumber] = useState<PhoneNumber | undefined>(undefined);
    const [verificationId, setVerificationId] = useState<string>('');
    const [codeLoading, setCodeLoading] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(false);

    const handlePhoneNumber = (value, countryData, event, formattedValue) => {
        setPhoneNumber({ value: value, formattedValue });
        setIsValid(value.length >= 4);
    };

    const handleMoveWithName = (name, pos) => {
        setUserName(name);
        setStatus(pos);
    };

    const handleMove = (pos) => {
        setStatus(pos);
    };

    const handleSendVerification = async (phone) => {
        setPhoneNumber(phone);
        // send the code to the phone
        const { verificationCode, userExists } = await sendSMSCode('+' + phone?.value);
        if (verificationCode) {
            // save the verification Id
            setVerificationId(verificationCode);
            // if the user exist, just go to the code verification board
            // if no, require the user to input the full name
            if (!userExists) {
                setStatus('name');
            } else {
                setStatus('verify');
            }
        }
    };

    const handleConfirmCode = async (code) => {
        setCodeLoading(() => true);
        const res = await confirmSMS(verificationId, code, '+' + phoneNumber?.value, userName);
        setCodeLoading(() => false);
        if (res) {
            window.location.href = '/discover';
        }
    };

    // welcome board
    const Welcome = () => {
        const [checked, setChecked] = useState<boolean>(false);

        return (
            <>
                <Box display="flex" alignItems="center" flexDirection="column" className={classes.title}>
                    <span>
                        Welcome to <b style={{ color: '#37474F' }}>{getLanguage().appName}!</b>
                    </span>
                    <span>{getLanguage().appName} allows you to control what sort of data</span>
                    <span>companies collect about you</span>
                </Box>
                <Box textAlign="center">
                    <Button
                        variant="contained"
                        onClick={() => handleMove('phone')}
                        disabled={!checked}
                        key={`${!checked}`}
                        color="primary"
                    >
                        {getLanguage().signin} to {getLanguage().appName}
                    </Button>
                    <Box display="flex" alignItems="center" mt={3}>
                        <Checkbox
                            checked={checked}
                            onChange={(event) => setChecked(event.target.checked)}
                            color="primary"
                        />
                        <Typography variant="h6" color="textPrimary">
                            By signing up you agree to our&nbsp;
                            <Typography
                                variant="h6"
                                color="primary"
                                component="a"
                                style={{
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                                onClick={() => window.open('/terms-and-conditions', '_blank').focus()}
                            >
                                Terms and Conditions
                            </Typography>
                        </Typography>
                    </Box>
                </Box>
            </>
        );
    };

    // required name input form
    const NameInput = ({ onContinue }) => {
        const [fullName, setFullName] = useState<string>('');
        const handleClick = async () => {
            const usernameExist = await checkUsernameExist(fullName)
            if (usernameExist !== null) {
                if (usernameExist) {
                    return dispatchModal({
                        type: 'add',
                        modal: <ModalError text={getLanguage().usernameExsitsPleaseTryAnother} />
                    })
                }

                onContinue(fullName);
            }
        };

        return (
            <>
                <Box display="flex" alignItems="center" flexDirection="column" className={classes.title}>
                    <span>Looks like you were not member</span>
                    <span>Please enter your username so we can move</span>
                    <span>to the next step</span>
                </Box>
                <TextField
                    label="Username"
                    variant="outlined"
                    placeholder="e.g (SomeUser)"
                    InputLabelProps={{ shrink: true }}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    inputProps={{
                        maxLength: 17,
                    }}
                />
                <Button variant="contained" onClick={handleClick} color="primary" disabled={!fullName}>
                    {getLanguage().continue}
                </Button>
                <Divider component="hr" className={classes.divider} />
                <div className={classes.additionalInfo}>
                    Already have an account?&nbsp;&nbsp;—&nbsp;&nbsp;
                    <span onClick={() => handleMove('welcome')}>{getLanguage().signin}</span>
                </div>
            </>
        );
    };

    return (
        <Box display="flex" justifyContent="space-around" flexDirection="column" className={classes.auth}>
            <CustomHeader title="Awake - Sign in" />
            <Row style={{ justifyContent: 'center' }}>
                <Logo darkMode width={size.width < 600 ? 130 : 190} height={size.width < 600 ? 90 : 110} />
            </Row>
            <Col style={{ alignItems: 'center' }}>
                <Card
                    className={classes.paper}
                    style={{ width: size.width < 600 ? 300 : 400, padding: size.width < 600 ? '0px 20px' : '0px 50px' }}
                >
                    {status === 'welcome' && <Welcome />}
                    {status === 'phone' &&
                        <>
                            <Box display="flex" alignItems="center" flexDirection="column" className={classes.title}>
                                <span>Phone number!</span>
                                <span>Please enter your phone number so you can</span>
                                <span>get a verification code</span>
                            </Box>
                            <PhoneInput
                                country={'us'}
                                specialLabel="Phone input"
                                onChange={handlePhoneNumber}
                                inputStyle={{ borderColor: isValid && '#FF7534' }}
                                containerStyle={{ color: isValid && '#FF7534' }}
                                value={phoneNumber?.value}
                                placeholder="+1 (702) 344-5343"
                                enableSearch={true}
                                disableSearchIcon={true}
                                searchPlaceholder="Search"
                            />
                            <Button variant="contained" onClick={() => handleSendVerification(phoneNumber)} color="primary" disabled={!isValid}>
                                {getLanguage().sendVerification}
                            </Button>
                        </>
                    }
                    {
                        status === 'verify' &&
                        <VerifySMSCode
                            onConfirm={handleConfirmCode}
                            onSetVerificationId={setVerificationId}
                            verificationId={verificationId}
                            phoneNumber={phoneNumber.formattedValue}
                            loading={codeLoading}
                        />
                    }
                    {status === 'name' && <NameInput onContinue={(val) => handleMoveWithName(val, 'verify')} />}
                </Card>
                <div className={classes.term}>
                    <a target="" href="/privacy-policy">
                        {getLanguage().privacyPolicy}
                    </a>
                    &nbsp;&nbsp;•&nbsp;&nbsp;
                    <a target="" href="/terms-and-conditions">
                        {getLanguage().termsOfUse}
                    </a>
                </div>
            </Col>
            <Row style={{ justifyContent: 'center' }}>
                <span>{`© 2021 ${getLanguage().allRightsReserved}. ${getLanguage().appName} Ltd.`}</span>
            </Row>
        </Box>
    );
}

const useStyles = makeStyles((theme) => ({
    auth: {
        background: 'url(./background.jpeg) no-repeat center center fixed',
        backgroundSize: 'cover',
        color: theme.palette.secondary.contrastText,
        height: '100%',
    },
    paper: {
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 318,
        overflow: 'unset !important',
        '& .MuiTextField-root': {
            width: '100%',
            '& .MuiFormLabel-root.Mui-focused': {
                color: `${theme.palette.primary.main} !important`,
            },
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: `${theme.palette.primary.main} !important`,
            },
        },
        // custome style for phone input
        '& .react-tel-input': {
            '& .form-control': {
                fontSize: 14,
                fontWeight: 500,
                width: '100%',
                padding: '18.5px 14px 18.5px 65px',
                border: '1px solid #CFD8DC',
                boxSizing: 'border-box',
                borderRadius: 10,
                height: 50,
            },
            '& .special-label': {
                position: 'absolute',
                zIndex: 1,
                top: -7,
                left: 10,
                display: 'block',
                background: 'white',
                padding: '0px 8px 0px 5px',
                fontSize: 12,
                whiteSpace: 'nowrap',
            },
            '& .flag-dropdown': {
                background: 'transparent',
                border: 'none',
                borderRight: '1px solid #CFD8DC',
                '& .selected-flag': {
                    width: 55,
                    height: '100%',
                    padding: '0 0 0 15px',
                    borderRadius: '3px 0 0 3px',
                    background: 'transparent !important',
                    '& .flag': {
                        zoom: 1.2,
                        marginRight: 20,
                        '& .arrow': { left: 24 },
                    },
                },
                '& .country-list': {
                    maxWidth: 250,
                    padding: `0px 8px 8px`,
                    '& .search': {
                        padding: '7px 9px',
                    },
                    '& .search-box': {
                        padding: '8px 0px',
                        width: '90%',
                        borderRadius: '10px !important',
                        margin: 0,
                        borderColor: '#CFD8DC',
                        overflow: 'hidden !important',
                        borderCollapse: 'separate'
                    }
                }
            },
        },
    },
    term: {
        marginTop: theme.spacing(1),
        color: '#e6e5e8',
        '& a': {
            color: '#e6e5e8',
            cursor: 'pointer',
            textDecoration: 'none'
        }
    },
    divider: {
        background: '#F1F1F5',
        width: '100%'
    },
    additionalInfo: {
        fontSize: 12,
        fontWeight: 500,
        '& span': { color: theme.palette.primary.main, cursor: 'pointer' },
    },
    title: {
        '& span': {
            lineHeight: '25px'
        },
        '& span:first-child': {
            fontSize: 20,
            lineHeight: '35px'
        },
    },
}));

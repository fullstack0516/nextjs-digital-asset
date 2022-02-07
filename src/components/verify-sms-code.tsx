import React, { useEffect, useState } from 'react';
import { makeStyles, Button, Box } from '@material-ui/core';
import { useWindowSize } from '../utils/client/use-window-size';
import { getLanguage } from '../langauge/language';
import { resendSMSCode } from '../utils/client/auth-actions';
import { ModalAlert } from './modal-error';
import { dispatchModal } from '../utils/client/modal-state';

const replaceAt = (str: string, index: number, ch: string) => {
    return str.replace(/./g, (c, i) => (i == index ? ch : c));
};

// phone code verification board
export default function VerifySMSCode(props: {
    onConfirm: (code: string) => void,
    phoneNumber: string,
    loading: boolean,
    onSetVerificationId?: (verificationCode: string) => void,
    verificationId?: string,
}) {
    const classes = useStyles();
    // window size
    const size = useWindowSize();
    const [code, setCode] = useState<string>('    '); // 4 empty characters
    const [isValid, setIsValid] = useState<boolean>(false);
    const [enableResend, setEnableResend] = useState<boolean>(false);
    const [seconds, setSeconds] = useState<number>(30);

    const inputStyle = { width: size.width < 600 ? 40 : 48, height: size.width < 600 ? 40 : 48 };

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                clearInterval(myInterval)
                setEnableResend(true)
            }
        }, 1000)
        return () => {
            clearInterval(myInterval);
        };
    });

    useEffect(() => {
        // At the time of mount, the first input will be focused
        const firstInput = document.getElementById(`phone-input0`);
        firstInput && firstInput.focus();
    }, []);

    useEffect(() => {
        setIsValid(!code.includes(' '));
    }, [code]);

    const handleKeyDown = (e, verificationInputBoxIndex) => {
        //Delete the original number.
        e.target.value=' '
        if (e.key === 'Backspace' || e.key === 'Tab') {
            setCode((previousCode) => replaceAt(previousCode, verificationInputBoxIndex, ' '));
        }
    }

    const handleChange = (e, verificationInputBoxIndex) => {
        e.preventDefault();
        const { value, maxLength } = e.target;
        if (value) {
            let ch = value;
            if ((value + '').length > maxLength) {
                ch = value.slice(0, maxLength);
            }
            setCode((previousCode) => replaceAt(previousCode, verificationInputBoxIndex, ch));
            // next input focusing
            const nextInput = document.getElementById(`phone-input${verificationInputBoxIndex >= 3 ? 0 : verificationInputBoxIndex + 1}`)
            nextInput && nextInput.focus();
        } else {
            setCode((previousCode) => replaceAt(previousCode, verificationInputBoxIndex, ' '));
        }
    };

    // handle the paste event
    const handlePaste = (e) => {
        e.preventDefault();
        // get the code from paste event
        const text = (e.originalEvent || e).clipboardData.getData('text/plain');
        // only extract the numbers from string
        const code = text.replace(/[^0-9]/g, '') as string;
        // we need first 4 numbers
        setCode(code.substring(0, 4));
    };

    const handleResendVerification = async (verificationId, phoneNumber) => {
        setSeconds(30)
        setEnableResend(false)
        // resend the code to the phone
        const verificationCode = await resendSMSCode(verificationId, phoneNumber);
        if (verificationCode) {
            props.onSetVerificationId(verificationCode)
            dispatchModal({
                type: 'add',
                modal: <ModalAlert text={"Verification code was resent."} />,
            });
        }
    };

    return (
        <>
            <Box display="flex" alignItems="center" flexDirection="column" className={classes.title}>
                <span>{getLanguage().verification}</span>
                <span>We sent you an SMS code on number:</span>
                <span>{props?.phoneNumber || ''}</span>
                <span
                    onClick={() => handleResendVerification(props.verificationId, props.phoneNumber)}
                    style={{
                        color: enableResend ? 'orange' : 'lightgrey',
                        cursor: enableResend ? 'pointer' : 'auto',
                        pointerEvents: enableResend ? 'auto' : 'none'
                    }}
                >
                    {seconds === 0 ? getLanguage().readyToResend : getLanguage().resendingIn.replace('{number}', seconds.toString())}
                </span>
            </Box>
            <Box
                display='flex'
                alignItems='center'
                justifyContent='space-around'
                position='relative'
                width="100%"
                className={classes.phoneCode}
                onPaste={handlePaste}
            >
                {Array.from(code).map((val, verificationInputBoxIndex) => (
                    <input
                        type="number"
                        min={0}
                        max={9}
                        maxLength={1}
                        style={inputStyle}
                        key={verificationInputBoxIndex}
                        id={`phone-input${verificationInputBoxIndex}`}
                        onChange={(e) => handleChange(e, verificationInputBoxIndex)}
                        onKeyDown={(e) => handleKeyDown(e, verificationInputBoxIndex)}
                        value={val}
                    />
                ))}
                <span style={{ background: isValid && '#FF7534' }}></span>
            </Box>
            <Button variant="contained" onClick={() => props?.onConfirm(code)} color="primary" disabled={!isValid || props?.loading}>
                {getLanguage().confirmCode}
            </Button>
        </>
    );
};

const useStyles = makeStyles((theme) => ({
    title: {
        '& span': { lineHeight: '25px' },
        '& span:first-child': { fontSize: 20, lineHeight: '35px' },
    },
    phoneCode: {
        '& input': {
            border: `1.5px solid ${theme.palette.primary.main}`,
            boxSizing: 'border-box',
            borderRadius: 8,
            textAlign: 'center',
            fontSize: 24,
            color: '#44444F',
        },
        '& span': {
            position: 'absolute',
            left: 'calc(50% - 9px)',
            width: 16,
            height: 2,
            background: '#CFD8DC',
        },
    },
}));

import React from 'react';
import { Input, Box, makeStyles, Typography } from '@material-ui/core';
import 'react-phone-input-2/lib/style.css';
import { getLanguage } from '../langauge/language';

export default function CustomInput({
    label,
    errMsg,
    maxLength,
    minLength,
    ...inputProps
}: React.ComponentProps<typeof Input> & {
    label?: string,
    errMsg?: string,
    maxLength?: number,
    minLength?: number,
}) {
    const classes = useStyles();

    const characters = (inputProps.value ?? '').toString().length
    const remainCharacters = maxLength - characters

    return (
        <Box display="flex" flexDirection="column" className={classes.root} mb={2}>
            <Typography variant="h5" component="label" color="textSecondary" style={{ marginBottom: label && 8 }}>
                {label}
            </Typography>
            <Input {...inputProps} />
            <Typography variant="h6" color="error" style={{ marginTop: errMsg && 8 }}>
                {errMsg}
            </Typography>

            {/* characters left in textarea */}
            {
                inputProps.multiline && maxLength &&
                <Box display="flex" justifyContent="flex-end">
                    <Typography variant="h6" color={remainCharacters > 0 ? "textPrimary" : "error"} style={{ marginTop: 8 }}>
                        {
                            remainCharacters > 0
                                ? `${remainCharacters} ${getLanguage().charactersLeft}` + (minLength ? ` (${getLanguage().minimum} ${minLength})` : '')
                                : `${getLanguage().maximum} ${maxLength} ${getLanguage().characters} (${characters} ${getLanguage().tooMany})`
                        }
                    </Typography>
                </Box>
            }
        </Box>
    )
};

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTypography-body1': {
            fontSize: 20
        }
    },
}));

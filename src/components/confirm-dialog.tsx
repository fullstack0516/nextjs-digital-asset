import React from 'react';
import { Box, makeStyles, Typography, Dialog, Button, } from '@material-ui/core';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CustomDivider from './custom-divider';
import { useWindowSize } from '../utils/client/use-window-size';
import { getLanguage } from '../langauge/language';
import { Player } from '@lottiefiles/react-lottie-player';
import fetching from '../../public/lottie/loading-fetch.json';

export default function ConfirmDialog(props: {
    open: boolean
    onClose: () => void
    onSave: () => void
    message?: string
    loading?: boolean
}) {
    const classes = useStyles();
    const size = useWindowSize();

    return (
        <Dialog aria-labelledby="customized-dialog-title" open={props?.open} className={classes.dialog}>
            <MuiDialogContent>
                <Box p={size.width > 599 ? 3 : 1} display="flex" flexDirection="column" alignItems="center">
                    <Typography variant="h5" color="textPrimary" style={{ lineHeight: '32px' }}>
                        {props?.message ?? getLanguage().areYouSure}
                    </Typography>
                </Box>
            </MuiDialogContent>
            <CustomDivider />
            <MuiDialogActions>
                <Box display="flex" justifyContent="space-between" p={2} pb={2} width="100%">
                    <Button onClick={props?.onClose} color="secondary" variant="contained">
                        <Typography variant="h5">{getLanguage().cancel}</Typography>
                    </Button>
                    <Button disabled={props.loading} onClick={props?.onSave} color="primary" variant="contained">
                        {
                            props.loading &&
                            <Player
                                autoplay
                                loop
                                src={JSON.stringify(fetching)}
                                style={{ height: 25, width: 25, marginRight: 5 }}
                            />
                        }
                        <Typography variant="h5">{getLanguage().ok}</Typography>
                    </Button>
                </Box>
            </MuiDialogActions>
        </Dialog>
    );
}

const useStyles = makeStyles(() => ({
    dialog: {
        '& .MuiDialog-paper': {
            maxWidth: '500px !important'
        },
        position: 'relative'
    },
}));

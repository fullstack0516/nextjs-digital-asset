import React from 'react';
import { Button, Box, Typography } from '@material-ui/core';
import { dispatchModal } from '../utils/client/modal-state';
import { getLanguage } from '../langauge/language';
import { Player } from '@lottiefiles/react-lottie-player';
import error from '../../public/lottie/error.json';
import { useWindowSize } from '../utils/client/use-window-size';
import CustomDivider from './custom-divider';

export default function ModalError(props: { text?: string }) {
    const size = useWindowSize();

    return (
        <Box display="flex" flexDirection="column" pt={1} width={size.width > 599 ? 500 : `${size.width - 40}px`}>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Player
                    autoplay
                    loop
                    src={JSON.stringify(error)}
                    style={{ height: 50, width: 50, }}
                />
                <Typography variant="h4" color="textSecondary" style={{ lineHeight: '32px', marginTop: 8 }}>{getLanguage().error}</Typography>
            </Box>
            <Box p={size.width > 599 ? 3 : 1} display="flex" flexDirection="column" alignItems="center">
                <Typography variant="h5" color="textPrimary" style={{ lineHeight: '32px', textAlign: 'center' }}>{props.text ?? 'Oops! Something went wrong!'}</Typography>
            </Box>
            <CustomDivider />
            <Box p={2} display="flex" justifyContent="center">
                <Button variant="contained" onClick={() => dispatchModal({ type: 'hide' })} color="primary">Ok</Button>
            </Box>
        </Box>
    );
}

export function ModalAlert(props: { text?: string }) {
    const size = useWindowSize();

    return (
        <Box display="flex" flexDirection="column" pt={1} width={size.width > 599 ? 500 : `${size.width - 40}px`}>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Player
                    autoplay
                    loop
                    src={JSON.stringify(error)}
                    style={{ height: 50, width: 50, }}
                />
            </Box>
            <Box p={size.width > 599 ? 3 : 1} display="flex" flexDirection="column" alignItems="center">
                <Typography variant="h5" color="textPrimary" style={{ lineHeight: '32px', textAlign: 'center' }}>{props.text ?? 'Oops! Something went wrong!'}</Typography>
            </Box>
            <CustomDivider />
            <Box p={2} display="flex" justifyContent="center">
                <Button variant="contained" onClick={() => dispatchModal({ type: 'hide' })} color="primary">Ok</Button>
            </Box>
        </Box>
    );
}

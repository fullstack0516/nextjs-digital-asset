import React from 'react';
import { Box, } from '@material-ui/core';
import { Player } from '@lottiefiles/react-lottie-player';
import noPage from '../../public/lottie/404.json';
import { useWindowSize } from '../utils/client/use-window-size';

export default function Custom404() {
    const size = useWindowSize()
    return (
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
            <Player
                autoplay
                loop
                src={JSON.stringify(noPage)}
                style={{ width: size.width > 599 ? 500 : `${size.width - 100}px` }}
            />
        </Box>
    );
}

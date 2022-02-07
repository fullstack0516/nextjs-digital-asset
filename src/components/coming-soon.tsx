import React from 'react';
import { Box, Typography } from "@material-ui/core";
import { Player } from '@lottiefiles/react-lottie-player';
import comingSoon from '../../public/lottie/coming_soon.json';
import { getLanguage } from '../langauge/language';
import { useWindowSize } from '../utils/client/use-window-size';

export default function ComingSoon() {
    const size = useWindowSize()
    return (
        <Box display="flex" alignItems="center" flexDirection="column">
            <Player
                autoplay
                loop
                src={JSON.stringify(comingSoon)}
                style={{ width: size.width > 599 ? 500 : `${size.width - 100}px`, }}
            />
            <Typography variant="h3" color="primary">{getLanguage().comingSoon}</Typography>
        </Box>

    )
}

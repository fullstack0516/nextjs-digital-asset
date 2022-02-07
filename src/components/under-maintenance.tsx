import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import maintenance from '../../public/lottie/maintenance.json';
import { useWindowSize } from '../utils/client/use-window-size';
import { WebsiteStatus } from '../models/website-status';

export default function UnderMaintenance(props: {
    status: WebsiteStatus
}) {
    const size = useWindowSize()
    return (
        <Box display="flex" justifyContent="center" height="100%" flexDirection="column" alignItems="center" padding="0 24px">
            <Player
                autoplay
                loop
                src={JSON.stringify(maintenance)}
                style={{
                    width: size.width > 799 ? 700 : `${size.width - 100}px`,
                    marginBottom: 24
                }}
            />
            <Typography
                variant="h3"
                style={{
                    color: '#040404',
                    fontSize: size.width > 599 ? 19 : 14,
                    fontWeight: 300,
                    textAlign: 'center',
                    width: size.width > 599 ? '75%' : '100%'
                }}
            >
                {props?.status?.maintenanceMessageForUsers}
            </Typography>
        </Box>
    );
}

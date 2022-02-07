import React, { useRef } from 'react';
import { Box } from "@material-ui/core";
import ReactPlayer from 'react-player';

type Props = {
  src?: string;
};

export const VideoPlayer: React.FC<Props> = ({ src }) => {
  const videoRef = useRef<ReactPlayer>();

  return (
    <Box className='video-player'>
      <ReactPlayer style={{ position: 'absolute' }} ref={videoRef} url={src} width='100%' height='100%' controls />
    </Box>
  );
};

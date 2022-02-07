import React, { useCallback, useState, useRef } from 'react';
import { Button, Box, Dialog, Typography, makeStyles, } from '@material-ui/core';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { useDropzone } from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import { useWindowSize } from '../utils/client/use-window-size';
import { uploadPhoto } from '../utils/client/user-actions';
import CustomDivider from './custom-divider';
import { getLanguage } from '../langauge/language';
import SvgUpload from '../../public/upload-1.svg';
import 'react-image-crop/dist/ReactCrop.css';
import Loading from './loading';

export default function UploadImageEditor(props: {
    open?: boolean,
    close?: () => void,
    cropMode?: 'circle' | 'square',
    ratio?: number | undefined,
    onSave?: (url: string) => void,
    resizeHeightBackend?: number
}) {
    const classes = useStyles();
    const size = useWindowSize();
    const imgRef = useRef(null);
    const [upImg, setUpImg] = useState<string | ArrayBuffer>(null);
    const [uploading, setUploading] = useState<boolean | undefined>(null)
    const [crop, setCrop] = useState<any | undefined>({ unit: '%', width: 30, aspect: props.ratio ?? 1 });
    const [completedCrop, setCompletedCrop] = useState<any | undefined>(null);

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles[0]) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setUpImg(reader.result));
            reader.readAsDataURL(acceptedFiles[0]);
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/jpeg, image/png' })

    const handleUpload = async () => {
        setUploading(() => true)
        const canvas = document.createElement('canvas');
        const image = imgRef.current;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = 5

        canvas.width = completedCrop.width * pixelRatio;
        canvas.height = completedCrop.height * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height
        );

        // convert canvas to an image file to upload it on storage
        canvas.toBlob(async (blob) => {
            let data = new FormData();
            data.append('photo', blob);
            props?.resizeHeightBackend && data.append('resizeHeight', props.resizeHeightBackend.toString())
            // download url saved on storage
            const url = await uploadPhoto(data) as string;

            if (url && props?.onSave) {
                await props.onSave(url);
            }
            setUpImg(null);
            props?.close && props.close();
            setUploading(() => false)
        })

    }

    const handleCancel = () => {
        setUpImg(null);
        props?.close && props.close();
    }

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    const minSize = size.width > 599 ? 300 : 250;

    return (
        <Dialog aria-labelledby="customized-dialog-title" open={props?.open ?? false} className={classes.root}>
            <MuiDialogContent >
                <Box p={size.width > 599 ? 3 : 0} pr={size.width > 599 ? 6 : 0} pl={size.width > 599 ? 6 : 0} display="flex" flexDirection="column" alignItems="center">
                    <Typography variant="h5" color="textPrimary" style={{ lineHeight: '32px' }}>
                        {getLanguage().uploadNewImg}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" style={{ lineHeight: '26px' }}>
                        {getLanguage().minimumImgSize}
                    </Typography>
                    {
                        upImg ?
                            // image previewer
                            (
                                <Box mt={2}>
                                    <ReactCrop
                                        src={upImg}
                                        onImageLoaded={onLoad}
                                        crop={crop}
                                        onChange={(c) => setCrop(c)}
                                        onComplete={(c) => setCompletedCrop(c)}
                                        circularCrop={props?.cropMode === 'circle'}
                                        style={{ minWidth: minSize, minHeight: minSize }}
                                    />
                                </Box>
                            )
                            :
                            // drop zone
                            (
                                <div {...getRootProps()} style={{ outline: 'none' }}>
                                    <input {...getInputProps()} />
                                    <Box
                                        width={size.width > 599 ? 356 : 300}
                                        height={180}
                                        mt={2}
                                        className={classes.dropZone}
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="center"
                                        alignItems="center"
                                        style={{ opacity: isDragActive && 0.5, borderColor: isDragActive && '#FF7534' }}
                                    >
                                        <Box display="flex" p={2} mb={2} >
                                            <SvgUpload width={16} height={16} />
                                        </Box>
                                        <Typography variant="h6" component="p">
                                            Drag and Drop or&nbsp;
                                            <Typography variant="h6" component="a" color="primary">{getLanguage().browse}</Typography>
                                        </Typography>
                                        <Typography variant="h6" component="p">to upload (max 20M)</Typography>
                                    </Box>
                                </div>
                            )
                    }
                </Box>
            </MuiDialogContent>
            <CustomDivider />
            <MuiDialogActions>
                <Box display="flex" justifyContent="space-between" p={2} pb={3} width="100%" className={classes.actions}>
                    <Button variant="contained" color="secondary" onClick={handleCancel}>
                        {getLanguage().cancel}
                    </Button>
                    <Button variant="contained" color="primary" type="submit" onClick={handleUpload} disabled={!upImg || uploading}>
                        {getLanguage().saveChanges}
                    </Button>
                </Box>
            </MuiDialogActions>
            {
                uploading &&
                <Box
                    position="absolute"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                    style={{ backdropFilter: uploading && 'blur(1px)' }}
                >
                    <Loading size={150} />
                </Box>
            }
        </Dialog>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiDialog-paper': {
            maxWidth: '500px !important'
        },
        position: 'relative'
    },
    actions: {
        [theme.breakpoints.down('xs')]: {
            flexFlow: 'column-reverse',
            '& button:nth-child(2)': {
                marginBottom: 12
            },
        },
    },
    dropZone: {
        background: theme.palette.background.default,
        borderStyle: 'dashed',
        border: '2px dashed #8F92A1',
        borderRadius: theme.spacing(2),
        cursor: 'pointer',
        '& > div': {
            mixBlendMode: 'normal',
            border: '2px solid #F2F2FE',
            borderRadius: theme.spacing(2),
        },
        '& > p': {
            lineHeight: '20px',
            color: '#90A7B3',
        }
    },
}));

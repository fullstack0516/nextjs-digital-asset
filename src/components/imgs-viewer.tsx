import ImageViewer from 'react-simple-image-viewer';

export default function ImgsViewer(props: {
    images: string[],
    onClose: () => void,
    currImg: string
}) {
    const { images, currImg, onClose } = props

    return <ImageViewer
        src={images}
        currentIndex={images.findIndex(image => image === currImg)}
        disableScroll={false}
        closeOnClickOutside={true}
        onClose={onClose}
    />
}

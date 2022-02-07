import Image from 'next/image'

export default function Loading(props: {
    size?: number
}) {
    const width = props?.size ?? 50
    const height = props?.size ?? 50

    return (
        <Image src="/animation.gif" width={width} height={height} />
    );
}

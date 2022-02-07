import SvgLogoDark from '../../public/logo_dark.svg';
import SvgLogoLight from '../../public/logo_light.svg';

export default function Logo(props: {
    darkMode?: boolean,
    height?: number,
    width?: number
}) {
    const { darkMode = false, height = 50, width = 90 } = props
    const handleClick = () => {
        window.location.href = "/"
    }

    return (
        <>
            {
                darkMode
                    ? <SvgLogoLight width={width} height={height} onClick={handleClick} style={{ cursor: 'pointer' }} />
                    : <SvgLogoDark width={width} height={height} onClick={handleClick} style={{ cursor: 'pointer' }} />
            }
        </>
    );
}

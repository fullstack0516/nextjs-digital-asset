import React, { useContext } from 'react';
import { Box, makeStyles, Switch, Typography } from '@material-ui/core';
import { PageContext } from '../../utils/client/page-state';
import { useWindowSize } from '../../utils/client/use-window-size';
import { getLanguage } from '../../langauge/language';

export default function Navbar(props: {
    darkMode: boolean,
    onSetDark: (event: React.ChangeEvent<HTMLInputElement>) => void,
}) {
    const { darkMode, onSetDark } = props
    const classes = useStyles();
    const size = useWindowSize()
    const pageContext = useContext(PageContext)

    const site = pageContext.pageState.site

    return (
        <Box pt={size.width > 599 ? 5 : 3} pb={size.width > 599 ? 5 : 3}>
            <Box
                display="flex"
                justifyContent="space-between"
                flexDirection={size.width > 599 ? 'row' : 'column'}
                alignItems="center"
                className={classes.root}
            >
                <Box
                    display={size.width > 599 ? "grid" : "flex"}
                    gridTemplateColumns="38px 1fr"
                    gridGap={12}
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    onClick={() => window.location.href = `/pages/${site.url}`}
                >
                    <img src={site?.siteIcon?.url} />
                    <Box display="flex" alignItems="center" height={55} className="site-name-border">
                        <Typography
                            style={{
                                color: darkMode && 'white',
                                fontWeight: 600,
                                wordBreak: 'break-word',
                                wordWrap: 'break-word',
                                fontSize: 24,
                                textAlign: size.width > 599 ? 'left' : 'center',
                                cursor: 'pointer'
                            }}
                            className="site-name"
                        >
                            {site?.name}
                        </Typography>
                    </Box>
                </Box>
                {/* dark/white mode switch */}
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mt={size.width > 599 ? 0 : 3}
                >
                    <Typography color={darkMode ? "secondary" : "primary"} style={{ fontSize: 15, fontWeight: 600 }}>{getLanguage().lightMode}</Typography>
                    <Switch
                        checked={darkMode}
                        onChange={onSetDark}
                        color="primary"
                    />
                    <Typography color={darkMode ? "secondary" : "primary"} style={{ fontSize: 15, fontWeight: 600 }}>{getLanguage().darkMode}</Typography>
                </Box>
            </Box>
        </Box>
    )
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        '& img': {
            width: '38px !important',
            height: 38,
        },
        '& .MuiSwitch-track': {
            background: theme.palette.primary.main,
            opacity: 1
        }
    },
}));

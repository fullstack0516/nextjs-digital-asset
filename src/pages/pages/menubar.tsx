import React, { useContext } from 'react';
import { Box, Hidden } from '@material-ui/core';
import Account from '../../layouts/main-layout/top-bar/account';
import { getLanguage } from '../../langauge/language';
import SvgMySites from '../../../public/my-sites.svg';
import SvgDashboardMenu from '../../../public/dashboard-menu.svg';
import SvgMySitesLight from '../../../public/my-sites-light.svg';
import SvgDashboardMenuLight from '../../../public/dashboard-menu-light.svg';
import SvgDiscover from '../../../public/discover.svg';
import StyledTab from '../../components/styled-tab';
import AppCoin from '../../layouts/main-layout/top-bar/app-coin';
import MultiLang from '../../layouts/main-layout/top-bar/multi-lang';
import Logo from '../../components/logo';
import { UserContext } from '../../utils/client/user-state';
import Notifications from '../../layouts/main-layout/top-bar/notifications';
import { useWindowSize } from '../../utils/client/use-window-size';

export default function Menubar(props: {
    darkMode?: boolean,
}) {
    const { darkMode } = props
    const userCtx = useContext(UserContext)

    const user = userCtx.userState.user
    const size = useWindowSize()

    const handleMove = (location: string) => () => {
        window.location.href = location
    }

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="0px 24px"
            boxShadow={darkMode ? "rgb(51, 51, 51) 0px -1px 0px inset" : "inset 0px -1px 0px #F6F6F9"}
            height={70}
        >
            <Box display="flex" alignItems="center">
                <Logo darkMode={darkMode} />
                {
                    user ?
                        <Hidden smDown>
                            <Box display="flex">
                                <StyledTab
                                    darkMode={darkMode}
                                    label={getLanguage().dashboard}
                                    icon={darkMode ? <SvgDashboardMenuLight width={16} height={16} /> : <SvgDashboardMenu width={16} height={16} />}
                                    onClick={handleMove('/dashboard/my-data')}
                                />
                                <StyledTab
                                    darkMode={darkMode}
                                    label={getLanguage().mySites}
                                    icon={darkMode ? <SvgMySitesLight width={16} height={16} /> : <SvgMySites width={16} height={16} />}
                                    onClick={handleMove('/my-sites')}
                                />
                            </Box>
                        </Hidden>
                        :
                        <Hidden xsDown>
                            <StyledTab
                                darkMode={darkMode}
                                label={getLanguage().discover}
                                icon={darkMode ? <SvgDiscover width={16} height={16} fill="#FF7534" /> : <SvgDiscover width={16} height={16} />}
                                onClick={handleMove('/discover/')}
                            />
                        </Hidden>
                }
            </Box>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
                <MultiLang darkMode={darkMode} />
                <Account darkMode={darkMode} requiredOptions={size.width > 959 ? [] : ['dashboard', 'my-sites']} />
                {
                    user &&
                    <>
                        <AppCoin darkMode={darkMode} />
                        <Notifications />
                    </>
                }
            </Box>
        </Box>
    )
}

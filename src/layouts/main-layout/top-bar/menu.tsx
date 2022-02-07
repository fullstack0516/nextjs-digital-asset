import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { Box } from '@material-ui/core';
import StyledTabs from '../../../components/styled-tabs'
import StyledTab from '../../../components/styled-tab'
import { getLanguage } from '../../../langauge/language'
import { useContext } from 'react';
import { UserContext } from '../../../utils/client/user-state';
import SvgDiscover from '../../../../public/discover.svg';
import SvgDashboardMenu from '../../../../public/dashboard-menu.svg';
import SvgMySites from '../../../../public/my-sites.svg';
import SvgAdminMenu from '../../../../public/admin-menu.svg'

export default function CustomizedTabs() {
    const router = useRouter();
    const { pathname } = router;
    const [tabIndicatorIndex, setTabIndicatorIndex] = useState<number | false>(false);
    const userCtx = useContext(UserContext);
    const user = userCtx.userState.user;

    useEffect(() => {
        switch (pathname) {
            case '/discover':
                setTabIndicatorIndex(0)
                break;
            case '/dashboard':
            case '/dashboard/all':
            case '/dashboard/my-data':
            case '/dashboard/analysis':
                setTabIndicatorIndex(1)
                break;
            case '/my-sites':
            case '/my-sites/[siteUrl]':
                setTabIndicatorIndex(2)
                break;
            default:
                setTabIndicatorIndex(false)
                break;
        };
    }, [pathname])

    const handleChange = (event, newValue) => {
        if (newValue && !user) {
            return window.location.href = '/auth'
        }
        setTabIndicatorIndex(newValue);
        switch (newValue) {
            case 0:
                return window.location.href = '/discover'
            case 1:
                return window.location.href = '/dashboard/my-data'
            case 2:
                return window.location.href = '/my-sites'
            case 3:
                return window.location.href = '/admin/overview'
            default:
                break;
        };
    };

    return (
        <Box display="flex" justifyContent="center" height={70} flexGrow={1}>
            <Box width="max-content">
                <StyledTabs value={tabIndicatorIndex} onChange={handleChange} aria-label="styled tabs example">
                    <StyledTab label={getLanguage().discover} icon={<SvgDiscover width={16} height={16} />} />
                    <StyledTab label={getLanguage().dashboard} icon={<SvgDashboardMenu width={16} height={16} />} />
                    <StyledTab label={getLanguage().mySites} icon={<SvgMySites width={16} height={16} />} />
                    {
                        user?.isAdmin && <StyledTab label={getLanguage().admin} icon={<SvgAdminMenu width={16} height={16} />} />
                    }
                </StyledTabs>
            </Box>
        </Box>
    );
}

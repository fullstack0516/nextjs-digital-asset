import type { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import { Loading } from '../partials/loading';
import { AuthState, AuthStoreProvider } from '../utils/client/auth-state';
import { dispatchUser, UserStoreProvider } from '../utils/client/user-state';
import { ModalStoreProvider } from '../utils/client/modal-state';
import { loadedUrl } from '../utils/client/graphql-client';
import { fetchUser } from '../utils/client/user-actions';
import Layout from './_layout'
import { createTheme } from "../theme";
import { PublicRoutes } from "../variables";
import { WebsiteStatus } from "../models/website-status";
import UnderMaintenance from "../components/under-maintenance";
import { fetchWebsiteStatus, server } from '../utils/server/graphql_server';
import '../styles/globals.css';
import '../styles/high-res-flags.css';

interface InitProps extends AppProps {
    websiteStatus?: WebsiteStatus;
}

function Application({ Component, pageProps, websiteStatus }: InitProps) {
    return (
        <AuthStoreProvider>
            <UserStoreProvider>
                <Loading>
                    <ThemeProvider theme={createTheme()}>
                        {
                            websiteStatus?.isUnderMaintenance ?
                                <UnderMaintenance status={websiteStatus} />
                                :
                                <ModalStoreProvider>
                                    <Layout>
                                        <Component {...pageProps} />
                                    </Layout>
                                </ModalStoreProvider>
                        }
                    </ThemeProvider>
                </Loading>
            </UserStoreProvider>
        </AuthStoreProvider>
    );
}

Application.getInitialProps = async (context) => {
    const { pathname, res, req } = context.ctx;
    // check if website is under maintenance mode.
    const { isLoggedIn } = await server({ req, res })

    const websiteStatus = await fetchWebsiteStatus();
    if (!websiteStatus || websiteStatus?.isUnderMaintenance) {
        return { websiteStatus: websiteStatus }
    }

    // basic root path
    if (pathname === '/') {
        res.writeHead(307, { Location: "/discover" });
        return res.end();
    }
    if (PublicRoutes.includes(pathname) || process.browser) {
        return {};
    }

    if (!isLoggedIn) {
        // temporarily redirect
        res.writeHead(307, { Location: "/auth" });
        return res.end();
    }
    return {};
}

export default Application;

export const refreshApp = async (authState: AuthState) => {
    if (loadedUrl) {
        if (authState.jwt) {
            return await fetchUser();
        }
        return dispatchUser({ type: 'setUser' })
    }
};

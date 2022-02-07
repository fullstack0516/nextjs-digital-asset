import React, { useContext, useEffect, useState } from 'react';
import loading from '../../public/lottie/loading-start.json';
import { Player } from '@lottiefiles/react-lottie-player';
import { logout } from '../utils/client/auth-actions';
import { refreshApp } from '../pages/_app';
import { findDevServerUrl } from '../utils/client/graphql-client';
import { AuthContext } from '../utils/client/auth-state';
import cookieCutter from 'js-cookie';

/**
 * App Loading screen.
 */
export const Loading = ({ children }: any) => {
    const authContext = useContext(AuthContext);
    const [isAuthLoaded, setAuthLoaded] = useState(false);

    useEffect(() => {
        findDevServerUrl()
            .then((url) => {
                cookieCutter.set('server-url', url);
                return;
            })
            .finally(() => {
                setAuthLoaded(true);
                refreshApp(authContext.authState);
            })
            .catch((e) => {
                console.error('Error on load', e);
                if (e?.response?.data?.statusCode === 'unauthorised') {
                    logout();
                }
            });
    }, []);

    const Loading = () => {
        return (
            <div className="centerLoading">
                <Player
                    autoplay
                    loop
                    src={JSON.stringify(loading)}
                    style={{
                        height: 400,
                        width: 400,
                    }}
                />
            </div>
        );
    };

    return <div>{isAuthLoaded ? children : Loading()}</div>;
};

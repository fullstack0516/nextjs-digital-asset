import React, { createContext } from 'react';
import { useReducer } from 'react';
import { setAuthTokenHeaders } from './graphql-client';
import cookieCutter from 'js-cookie';

export type AuthState = {
    jwt?: string;
};

export type AuthAction = {
    type: 'setAuthToken' | 'logout';
    data?: string;
};

const defaultState = {};

const initialState: AuthState = { jwt: cookieCutter.get('jwt') } ?? defaultState;

setAuthTokenHeaders(initialState.jwt ?? '');

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'setAuthToken':
            const token = action.data as string;
            cookieCutter.set('jwt', token, { expires: 99 * 365 });
            setAuthTokenHeaders(token);
            return {
                ...state,
                jwt: token,
            };
        case 'logout':
            cookieCutter.set('jwt', null);
            setAuthTokenHeaders(null);
            return {
                ...state,
                jwt: undefined,
            };
        default:
            throw new Error('No action of type: ' + action.type);
    }
};

export const AuthContext = createContext<{
    authState: AuthState;
    dispatchAuth: React.Dispatch<AuthAction>;
}>({
    authState: initialState,
    dispatchAuth: () => null,
});

export let dispatchAuth: React.Dispatch<AuthAction>;

export const AuthStoreProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    dispatchAuth = dispatch;

    return <AuthContext.Provider value={{ authState: state, dispatchAuth: dispatch }}>{children}</AuthContext.Provider>;
};

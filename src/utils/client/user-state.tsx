import React, { createContext, useEffect } from 'react';
import { useReducer } from 'react';
import { Site } from '../../models/site';
import { User } from '../../models/user';
import { getIntialState, persistState } from './persistedState';

const STORAGE_KEY = 'userState';

type UserState = {
    user?: User;
    userSubscriptions?: { [siteUid: string]: Site },
    coin?: number
};

export type UserAction = {
    type: 'setUser' | 'setSubscriptions' | 'setCoin' | 'logout';
    data?: User | { [siteUid: string]: Site } | number;
};

const defaultState = {};

const initialState: UserState = getIntialState(STORAGE_KEY) ?? defaultState;

const userReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        case 'setUser':
            return {
                ...state,
                user: action.data as User,
            };
        case 'setSubscriptions':
            return {
                ...state,
                userSubscriptions: action.data as { [siteUid: string]: Site }
            }
        case 'setCoin':
            return {
                ...state,
                coin: action.data as number
            }
        case 'logout':
            return {
                ...state,
                user: undefined,
            };
        default:
            throw new Error('No action of type: ' + action.type);
    }
};

export const UserContext = createContext<{
    userState: UserState;
    dispatchUser: React.Dispatch<UserAction>;
}>({
    userState: initialState,
    dispatchUser: () => null,
});

export let dispatchUser: React.Dispatch<UserAction>;

export const UserStoreProvider = (props: {
    children: any,
}) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    useEffect(() => persistState(STORAGE_KEY, state), [state]);

    dispatchUser = dispatch;

    return <UserContext.Provider value={{ userState: state, dispatchUser: dispatch }}>{props.children}</UserContext.Provider>;
};

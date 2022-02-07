import React, { createContext, useEffect } from 'react';
import { useReducer } from 'react';
import { Page } from '../../models/page';
import { Site } from '../../models/site';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export type PageState = {
    page: Page | undefined,
    deviceMode: DeviceMode,
    site: Site
};

export type PageAction = {
    type: 'setPage' | 'setDevice' | 'setSite';
    data?: Page | DeviceMode | Site;
};

const initialState: PageState = {
    page: null,
    deviceMode: 'desktop',
    site: null,
};

const PageBuilderReducer = (state: PageState, action: PageAction): PageState => {
    switch (action.type) {
        case 'setPage':
            return {
                ...state,
                page: action.data as Page,
            };
        case 'setDevice':
            return {
                ...state,
                deviceMode: action.data as DeviceMode,
            };
        case 'setSite':
            return {
                ...state,
                site: action.data as Site
            }
        default:
            throw new Error('No action of type: ' + action.type);
    }
};

export const PageContext = createContext<{
    pageState: PageState;
    dispatchPage: React.Dispatch<PageAction>;
}>({
    pageState: initialState,
    dispatchPage: () => null,
});

export let dispatchPage: React.Dispatch<PageAction>;

export const PageStoreProvider = (props: {
    children: any,
    page?: Page | undefined,
    site?: Site
}) => {
    const [state, dispatch] = useReducer(PageBuilderReducer, initialState);

    // whenever page information will be updated
    useEffect(() => {
        if (props?.page) {
            dispatch({ type: 'setPage', data: props.page })
        }
    }, [props?.page])

    // whenever site information will be updated
    useEffect(() => {
        if (props?.site) {
            dispatch({ type: 'setSite', data: props.site })
        }
    }, [props?.site])

    dispatchPage = dispatch;

    return <PageContext.Provider value={{ pageState: state, dispatchPage: dispatch }}>{props?.children}</PageContext.Provider>;
};

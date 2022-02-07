import axios, { AxiosInstance } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { findDevServerUrl } from "../client/graphql-client";
import cookieCutter from 'js-cookie';

/**
 * Serverside axios
 */
export const withoutAuth = async (props: { req: NextApiRequest, res: NextApiResponse }): Promise<{ axiosWithoutAuth: AxiosInstance }> => {

    let url = props.req?.cookies['server-url'] as string

    /**
     * in some case, the cookie could not have server-url, so the app will get an error
     * especially, it can happen in the server-side rendering for the public pages.
     * we use withoutAuth for the public pages since authentication doesn't need.
     * 
     * so we need to get the server url and save it to cookie
     *  */
    if (!url) {
        url = await findDevServerUrl();
        cookieCutter.set('server-url', url);
    }

    const axiosInstance = axios.create({
        baseURL: url,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        }
    });

    return {
        axiosWithoutAuth: axiosInstance,
    }
}

import axios, { AxiosInstance } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getIntialState } from "../client/persistedState";

/**
 * Serverside axios
 */
export const withAuth = async (props: { req: NextApiRequest, res: NextApiResponse }): Promise<{ axiosWithAuth: AxiosInstance, isLoggedIn: boolean }> => {
    const jwt = props.req?.cookies['jwt'] as string
    const url = props.req?.cookies['server-url'] as string

    let isLoggedIn = false;
    if (jwt !== 'null') {
        try {
            const result = await axios.post(`${url}check-valid-token`, { jwt });
            isLoggedIn = result.status === 200
        } catch (e) {
            isLoggedIn = false
        }
    }

    const axiosInstance = axios.create({
        baseURL: url,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'authorization': jwt,
        }
    });

    return {
        axiosWithAuth: axiosInstance,
        isLoggedIn: isLoggedIn
    }
}

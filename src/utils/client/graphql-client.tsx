import axios from 'axios';
import { Client, CombinedError, createClient, defaultExchanges } from 'urql';
import { getLanguage } from '../../langauge/language';
import { dispatchModal } from './modal-state';
import ModalError from '../../components/modal-error';

let baseUrl = {
    httpRequestUrl: 'http://localhost:4000/',
    graphalUrl: 'http://localhost:4000/graphql',
};

if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENV === 'dev') {
    baseUrl = {
        httpRequestUrl: 'https://awake-d48d9.ew.r.appspot.com/',
        graphalUrl: 'https://awake-d48d9.ew.r.appspot.com/graphql/',
    };
}

// Last for prod live.
if (process.env.NEXT_PUBLIC_ENV === 'prod') {
    baseUrl = {
        httpRequestUrl: 'https://awake-prod.ew.r.appspot.com/',
        graphalUrl: 'https://awake-prod.ew.r.appspot.com/graphql/',
    };
}

export const makeGraphqlClient = (url?: string, jwt?: string) => createClient({
    url: baseUrl.graphalUrl, // url ?? TODO
    exchanges: [
        ...defaultExchanges,
    ],
    fetchOptions: () => {
        return {
            headers: {
                'authorization': jwt,
            },
            "Access-Control-Allow-Origin": "*",
        };
    },
});


export let loadedUrl = false;

export let axiosClient = axios.create({
    baseURL: baseUrl.httpRequestUrl,
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
    },
});

export let graphqlClient: Client = makeGraphqlClient()

export const setAuthTokenHeaders = (newToken: string) => {
    axiosClient.defaults.headers = {
        authorization: newToken,
        'Content-Type': 'application/json; charset=UTF-8',
    };

    graphqlClient = makeGraphqlClient(baseUrl.graphalUrl, newToken)
};

/**
 * Finds the running dev server, if it's production it instantely sets the url.
 */
export const findDevServerUrl = async (): Promise<string> => {
    // Shortcut
    loadedUrl = true;
    return baseUrl.graphalUrl;

    if (loadedUrl) {
        return axiosClient.defaults.baseURL;
    }

    if (process.env.NODE_ENV === 'production') {
        loadedUrl = true;
        return baseUrl.graphalUrl;
    }

    const urlsToTry = [
        'http://localhost:8080/api/',
        'http://192.168.0.227:8080/api/',
        'http://192.168.0.203:8080/api/',
        'http://10.0.2.2:8080/api/',
        'https://ss.ew.r.appspot.com/api/',
        baseUrl.graphalUrl,
    ];

    return await new Promise((resove, reject) => {
        Promise.allSettled(urlsToTry.map((url) => axios.get(url, { timeout: 250 }))).then((results) => {
            if (results.length === 0) {
                console.error('Could not find any dev URL.');
                reject();
                return '';
            }

            // Filter by success.
            results = results.filter((r) => r.status === 'fulfilled');

            // Use the first one
            // @ts-ignore
            const baseUrl = results[0].value.config.url;

            axiosClient.defaults.baseURL = baseUrl;
            console.log('Using dev server: ' + baseUrl + ', (of ' + results.length + ' success)');

            loadedUrl = true;

            resove(baseUrl);
        });
    });
};

export const graphqlErrorHandler = (error: CombinedError, fieldName?: string) => {
    console.log(error);
    const { message, extensions } = error.graphQLErrors[0]; // original message: [ex] "[GraphQL] no-upcoming-live-streams"
    const { code, helpers, helper } = extensions

    let modalErrorTxt = ''

    if ((code === 'BAD_USER_INPUT' || message === 'invalid-input') && (helpers || helper)) {
        modalErrorTxt = ''
    }

    switch (message) {
        case 'invalid-number':
            modalErrorTxt = getLanguage().invalidPhoneNumber
            break;
        case 'concurrent-send-sms':
            modalErrorTxt = getLanguage().concurrentSendSMS
            break;
        case 'send-smscode-failed':
            modalErrorTxt = getLanguage().sendSMSFailed
            break;
        case 'sms-code-incorrect':
            modalErrorTxt = getLanguage().incorrectSMSCode
            break;
        case 'sms-confirm-failed':
            modalErrorTxt = getLanguage().smsConfirmFailed
            break;
        case 'username-exists':
            modalErrorTxt = getLanguage().usernameExsitsPleaseTryAnother
            break;
        case 'send-verification-email-fail':
            modalErrorTxt = getLanguage().sendVerificationEmailFail
            break;
        case 'no-user-exists':
            modalErrorTxt = getLanguage().noUserExists
            break;
        case 'email-not-confirmed':
            modalErrorTxt = getLanguage().emailNotConfirmed
            break;
        case 'site-url-not-unique':
            modalErrorTxt = getLanguage().siteUrlNotUnique
            break;
        case 'page-url-not-unique':
            modalErrorTxt = getLanguage().pageUrlNotUnique
            break;
        case 'already-blacklisted':
            modalErrorTxt = getLanguage().alreadyBlacklisted
            break;
        case 'too-many-sections':
            modalErrorTxt = getLanguage().tooManySections
            break;
        case 'undefined-image-position':
            modalErrorTxt = getLanguage().undefinedImagePosition
            break;
        case 'not-site-owner':
            modalErrorTxt = getLanguage().noSiteOwner
            break;
        case 'first-not-header':
            modalErrorTxt = getLanguage().headerAlwaysFirst
            break;
        case 'already-reported':
            modalErrorTxt = getLanguage().alreadyReported
            break;
        case 'header-section-exist':
            modalErrorTxt = getLanguage().alreadyHeaderExists
            break;

        // case 'the-sub-does-not-exist':
        //     modalErrorTxt = getLanguage().
        //         break;
        // case 'already-subscribed':
        //     modalErrorTxt = getLanguage().
        //         break;
        default:
            modalErrorTxt = ""
            break;
    }

    if (message === 'rate-limit-reached' && fieldName) {
        if (fieldName === 'createComment') {
            modalErrorTxt = getLanguage().commentLimitReached
        }
    }

    dispatchModal({
        type: 'add',
        modal: <ModalError text={modalErrorTxt} />,
    });
};

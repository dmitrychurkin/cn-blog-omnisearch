import config from "./config";

const request = async (input: RequestInfo, init: RequestInit = {}) => {
    const headers = {
        ...init.headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-api-key': config.API_KEY
    };

    return fetch(input, {
        ...init,
        headers,
        mode: 'cors',
        body: init.body ? JSON.stringify(init.body) : undefined
    });
};

export default request;

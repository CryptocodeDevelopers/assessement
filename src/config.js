import axios from "axios";

function apiGet(url, data) {
    const headers = {
        'Content-Type': 'application/json',
    }
    return new Promise((res, rej) => {
        axios.get(`${url}`, data, { headers })
            .then(response => {
                return res(response.data);
            })
            .catch(error => {
                return rej(error);
            });
    });
}

function apiPost(url, data) {
    const headers = {
        'Content-Type': 'application/json',
    }
    return new Promise((res, rej) => {
        axios.post(`${url}`, data, { headers })
            .then(response => {
                return res(response.data);
            })
            .catch(error => {
                return rej(error);
            });
    });
}

export { apiGet, apiPost }
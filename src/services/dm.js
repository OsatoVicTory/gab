import axios from "axios";
import { SERVER } from '../config';
import Token from './token';

const options = () => {
    return {
        headers: { 'Authorization': Token.getToken() }
    }
};

const BASE_URL = `${SERVER}/api/v1/dm`;

export const sendDirectMessage = async (data) => {
    return axios.post(`${BASE_URL}/send`, data, options());
}

export const fetchScrappedData = async (link) => {
    // had to use new server cus of memory limit on SERVER affecting scrapping of data
    const serverUrl = 'https://backend-web-scraping.onrender.com/scrape/h/anything';
    return axios.post(serverUrl, { url: link, timeout: 63000 });
}

export const editDirectMessage = async (data) => {
    return axios.post(`${BASE_URL}/edit`, data, options());
}

export const receivedAllDirectMessages = async () => {
    return axios.get(`${BASE_URL}/received-all`, options());
}

export const receivedDirectMessage = async (id) => {
    return axios.get(`${BASE_URL}/received/${id}`, options());
}

export const readAllDirectMessages = async (id) => {
    return axios.get(`${BASE_URL}/read-all/${id}`, options());
}

export const readDirectMessage = async (id) => {
    return axios.get(`${BASE_URL}/read/${id}`, options());
}

export const deleteDirectMessageForAll = async (id) => {
    return axios.delete(`${BASE_URL}/all/${id}`, options());
}

export const deleteDirectMessageForMe = async (id, ids) => {
    return axios({ 
        method: 'delete', url: `${BASE_URL}/me/${id}`, 
        headers: { 'Authorization': Token.getToken() }, data: ids 
    });
}

export const reactDM = async (messageId, reaction) => {
    const data = { messageId, reaction };
    return axios.patch(`${BASE_URL}/react`, data, options());
}

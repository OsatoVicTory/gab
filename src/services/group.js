import axios from "axios";
import { SERVER } from '../config';
import Token from './token';

const options = () => {
    return {
        headers: { 'Authorization': Token.getToken() }
    }
};

const BASE_URL = `${SERVER}/api/v1/gc`;
const GROUP_URL = `${SERVER}/api/v1/group`;

export const fetchGroup = async (id) => {
    return axios.get(`${GROUP_URL}/fetch/${id}`, options());
};

export const createGroup = async (data) => {
    return axios.post(`${GROUP_URL}/create`, data, options());
}

export const joinGroup = async (id) => {
    return axios.get(`${GROUP_URL}/join/${id}`, options());
}

export const editGroup = async (id, data) => {
    return axios.post(`${GROUP_URL}/edit/${id}`, data, options());
}

export const makeAdmin = async (id, userId) => {
    return axios.patch(`${GROUP_URL}/admin/${id}/${userId}`, userId, options());
}

export const removeParticipant = async (id, userId) => {
    return axios.delete(`${GROUP_URL}/remove/${id}/${userId}`, options());
}

export const exitGroup = async (id) => {
    return axios.delete(`${GROUP_URL}/${id}`, options());
}

export const sendGroupMessage = async (data) => {
    return axios.post(`${BASE_URL}/send`, data, options());
}

export const editGroupMessage = async (data) => {
    return axios.post(`${BASE_URL}/edit`, data, options());
}

export const reactGroup = async (messageId, reaction) => {
    const data = { messageId, reaction };
    return axios.patch(`${BASE_URL}/react`, data, options());
}

export const fetchGroupWithMessages = async (id) => {
    return axios.get(`${BASE_URL}/fetch-with-messages/${id}`, options());
}

export const receivedAllGroupMessage = async () => {
    return axios.get(`${BASE_URL}/received-all`, options());
}

export const receivedGroupMessage = async (id) => {
    return axios.get(`${BASE_URL}/received/${id}`, options());
}

export const readAllGroupMessage = async (id) => {
    return axios.get(`${BASE_URL}/read-all/${id}`, options());
}

export const readGroupMessage = async (id) => {
    return axios.get(`${BASE_URL}/read/${id}`, options());
}

export const deleteGroupMessageForAll = async (id) => {
    return axios.delete(`${BASE_URL}/all/${id}`, options());
}

export const deleteGroupMessageForMe = async (id, ids) => {
    return axios({ 
        method: 'delete', url: `${BASE_URL}/me/${id}`, 
        headers: { 'Authorization': Token.getToken() }, data: ids 
    });
}

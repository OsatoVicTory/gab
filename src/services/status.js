import axios from "axios";
import { SERVER } from '../config';
import Token from './token';

const options = () => {
    return {
        headers: { 'Authorization': Token.getToken() }
    }
};

const BASE_URL = `${SERVER}/api/v1/status`;

export const fetchAllStatus = async () => {
    return axios.get(`${BASE_URL}`, options());
}

export const refreshStatus = async () => {
    return axios.get(`${BASE_URL}/refresh`, options());
}

export const uploadStatus = async (data) => {
    return axios.post(`${BASE_URL}/post`, data, options());
}

export const createStatus = async (data) => {
    return axios.post(`${BASE_URL}/create`, data, options());
}

export const viewStatusReq = async (id) => {
    const time = String(new Date());
    return axios.patch(`${BASE_URL}/${id}`, time, options());
}

export const deleteStatus = async (id) => {
    return axios.delete(`${BASE_URL}/${id}`, options());
}
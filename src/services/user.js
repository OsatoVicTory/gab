import axios from "axios";
import { SERVER } from '../config';
import Token from './token';

const options = () => {
    return {
        headers: { 'Authorization': Token.getToken() }
    }
};

const BASE_URL = `${SERVER}/api/v1/user`;

export const loginUser = async (userData) => {
    return axios.post(`${BASE_URL}/login`, userData, options());
}

export const signupUser = async (userData) => {
    return axios.post(`${BASE_URL}/signup`, userData, options());
};

export const verifyAccount = async (token) => {
    return axios.get(`${BASE_URL}/verify-account/${token}`, options());
};

export const forgotPassword = async (userData) => {
    return axios.post(`${BASE_URL}/forgot-password`, { userData }, options());
};

export const userIn = async () => {
    return axios.get(`${BASE_URL}/user-logged-in`, options());
};

export const forgotPasswordUpdate = async (token) => {
    return axios.get(`${BASE_URL}/forgot-password-update/${token}`, options());
};

export const resetPassword = async (userData) => {
    return axios.post(`${BASE_URL}/reset-password`, userData, options());
};

export const logOut = async () => {
    return axios.get(`${BASE_URL}/logout`, options());
};

export const updateUserAccount = async (userData) => {
    return await axios.post(`${BASE_URL}/update-account`, userData, options());
};

export const getUser = async (id) => {
    return await axios.get(`${BASE_URL}/get-user/${id}`, options());
};

export const findUser = async (value) => {
    return await axios.get(`${BASE_URL}/find-user/${value}`, options());
};

export const pinChat = async (id) => {
    return await axios.patch(`${BASE_URL}/pin/${id}`, id, options());
};

export const blockUser = async (id) => {
    return await axios.get(`${BASE_URL}/block/${id}`, options());
};

export const goodUserDetails = async (value) => {
    return await axios.get(`${BASE_URL}/good-userdetails/${value}`);
};

export const recommendUsers = async () => {
    return await axios.get(`${BASE_URL}/recommend-users`, options());
};

export const saveContact = async (data) => {
    return await axios.post(`${BASE_URL}/save-contact`, data, options());
};

export const barUsers = async (data) => {
    return await axios.post(`${BASE_URL}/bar-users`, data, options());
};
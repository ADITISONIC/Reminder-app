import axios from "axios";

const API_URL = `${import.meta.env.API_URL}/api/auth`; // Update with your backend URL

export const getEvents = () => {
  return axios.get(API_URL);
};

export const addEvent = (event) => {
  return axios.post(`${API_URL}/add`, event);
};

export const deleteEvent = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

// src/api/iptables.js

import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Replace with your Flask API URL

export const fetchRules = async () => {
  try {
    const response = await axios.get(API_URL + "/rules");
    return response.data;
  } catch (error) {
    console.error("Error fetching rules:", error);
    throw error;
  }
};

export const deleteRule = async (chain, ruleNum) => {
  try {
    await axios.delete(API_URL + `/rule/delete/${chain}/${ruleNum}`);
    return true;
  } catch (error) {
    console.error("Error deleting rule:", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL + "/all_users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const addRule = async (data) => {
  try {
    await axios.post(API_URL + `/rule/add`, data);
    return true;
  } catch (error) {
    console.error("Error adding rule:", error);
    throw error;
  }
};

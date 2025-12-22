import axiosInstance from "../axios";

export const getUsers = async (page = 1, limit = 5, search = "") => {
  try {
    const response = await axiosInstance.get(
      `/admin/users?page=${page}&limit=${limit}&search=${search}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

export const editUser = async (id) => {
  try {
    const response = await axiosInstance.put(
      `/admin/users/${id}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
};

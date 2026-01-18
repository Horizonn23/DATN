import { User } from "@/types/user";
import { useRequest } from "../Request";
import API from "../api";

export function useUserService() {
  const { Request } = useRequest();

  const getMyInfo = async () => {
    try {
      const { data } = await Request.get<User>(API.ME);
      return data;
    } catch (error) {
      console.error("GetMyInfo Error:", error);
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      const { data } = await Request.patch<User>(API.ME, profileData);
      return data;
    } catch (error) {
      console.error("UpdateProfile Error:", error);
      throw error;
    }
  };

  const getAllUsers = async () => {
    try {
      const { data } = await Request.get<User[]>(API.USERS);
      return data;
    } catch (error) {
      console.error("GetAllUsers Error:", error);
      throw error;
    }
  };

  const createUser = async (userData: Partial<User>) => {
    try {
      const { data } = await Request.post<User>(API.USERS, userData);
      return data;
    } catch (error) {
      console.error("CreateUser Error:", error);
      throw error;
    }
  };

  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      const { data } = await Request.patch<User>(
        `${API.USERS}/${id}`,
        userData,
      );
      return data;
    } catch (error) {
      console.error("UpdateUser Error:", error);
      throw error;
    }
  };

  return { getMyInfo, updateProfile, getAllUsers, createUser, updateUser };
}

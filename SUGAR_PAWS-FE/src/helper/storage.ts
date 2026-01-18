export const setAuthToken = (authToken: string) => {
  return localStorage.setItem("authToken", authToken);
};

export const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    return token;
  }
  return undefined;
};

export const clearStorage = () => {
  localStorage.clear();
};

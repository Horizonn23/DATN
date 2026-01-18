export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  NAME: /^[a-zA-Z]{2,}$/,
  USERNAME: /^[a-zA-Z0-9._-]{3,}$/,
  PHONE: /^[0-9]{10,11}$/,
  CODE: /^[0-9]{6}$/,
};

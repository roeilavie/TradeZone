// api
export const api_production = "http://localhost:49218/api";
export const api_python = "http://127.0.0.1:5000/newman";
export const validateEmail = (email) => {
  // regular expression to match email format
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};

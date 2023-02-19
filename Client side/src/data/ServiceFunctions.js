// get all the countries
import { useNavigate } from "react-router-dom";
import { api_production } from "../service/service";

export const getCountries = () => {
  return new Promise((resolve, reject) => {
    fetch(`${api_production}/Countries`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// get all the products
export const getProducts = () => {
  return new Promise((resolve, reject) => {
    fetch(`${api_production}/Products`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// get the transactions
export const getTotalTransactions = () => {
  return new Promise((resolve, reject) => {
    fetch(`${api_production}/Trades`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getUser = (values) =>{
  const url = `${api_production}/Users`;

  let user = {
    Email: values.email,
    Pwd: values.password,
  };
  console.log(user);
  return new Promise((resolve,reject) => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(user),
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      })
  });
};

export const insertUser = (values) =>{
  let user = {
    Email:values.email,
    First_name:values.given_name,
    Last_name:values.family_name
  };
  console.log(user);
  const url = `${api_production}/Users?pwd=${values.sub}`;
  return new Promise((resolve,reject) => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify(user),
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      })
  });
}

export const checkEmailExist = (email) =>{
  const url = `${api_production}/Users?email=${email}`;
  return new Promise((resolve,reject) =>{
    fetch(url, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json; charset=UTF-8",
        Accept: "application/json; charset=UTF-8",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      })
  });
}

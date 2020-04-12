import axios from "axios";
export const api_base ="127.0.0.1:5000/api/"

const call = axios.create({
  headers: {
    accept: "application/json",
    "Content-Type": "application/json"
  }
});

export const callApiAsPromise = (method, url, params, body) => {
  return call({
    method: method,
    url:  url,
    params: params,
    data: body
  });
};


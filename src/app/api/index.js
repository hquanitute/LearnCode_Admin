import axios from "axios";
export const api_base ="https://learn-server-api.herokuapp.com/api/"

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


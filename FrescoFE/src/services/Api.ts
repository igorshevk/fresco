import axios from 'axios';
import Auth from './Auth';
import History from './History';

class API {
  get(endPoint, params, queryParams) {
    endPoint = this.makeUrl(endPoint, params, queryParams);
    return this.makeRequest({
      method: 'GET',
      url: endPoint,
    });
  }

  post(endPoint, data, params, queryParams) {
    endPoint = this.makeUrl(endPoint, params, queryParams);
    return this.makeRequest({
      method: 'POST',
      url: endPoint,
      data: data,
    });
  }

  makeRequest(config) {
    const token = Auth.getToken();
    config.headers = {
      Authorization: `Bearer ${token}`,
    };

    axios.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (!error.response) {
          error.response = {
            data: 'Network error',
            status: 500,
          };
        }
        if (error.response.status === 401) {
          Auth.clearToken();
          History.push('/login/admin');
          throw error;
        }
        return Promise.reject(error);
      },
    );
    config.baseURL = `${process.env.REACT_APP_BASE_URL}`;
    return axios(config);
  }

  makeUrl(endPoint, params, queryParams) {
    if (params && Object.keys(params).length) {
      Object.keys(params).forEach(key => {
        endPoint = endPoint.replace(`:${key}`, params[key]);
      });
    }
    if (queryParams && Object.keys(queryParams).length) {
      let index = 0;
      let query = '';
      for (const key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
          index++;
          if (index === Object.keys(queryParams).length) {
            query += `${key}=${queryParams[key]}`;
          } else {
            query += `${key}=${queryParams[key]}&`;
          }
        }
      }
      endPoint = `${endPoint}?${query}`;
    }
    return endPoint;
  }
}

export default new API();

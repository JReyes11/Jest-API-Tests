// const axios = require("axios");
import axios from "axios";
import { endpoints } from "../fixtures/parameters";

class apiRequests {
  async createUser(obj) {
    const params = await endpoints();
    const endpoint = `${params.baseUrl}${params.users}`;
    const conf = await new this.postConfig(endpoint, obj);
    return await new this.makeRequest(conf);
  }
  async getOrders() {
    const params = await endpoints();
    const endpoint = `${params.baseUrl}${params.orders}`;
    const config = await new this.getConfig(endpoint);
    return await new this.makeRequest(config);
  }
  async getUsers() {
    const params = await endpoints();
    const userEndpoint = `${params.baseUrl}${params.users}`;
    const config = await new this.getConfig(userEndpoint);
    return await new this.makeRequest(config);
  }
  async getUserById(id) {
    const params = await endpoints();
    const userEndpoint = `${params.baseUrl}${params.users}/${id}`;
    const config = await new this.getConfig(userEndpoint);
    return await new this.makeRequest(config);
  }
  async postOrders(obj) {
    const params = await endpoints();
    const endpoint = `${params.baseUrl}${params.orders}`;
    const conf = await new this.postConfig(endpoint, obj);
    return await new this.makeRequest(conf);
  }
  async updateOrder(obj) {
    const params = await endpoints();
    const endpoint = `${params.baseUrl}${params.orders}/${obj.id}`;
    const putConf = await new this.putConfig(endpoint, obj);
    return await new this.makeRequest(putConf);
  }
  async getProducts() {
    const params = await endpoints();
    const endpoint = `${params.baseUrl}${params.products}`;
    const config = await new this.getConfig(endpoint);
    return await new this.makeRequest(config);
  }
  async getConfig(endpoint) {
    return {
      method: "GET",
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
  async postConfig(endpoint, data) {
    return {
      method: "POST",
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
  }
  async putConfig(endpoint, data) {
    return {
      method: "PUT",
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
  }
  async makeRequest(headers) {
    try {
      return await axios(headers).then(function (response) {
        return response;
      });
    } catch (e) {
      return e.response;
    }
  }
}

export default new apiRequests();

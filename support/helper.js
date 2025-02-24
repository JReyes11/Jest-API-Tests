import dayjs from "dayjs";
import { faker } from "@faker-js/faker";
import api from "./apiRequests.js";
import userFixtures from "../fixtures/users";
import { endpoints } from "../fixtures/parameters.js";
import { address } from '../fixtures/addressList.js'

class helper {
  async getRandomAddress() {
    const addressList = await address()
    return addressList.data[Math.floor(Math.random() * addressList.data.length-1)]    
  }
  async updateUserAddressObj(obj) {
    const randomAddress = await new this.getRandomAddress()    
    obj["address1"] = randomAddress.address1
    obj["address2"] = randomAddress.address2
    obj["city"] = randomAddress.city
    obj["state"] = randomAddress.state
    obj["zipCode"] = randomAddress.zipCode
    return obj;
  }
  async assertUserPayload(response, userObj) {
    expect(response.id).toBe(userObj.id);
    expect(response.email).toBe(userObj.email);
    expect(response.firstName).toBe(userObj.firstName);
    expect(response.lastName).toBe(userObj.lastName);
    expect(response.address1).toBe(userObj.address1);
    expect(response.city).toBe(userObj.city);
    expect(response.state).toBe(userObj.state);
    expect(response.zipCode).toBe(userObj.zipCode);
    expect(response.phoneNumber).toBe(userObj.phoneNumber);
    expect(response.country).toBe(userObj.country);
  }
  async assertOrdersPayload(response, userObj) {
    expect(response.email).toBe(userObj.email);
    expect(response.items.length).toBeGreaterThan(0);
    expect(response.items.length).toBe(response.totalItems);
    expect(response.totalPrice).toBeGreaterThan(0);
  }
  async mockNewUserObject() {    
    const randomAddress = await this.getRandomAddress()
    const userObj = await userFixtures.userKeys()
    const fullName = faker.person.fullName()
    const randomNumber = Math.floor(Math.random() * 99999);
    const letters = fullName.split(' ')[0].slice(0, fullName.split(' ')[0].length - 2);
    userObj["id"] = `${letters}${randomNumber}`;
    userObj["email"] = `${fullName.split(' ')[0]}${randomNumber}@${faker.hacker.noun()}.com`;
    userObj["firstName"] = fullName.split(' ')[0];
    userObj["lastName"] =  fullName.split(' ')[1];
    userObj["full_name"] = fullName;
    userObj["address1"] = randomAddress.address1
    userObj["address2"] = randomAddress.address2
    userObj["city"] = randomAddress.city
    userObj["state"] = randomAddress.state
    userObj["zipCode"] = randomAddress.zipCode
    userObj["phoneNumber"] = `(512)-555-${dayjs().format("mmss")}`;
    userObj["alternative_phone"] = "",
    userObj["company"] = `${faker.hacker.noun()} Enterprises`;
    userObj["country"] = "United States"
    return userObj;
  }
  async mockOrderRequestObject(userObj) {
    const parms = await endpoints();
    const endpoint = `${parms.baseUrl}${parms.products}`;
    const conf = await api.getConfig(endpoint);
    const productReq = await api.makeRequest(conf);
    const numberOfItems = Math.floor(Math.random() * 6) + 1;
    const itemSelections = [];
    for (var item = 0; item < numberOfItems; item++) {
      const randomIndex = Math.floor(Math.random() * productReq.data.length);
      const selection = productReq.data[randomIndex];
      itemSelections.push({
        id: selection.id,
        department: selection.department,
        price: selection.price,
      });
    }
    const totalCost = itemSelections
      .map((e) => e.price)
      .reduce((a, b) => {
        return a + b;
      });
    return {
      id: faker.string.uuid(),
      email: userObj.email,
      items: itemSelections,
      totalItems: itemSelections.length,
      totalPrice: totalCost,
    };
  }
}

export default new helper();

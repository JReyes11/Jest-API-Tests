import dayjs from "dayjs";
import { faker } from "@faker-js/faker";
import { userInfo } from "../fixtures/users";
import { endpoints } from "../fixtures/parameters.js";
import { products, orderObject } from "../fixtures/orders";
import { getConfig, postConfig, putConfig, makeRequest } from "./apiRequests.js";

export const assertUserPayload = async function (response, userObj) {
  expect(response.id).toBe(userObj.userId);
  expect(response.email).toBe(userObj.email);
  expect(response.firstName).toBe(userObj.firstName);
  expect(response.lastName).toBe(userObj.lastName);
  expect(response.address1).toBe(userObj.address1);
  expect(response.city).toBe(userObj.city);
  expect(response.state).toBe(userObj.state);
  expect(response.zipCode).toBe(userObj.zipCode);
  expect(response.phoneNumber).toBe(userObj.phoneNumber);
  expect(response.country).toBe(userObj.country);
};

export const assertOrdersPayload = async function (response, userObj) {
  expect(response.email).toBe(userObj.email);
  expect(response.items.length).toBeGreaterThan(0);
  expect(response.items.length).toBe(response.totalItems);
  expect(response.totalPrice).toBeGreaterThan(0);
};

export const mockNewUserObject = async function () {
  // Get user Object schema from existing user record
  const fixture = await userInfo();
  const userObj = fixture.data[0];
  // mock unique identifiers
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const randomNumber = Math.floor(Math.random() * 99999);
  const letters = firstName.slice(0, firstName.length - 2);
  // update userObj
  userObj["id"] = `${letters}${randomNumber}`;
  userObj["userId"] = `${letters}${randomNumber}`;
  userObj["firstName"] = firstName;
  userObj["lastName"] = lastName;
  userObj["full_name"] = `${firstName} ${lastName}`;
  userObj["company"] = `${lastName} Industrial `;
  userObj["address1"] = `${randomNumber} ${firstName} Ave`;
  userObj["email"] = `${firstName}${randomNumber}@${faker.hacker.noun()}.com`;
  userObj["phoneNumber"] = `(512)-555-${dayjs().format("mmss")}`;
  return userObj;
};

export const mockOrderObject = async function (userObj) {
  const parms = await endpoints();
  const endpoint = `${parms.baseUrl}${parms.products}`;
  const conf = await getConfig(endpoint);
  const productReq = await makeRequest(conf);  
  const numberOfItems = Math.floor(Math.random() * 6) + 1;
  const itemSelections = []
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
};

export const updateOrder = async function (orderObj) {
  const parms = await endpoints();
  const endpoint = `${parms.baseUrl}${parms.orders}/${orderObj.id}`;
  const putConf = await putConfig(endpoint, orderObj)
  return await makeRequest(putConf)
};

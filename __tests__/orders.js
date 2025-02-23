import "regenerator-runtime/runtime";
require("dotenv").config();
import api from "../support/apiRequests";
import userFixtures from "../fixtures/users";
import helper from "../support/helper";

describe("API Test Cases: Orders", function () {
  let userData;
  beforeEach(async function () {
    userData = await userFixtures.userIdAndEmail();
  });

  test("Existing order; Assert Items array and total price.", async function () {
    // Lookup order for random user; Assert payload response.
    const userObj = userData[Math.floor(Math.random() * userData.length)];
    const req = await api.getOrders();
    expect(req.status).toBe(200);
    const orderData = req.data.filter((s) => s.email == userObj.email)[0];
    await helper.assertOrdersPayload(orderData, userObj);
  });

  test("Create Order; Assert order returned in search results.", async function () {
    // Get random user.
    const req = await api.getUsers();
    expect(req.status).toBe(200);
    const randomUserObj = req.data[Math.floor(Math.random() * req.data.length)];

    // Mock the order object and make post request.
    const mockOrderObj = await helper.mockOrderRequestObject(randomUserObj);
    const request = await api.postOrders(mockOrderObj);
    expect(request.status).toBe(201);

    // Retrieve the created order and assert response object parity with the mocked Object.
    const orderReq = await api.getOrders();
    expect(orderReq.status).toBe(200);
    const recentlyCreatedOrder = orderReq.data.filter(
      (s) => s.id == mockOrderObj.id
    );
    expect(recentlyCreatedOrder.length).toBeGreaterThan(0);

    // perform assertions on the first object
    expect(recentlyCreatedOrder[0].email).toEqual(randomUserObj.email);
    expect(recentlyCreatedOrder[0].items.length).toEqual(
      recentlyCreatedOrder[0].totalItems
    );
    const sumOfItems = recentlyCreatedOrder[0].items
      .map((e) => e.price)
      .reduce((a, b) => {
        return a + b;
      });    
    expect(recentlyCreatedOrder[0].totalPrice).toEqual(sumOfItems);
  });

  test("Update Order; Remove item from order; Assert persistence.", async function () {
    // Get random order.
    const req = await api.getOrders();
    const moreThanOneItem = req.data.filter((s) => s.totalItems > 1);
    const randomOrder =
      moreThanOneItem[Math.floor(Math.random() * moreThanOneItem.length)];

    // remove one item; update totalItems and totalPrice of the order.
    const firstItemPrice = randomOrder.items[0].price;
    randomOrder.totalItems = randomOrder.totalItems - 1;
    randomOrder.totalPrice = randomOrder.totalPrice - firstItemPrice;
    randomOrder.items.splice(0, 1);

    // update the order.
    const updateTheOrder = await api.updateOrder(randomOrder);
    expect(updateTheOrder.status).toBe(200);

    //Assert the response
    expect(updateTheOrder.data.id).toBe(randomOrder.id);
    expect(updateTheOrder.data.items.length).toBe(randomOrder.totalItems);
    expect(updateTheOrder.data.totalItems).toBe(randomOrder.totalItems);
    expect(updateTheOrder.data.totalPrice).toBe(randomOrder.totalPrice);
  });

  test("Update Order; Add item to Order; Assert persistence.", async function () {
    // get a random product
    const req = await api.getProducts();
    const randomProduct =
      req.data[Math.floor(Math.random() * req.data.length - 1)];

    // get a random order
    const reqOrders = await api.getOrders();
    const data = reqOrders.data;
    const randomOrder =
      data[Math.floor(Math.random() * reqOrders.data.length - 1)];

    // push random product info to items array.
    randomOrder.items.push({
      id: randomProduct.id,
      department: randomProduct.department,
      price: randomProduct.price,
    });

    // update random orders totalItems and Price
    randomOrder.totalItems = randomOrder.totalItems + 1;
    randomOrder.totalPrice = randomOrder.totalPrice + randomProduct.price;

    // Update Order and perform assertions.
    const updateTheOrder = await api.updateOrder(randomOrder);
    expect(updateTheOrder.status).toBe(200);
    expect(updateTheOrder.data.items.length).toBe(randomOrder.totalItems);
    expect(updateTheOrder.data.totalItems).toBe(randomOrder.totalItems);
    expect(updateTheOrder.data.totalPrice).toBe(randomOrder.totalPrice);
  });
});

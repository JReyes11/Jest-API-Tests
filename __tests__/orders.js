import "regenerator-runtime/runtime";
require("dotenv").config();
import { getConfig, postConfig, makeRequest } from "../support/apiRequests";
import { endpoints } from "../fixtures/parameters";
import { userInfo } from "../fixtures/users";
import { assertOrdersPayload, mockOrderObject, updateOrder } from "../support/helper";

describe("API Test Cases: Orders", function () {
  let endpointInfo, userData, baseUrl
  beforeEach(async function () {
    endpointInfo = await endpoints();
    baseUrl = endpointInfo.baseUrl
    userData = await userInfo();
  });

  test("Look up existing order; Assert Items array and total price.", async function () {
    // Get a random user from the userInfo fixtures file.
    const userObj = userData.data[Math.floor(Math.random() * userData.data.length)]    
    const endpoint = `${baseUrl}${endpointInfo.orders}`; // define the orders endpoint.
    const config = await getConfig(endpoint); // Retrieve axios config object.
    const req = await makeRequest(config); // Make the API request
    expect(req.status).toBe(200); // Assert 200 response
    const orderData  = req.data.filter(s => s.email == userObj.email)[0] // filter orders for user.
    await assertOrdersPayload(orderData, userObj) // Perform assertions (response vs userFixture)    
  });

  test("Create Order; Assert order returned in search results.", async function () {
    // retrieve a random existing user. 
    const userEndpoint = `${baseUrl}${endpointInfo.users}`
    const config = await new getConfig(userEndpoint); // create axios config object.
    const req = await new makeRequest(config); // Make the API request
    expect(req.status).toBe(200); // Assert 201 response    
    const randomUserObj = req.data[Math.floor(Math.random() * req.data.length)]

    // Mock the order object and make post request.
    const mockOrderObj = await mockOrderObject(randomUserObj)    
    const endpoint = `${baseUrl}${endpointInfo.orders}`;        
    const conf = await new postConfig(endpoint, mockOrderObj);
    const request = await new makeRequest(conf); 
    expect(request.status).toBe(201); 

    // Retrieve the created order and assert response object parity with the mocked Object.
    const confObj = await new getConfig(endpoint); 
    const getOrders = await new makeRequest(confObj)
    expect(getOrders.status).toBe(200);    
    const recentlyCreatedOrder = getOrders.data.filter(s => s.id == mockOrderObj.id)
    expect(recentlyCreatedOrder.length).toBeGreaterThan(0)
    
    // perform assertions on the first object    
    expect(recentlyCreatedOrder[0].email).toEqual(randomUserObj.email)
    expect(recentlyCreatedOrder[0].items.length).toEqual(recentlyCreatedOrder[0].totalItems)
    const sumOfItems = recentlyCreatedOrder[0].items.map(e => e.price).reduce((a,b) => {
      return a + b
    })    
    expect(recentlyCreatedOrder[0].totalPrice).toEqual(sumOfItems)    
  })

  test("Update Order; Remove item from order; Assert persistence.", async function () {
    // Select a random existing order.
    const endpoint = `${baseUrl}${endpointInfo.orders}`;        
    const config = await getConfig(endpoint); 
    const req = await makeRequest(config); 
    const moreThanOneItem = req.data.filter(s => s.totalItems > 1)   
    const randomOrder = moreThanOneItem[Math.floor(Math.random() * moreThanOneItem.length)]       
    
    // remove one item; update totalItems and totalPrice of the order.    
    const firstItemPrice = randomOrder.items[0].price
    randomOrder.totalItems = randomOrder.totalItems -1
    randomOrder.totalPrice = randomOrder.totalPrice - firstItemPrice   
    randomOrder.items.splice(0,1)
    
    // update the order.
    const updateTheOrder = await updateOrder(randomOrder)
    expect(updateTheOrder.status).toBe(200)
    
    //Assert the response
    expect(updateTheOrder.data.id).toBe(randomOrder.id)
    expect(updateTheOrder.data.items.length).toBe(randomOrder.totalItems)
    expect(updateTheOrder.data.totalItems).toBe(randomOrder.totalItems)
    expect(updateTheOrder.data.totalPrice).toBe(randomOrder.totalPrice)    
  })

  test("Update Order; Add item to Order; Assert persistence.", async function () {
    // get a random product
    const endpoint = `${baseUrl}${endpointInfo.products}`;        
    const config = await getConfig(endpoint); 
    const req = await makeRequest(config);
    const randomProduct = req.data[Math.floor(Math.random() * req.data.length-1)]
        
    // get a random order
    const ordersEndpoint = `${baseUrl}${endpointInfo.orders}`;        
    const orderConfig = await getConfig(ordersEndpoint); 
    const reqOrders = await makeRequest(orderConfig);
    const data = reqOrders.data
    const randomOrder = data[Math.floor(Math.random() * reqOrders.data.length-1)]
    
    // push random product info to items array.
    randomOrder.items.push({
      id: randomProduct.id, 
      department: randomProduct.department, 
      price: randomProduct.price
    })

    // update random orders totalItems and Price
    randomOrder.totalItems = randomOrder.totalItems + 1
    randomOrder.totalPrice = randomOrder.totalPrice + randomProduct.price

    // Send PUT Request to update the order; Assert response. 
    const updateTheOrder = await updateOrder(randomOrder)
    expect(updateTheOrder.status).toBe(200)
    expect(updateTheOrder.data.items.length).toBe(randomOrder.totalItems)
    expect(updateTheOrder.data.totalItems).toBe(randomOrder.totalItems)
    expect(updateTheOrder.data.totalPrice).toBe(randomOrder.totalPrice)
  })
});

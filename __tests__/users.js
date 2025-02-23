import "regenerator-runtime/runtime";
require("dotenv").config();
import { getConfig, postConfig, makeRequest } from "../support/apiRequests";
import { endpoints } from "../fixtures/parameters";
import { userInfo } from "../fixtures/users";
import { assertUserPayload, mockNewUserObject } from "../support/helper";

describe("API Test Cases: Users", function () {
  let endpointInfo, userData, baseUrl
  beforeEach(async function () {
    endpointInfo = await endpoints();
    baseUrl = endpointInfo.baseUrl
    userData = await userInfo();

  });

  test("GET '/users'; Assert more than 1 record returned; Assert Object Keys.", async function () {
    // Retrieve userFixture and define endpoint
    const userObjKeys = Object.keys(userData.data[0])
    const endpoint = `${baseUrl}${endpointInfo.users}`;      
    const config = await getConfig(endpoint); // Retrieve axios config object.
    const req = await makeRequest(config); // Make the API request
    expect(req.status).toBe(200); // Assert 200 response
    expect(req.data.length).toBeGreaterThan(1) // assert more than one record returned.
    expect(userObjKeys).toEqual(Object.keys(req.data[0]))
  });

  test("POST '/users': Create user; Then GET '/users': Verify response object.", async function () {
    const userObj = await mockNewUserObject() // mock new user object
    const endpoint = `${baseUrl}${endpointInfo.users}`;        
    const config = await postConfig(endpoint, userObj); // create axios config object.
    const req = await makeRequest(config); // Make the API request
    expect(req.status).toBe(201); // Assert 201 response
    // Get request to retrieve the created user payload.
    const userEndpoint = `${baseUrl}${endpointInfo.users}/${userObj.id}`;
    const conf = await getConfig(userEndpoint)
    const request = await makeRequest(conf)
    expect(request.status).toBe(200); // Assert 200 response
    await assertUserPayload(request.data, userObj)     
  });

});

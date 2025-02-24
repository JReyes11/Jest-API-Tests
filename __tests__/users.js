import "regenerator-runtime/runtime";
require("dotenv").config();
import api from "../support/apiRequests";
import userFixtures from "../fixtures/users";
import helper from "../support/helper";

describe("API Test Cases: Users", function () {
  beforeEach(async function () {});

  test("Get random user, Assert expected object keys returned.", async function () {
    const userKeys = Object.keys(userFixtures.userKeys()); // user Fixture
    const req = await api.getUsers(); // get users
    expect(req.status).toBe(200); // Assert 200 response
    expect(req.data.length).toBeGreaterThan(1); // assert more than one record returned.
    expect(userKeys).toEqual(Object.keys(req.data[0])); // asssert response keys.
  });

  test("Create user, then confirm user object returned when using id.", async function () {
    const userObj = await helper.mockNewUserObject();    
    const req = await api.createUser(userObj);
    expect(req.status).toBe(201);
    const getUser = await api.getUserById(userObj.id);
    expect(getUser.status).toBe(200);
    await helper.assertUserPayload(getUser.data, userObj);
  });

  test("Create user, then Delete user; Assert user not found.", async function () {
    // create the user
    const userObj = await helper.mockNewUserObject();
    const req = await api.createUser(userObj);
    expect(req.status).toBe(201);

    // lookup the user
    const getUser = await api.getUserById(userObj.id);
    expect(getUser.status).toBe(200);
    await helper.assertUserPayload(getUser.data, userObj);

    // delete the user
    const deleteTheUser = await api.deleteUser(userObj.id);
    expect(deleteTheUser.status).toBe(200);

    // attempt to lookup the user. Assert 404 status returned.
    const userLookup = await api.getUserById(userObj.id);
    expect(userLookup.status).toBe(404);
  });

  test("Update user address, Assert updates are applied", async function () {
    // select a random user
    const users = await api.getUsers()
    expect(users.status).toBe(200);
    const selectedUser = users.data[Math.floor(Math.random() * users.data.length)]
    // collect the users current address information
    const currentAddress = {
      id: selectedUser.id,
      address1: selectedUser.address1, 
      address2: selectedUser.address2, 
      city: selectedUser.city, 
      state: selectedUser.state, 
      zipCode: selectedUser.zipCode
    }
    // update the user object with a new address.
    const updatedAddress = await helper.updateUserAddressObj(selectedUser)
    const updateUser = await api.updateUser(updatedAddress)
    expect(updateUser.status).toBe(200)

    // get the user and confirm the updated address returned in the response. 
    const findUser = await api.getUserById(selectedUser.id)
    const response = findUser.data
    expect(selectedUser.id).toBe(response.id)
    expect(selectedUser.email).toBe(response.email)
    expect(selectedUser.full_name).toBe(response.full_name)    
    expect(currentAddress.address1).not.toEqual(response.address1)
    expect(currentAddress.city).not.toEqual(response.city)
    expect(currentAddress.state).not.toEqual(response.state)
    expect(currentAddress.zipCode).not.toEqual(response.zipCode)
  })
});

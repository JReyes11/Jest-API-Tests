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
    // Create New User, then confirm new user returned when searching via ID.
    const userObj = await helper.mockNewUserObject();
    const req = await api.createUser(userObj);
    expect(req.status).toBe(201);
    const getUser = await api.getUserById(userObj.id);
    expect(getUser.status).toBe(200);
    await helper.assertUserPayload(getUser.data, userObj);
  });
});

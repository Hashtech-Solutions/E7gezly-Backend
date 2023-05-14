import { expect } from "chai";
import * as shopController from "../../controllers/shopController.js";
import errorHandler from "../../middleware/errorHandler.js";

describe("shopController", () => {
  let shopId;
  it("should create new shop", async () => {
    const req = {
      body: {
        userName: "test",
        password: "test",
        name: "test",
      },
    };
    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
        return this;
      },
    };

    await shopController.createShop(req, res, errorHandler);
    shopId = res.data._id;
    expect(res.statusCode).to.equal(200);
    expect(res.data).to.be.an("object");
  });

  it("shouldn't create invalid shop", async () => {
    const req = {
      body: {
        userName: "test2",
        password: "test",
      },
    };
    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
        return this;
      },
    };
    const newShop = await shopController.createShop(req, res, errorHandler);
    expect(res.statusCode).to.equal(400);
    expect(res.data).to.be.an("object");
  });

  it("should get all shops", async () => {
    const req = {};
    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
        return this;
      },
    };

    const shops = await shopController.getManyShops(req, res, errorHandler);
    expect(res.statusCode).to.equal(200);
    expect(res.data).to.be.an("array");
  });

  it("should get shop by id", async () => {
    const req = {
      params: {
        id: shopId,
      },
    };
    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
        return this;
      },
    };

    const shop = await shopController.getShopById(req, res, errorHandler);
    expect(res.statusCode).to.equal(200);
    expect(res.data).to.be.an("object");
  });
});

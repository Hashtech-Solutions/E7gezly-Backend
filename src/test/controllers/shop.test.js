import { expect } from "chai";
import * as shopAdminController from "../../controllers/shopAdminController.js";
import * as customerController from "../../controllers/customerController.js";
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

    await shopAdminController.createShop(req, res, errorHandler);
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
    const newShop = await shopAdminController.createShop(
      req,
      res,
      errorHandler
    );
    expect(res.statusCode).to.equal(400);
    expect(res.data).to.be.an("object");
  });

  it("should get all shops", async () => {
    const req = {
      query: { availableActivities: "ps4" },
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

    const shops = await shopAdminController.getManyShops(
      req,
      res,
      errorHandler
    );
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

    await shopAdminController.getShopById(req, res, errorHandler);
    expect(res.statusCode).to.equal(200);
    expect(res.data).to.be.an("object");
  });

  it("should reserve room", async () => {
    let req = {
      body: {
        roomId: global.room1Id,
        startTime: "2021-05-01T10:00:00.000Z",
        endTime: "2021-05-01T11:00:00.000Z",
      },
      user: {
        _id: global.customerId,
      },
      params: {
        shop_id: global.shopId,
      },
    };
    let res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
        return this;
      },
    };
    await customerController.bookRoom(req, res, errorHandler);
    const reservation = res.data;
    expect(res.statusCode).to.equal(200);
    expect(reservation.roomId).to.equal(room1Id);
  });

  it("should refuse overlapping reservation", async () => {
    let req = {
      body: {
        roomId: global.room1Id,
        startTime: "2021-05-01T10:30:00.000Z",
        endTime: "2021-05-01T12:00:00.000Z",
      },
      user: {
        _id: global.customerId,
      },
      params: {
        shop_id: global.shopId,
      },
    };
    let res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
        return this;
      },
    };
    await customerController.bookRoom(req, res, errorHandler);
    expect(res.statusCode).to.equal(400);
  });
});

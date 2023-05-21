import { expect } from "chai";
import * as customerController from "../../controllers/customerController.js";
import errorHandler from "../../middleware/errorHandler.js";
import * as adminController from "../../controllers/adminController.js";

describe("customer tests", () => {
  it("should book room", async () => {
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

  it("should get customer reservations", async () => {
    let req = {
      user: {
        _id: global.customerId,
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
    await customerController.getCustomerReservations(req, res, errorHandler);
    const reservations = res.data;
    expect(res.statusCode).to.equal(200);
    expect(reservations).to.be.an("array");
  });
});

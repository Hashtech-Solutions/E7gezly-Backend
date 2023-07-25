import { expect } from "chai";
import * as customerController from "../../controllers/customerController.js";
import errorHandler from "../../middleware/errorHandler.js";
import * as adminController from "../../controllers/adminController.js";
import bcrypt from "bcrypt";
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

  it("should get customer profile", async () => {
    const req = {
      user: {
        _id: global.customerId,
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
    await customerController.getCustomerProfile(req, res, errorHandler);
    const profile = res.data;
    expect(res.statusCode).to.equal(200);
    expect(profile.userName).to.equal("customer");
  });

  describe("customer profile update tests", () => {
    it("should update customer profile userName", async () => {
      const req = {
        body: {
          userName: "customer2",
        },
        user: {
          _id: global.customerId,
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
      await customerController.updateCustomerProfile(req, res, errorHandler);
      const profile = res.data;
      expect(res.statusCode).to.equal(200);
      expect(profile.userName).to.equal("customer2");
    });

    it("should update customer profile password", async () => {
      const req = {
        body: {
          oldPassword: "test",
          newPassword: "test2",
        },
        user: {
          _id: global.customerId,
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
      await customerController.updateCustomerProfile(req, res, errorHandler);
      const profile = res.data;
      expect(res.statusCode).to.equal(200);
      expect(bcrypt.compareSync("test2", profile.password)).to.equal(true);
    });
    it("should refuse update customer profile password if old password is wrong", async () => {
      const req = {
        body: {
          oldPassword: "test",
          newPassword: "test2",
        },
        user: {
          _id: global.customerId,
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
      await customerController.updateCustomerProfile(req, res, errorHandler);
      expect(res.statusCode).to.equal(400);
    });

    it("should refuse update customer profile userName if userName is already taken", async () => {
      const req = {
        body: {
          userName: "customer2",
        },
        user: {
          _id: global.customerId,
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
      await customerController.updateCustomerProfile(req, res, errorHandler);
      expect(res.statusCode).to.equal(400);
    });
  });
});

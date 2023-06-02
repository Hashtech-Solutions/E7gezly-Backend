import { expect } from "chai";
import * as shopController from "../../controllers/shopController.js";
import errorHandler from "../../middleware/errorHandler.js";

describe("reservation tests", () => {
  let reservationId;
  it("should add reservation", async () => {
    const req = {
      shopId: shopId,
      body: {
        // get iso string of date with local timezone
        startTime: new Date("2021-02-03T00:00:00.000Z").toISOString(),
        endTime: new Date("2021-02-03T01:00:00.000Z"),
        roomId: room2Id,
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
    await shopController.bookRoom(req, res, errorHandler);
    reservationId = res.data._id;
    expect(res.statusCode).to.equal(200);
    // expect res.data to equal { startTime: new Date("2021-02-03T00:00:00.000Z"), endTime: new Date("2021-02-03T01:00:00.000Z"), roomId: roomId, _id: res.data._id}
    expect(res.data.toObject()).to.deep.include({
      startTime: new Date("2021-02-03T00:00:00.000Z"),
      endTime: new Date("2021-02-03T01:00:00.000Z"),
      roomId: room2Id,
      shopId: shopId,
    });
  });

  it("should delete reservation", async () => {
    const req = {
      shopId: shopId,
      params: {
        reservation_id: reservationId,
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
    await shopController.deleteReservationById(req, res, errorHandler);
    expect(res.statusCode).to.equal(200);
  });
});

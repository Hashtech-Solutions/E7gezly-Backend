import { expect } from "chai";
import * as shopAdminController from "../../controllers/shopAdminController.js";
import * as shopModeratorController from "../../controllers/shopModeratorController.js";
import errorHandler from "../../middleware/errorHandler.js";

describe("shopModeratorController", () => {
  let roomId;
  let numVacancies;
  it("should add room to shop", async () => {
    const req = {
      shopId: shopId,
      body: {
        name: "test",
        hourlyRate: 40,
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
    const room = await shopModeratorController.addRoom(req, res, errorHandler);
    roomId = res.data.rooms.find((room) => room.name === "test")._id;
    expect(res.statusCode).to.equal(200);
    expect(res.data).to.be.an("object");
    // shouldn't add room with non-unqiue name
    const room2 = await shopModeratorController.addRoom(req, res, errorHandler);
    expect(res.statusCode).to.equal(400);
    expect(res.data).to.be.an("object");
  });

  it("should update room", async () => {
    const req = {
      shopId: shopId,
      body: {
        availableActivities: ["ps4"],
        hourlyRate: 10,
      },
      params: {
        room_id: roomId,
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
    await shopModeratorController.updateRoom(req, res, errorHandler);
    const updatedRoom = res.data.rooms.find(
      (room) => `${room._id}` === `${roomId}`
    );
    expect(res.statusCode).to.equal(200);
    expect(updatedRoom.hourlyRate).to.equal(10);
  });

  it("should check in test room", async () => {
    const req = {
      shopId: shopId,
      body: {
        roomId,
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
    await shopModeratorController.checkInRoom(req, res, errorHandler);
    numVacancies = res.data.numVacancies;
    expect(res.statusCode).to.equal(200);
    expect(
      res.data.sessions.find((session) => `${session.roomId}` === `${roomId}`)
    ).to.be.an("object");
    await shopModeratorController.checkInRoom(req, res, errorHandler);
    expect(res.statusCode).to.equal(400);
  });

  it("should check out test room", async () => {
    const req = {
      shopId: shopId,
      body: {
        roomId,
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
    await shopModeratorController.checkOutRoom(req, res, errorHandler);
    expect(res.statusCode).to.equal(200);
    expect(res.data.numVacancies).to.equal(numVacancies + 1);
    expect(
      res.data.sessions.find((session) => `${session.roomId}` === `${roomId}`)
    ).to.be.undefined;
  });
});

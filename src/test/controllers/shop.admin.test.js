import { expect } from "chai";
import * as shopController from "../../controllers/shopController.js";
import errorHandler from "../../middleware/errorHandler.js";

describe("shop admin tests", () => {
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
    const room = await shopController.addRoom(req, res, errorHandler);
    roomId = res.data.rooms.find((room) => room.name === "test")._id;
    expect(res.statusCode).to.equal(200);
    expect(res.data).to.be.an("object");
    // shouldn't add room with non-unqiue name
    const room2 = await shopController.addRoom(req, res, errorHandler);
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
    await shopController.updateRoom(req, res, errorHandler);
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
    await shopController.checkInRoom(req, res, errorHandler);
    numVacancies = res.data.numVacancies;
    expect(res.statusCode).to.equal(200);
    expect(
      res.data.sessions.find((session) => `${session.roomId}` === `${roomId}`)
    ).to.be.an("object");
    await shopController.checkInRoom(req, res, errorHandler);
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
    await shopController.checkOutRoom(req, res, errorHandler);
    expect(res.statusCode).to.equal(200);
    expect(res.data.numVacancies).to.equal(numVacancies + 1);
    expect(
      res.data.sessions.find((session) => `${session.roomId}` === `${roomId}`)
    ).to.be.undefined;
  });

  it("should create shop moderator", async () => {
    const req = {
      shopId: shopId,
      body: {
        userName: "testModerator",
        password: "password123",
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
    await shopController.createShopModerator(req, res, errorHandler);
    expect(res.statusCode).to.equal(200);
    expect(res.data).to.be.an("object");
  });
});

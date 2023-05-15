import { expect } from "chai";
import * as shopAdminController from "../../controllers/shopAdminController.js";
import * as shopModeratorController from "../../controllers/shopModeratorController.js";
import errorHandler from "../../middleware/errorHandler.js";

describe("shopModeratorController", () => {
  let roomId;
  it("should add room to shop", async () => {
    const req = {
      shopId: shopId,
      body: {
        name: "test",
        description: "test",
        capacity: 10,
        price: 10,
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
    roomId = res.data.rooms[0]._id;
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
        availableActivities: [{ name: "testActivity" }],
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
});

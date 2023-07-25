import {expect} from "chai";
import * as shopController from "../../controllers/shopController.js";
import errorHandler from "../../middleware/errorHandler.js";
import * as receiptController from "../../controllers/receiptController.js";
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

  it("should add extra to shop", async () => {
    const req = {
      shopId: shopId,
      body: {
        name: "test",
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
    const extra = await shopController.addExtra(req, res, errorHandler);
    expect(res.statusCode).to.equal(200);
    expect(res.data).to.be.an("array");
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
    await shopController.checkInRoom(req, res, errorHandler);
    expect(res.statusCode).to.equal(400);
  });

  it("should compute session total", async () => {
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
    await shopController.computeSessionTotal(req, res, errorHandler);
    expect(res.statusCode).to.equal(200);
    expect(res.data.roomTotal).to.equal(1);
  });

  describe("receipt tests", () => {
    it("should get all receipts for the shop", async () => {
      const req = {
        shopId: shopId,
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
      await receiptController.getReceiptsByShopId(req, res, errorHandler);
      expect(res.statusCode).to.equal(200);
      expect(res.data).to.be.an("array");
      expect(res.data.length).to.equal(2);
      expect(res.data[0].roomTotal).to.equal(1);
    });

    it("should get all receipts for room", async () => {
      const req = {
        shopId: shopId,
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
      await receiptController.getReceiptsByRoomId(req, res, errorHandler);
      expect(res.statusCode).to.equal(200);
      expect(res.data).to.be.an("array");
      expect(res.data.length).to.equal(1);
      expect(res.data[0].roomTotal).to.equal(1);
    });

    it("should get shop total by date range", async () => {
      const req = {
        shopId: shopId,
        query: {
          start_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
          end_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
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
      await receiptController.getShopTotal(req, res, errorHandler);
      expect(res.statusCode).to.equal(200);
      expect(res.data).to.equal(2);
    });
    it("should get room total by date range", async () => {
      const req = {
        shopId: shopId,
        params: {
          room_id: roomId,
        },
        query: {
          start_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
          end_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
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
      await receiptController.getRoomTotal(req, res, errorHandler);
      expect(res.statusCode).to.equal(200);
      expect(res.data).to.equal(1);
    });

    it("should get shop total", async () => {
      const req = {
        shopId: shopId,
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
      await receiptController.getShopTotal(req, res, errorHandler);
      expect(res.statusCode).to.equal(200);
      expect(res.data).to.equal(2);
    });

    it("should get room total", async () => {
      const req = {
        shopId: shopId,
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
      await receiptController.getRoomTotal(req, res, errorHandler);
      expect(res.statusCode).to.equal(200);
      expect(res.data).to.equal(1);
    });
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

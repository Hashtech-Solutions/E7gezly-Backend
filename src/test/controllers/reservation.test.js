// import {expect} from "chai";
// import * as shopController from "../../controllers/shopController.js";
// import errorHandler from "../../middleware/errorHandler.js";
// import * as customerController from "../../controllers/customerController.js";
// describe("reservation tests", () => {
//   let reservationId;
//   it("should add reservation", async () => {
//     const req = {
//       shopId: shopId,
//       body: {
//         // get iso string of date with local timezone
//         startTime: new Date("2021-02-03T00:00:00.000Z").toISOString(),
//         endTime: new Date("2021-02-03T01:00:00.000Z"),
//         roomId: room2Id,
//       },
//     };
//     const res = {
//       status: function (code) {
//         this.statusCode = code;
//         return this;
//       },
//       json: function (data) {
//         this.data = data;
//         return this;
//       },
//     };
//     await shopController.bookRoom(req, res, errorHandler);
//     reservationId = res.data._id;
//     expect(res.statusCode).to.equal(200);
//     // expect res.data to equal { startTime: new Date("2021-02-03T00:00:00.000Z"), endTime: new Date("2021-02-03T01:00:00.000Z"), roomId: roomId, _id: res.data._id}
//     expect(res.data.toObject()).to.deep.include({
//       startTime: new Date("2021-02-03T00:00:00.000Z"),
//       endTime: new Date("2021-02-03T01:00:00.000Z"),
//       roomId: room2Id,
//       shopId: shopId,
//     });
//   });

//   it("should delete reservation", async () => {
//     const req = {
//       shopId: shopId,
//       params: {
//         reservation_id: reservationId,
//       },
//     };
//     const res = {
//       status: function (code) {
//         this.statusCode = code;
//         return this;
//       },
//       json: function (data) {
//         this.data = data;
//         return this;
//       },
//     };
//     await shopController.deleteReservationById(req, res, errorHandler);
//     expect(res.statusCode).to.equal(200);
//   });

//   describe("confirmation tests", () => {
//     let customerReservationId;
//     it("should not confirm reservation", async () => {
//       const req = {
//         body: {
//           roomId: global.room2Id,
//           startTime: "2023-05-01T10:00:00.000Z",
//           endTime: "2023-05-01T11:00:00.000Z",
//         },
//         user: {
//           _id: global.customerId,
//         },
//         params: {
//           shop_id: global.shopId,
//         },
//       };
//       const res = {
//         status: function (code) {
//           this.statusCode = code;
//           return this;
//         },
//         json: function (data) {
//           this.data = data;
//           return this;
//         },
//       };
//       await customerController.bookRoom(req, res, errorHandler);
//       customerReservationId = res.data._id;
//       expect(res.statusCode).to.equal(200);
//       expect(res.data.confirmed).to.equal(false);
//     });

//     it("should confirm reservation", async () => {
//       const req = {
//         params: {
//           reservation_id: customerReservationId,
//         },
//       };
//       const res = {
//         status: function (code) {
//           this.statusCode = code;
//           return this;
//         },
//         json: function (data) {
//           this.data = data;
//           return this;
//         },
//       };
//       await shopController.confirmReservationById(req, res, errorHandler);
//       expect(res.statusCode).to.equal(200);
//       expect(res.data.confirmed).to.equal(true);
//     });

//     it("should delete reservation after checkout", async () => {
//       const req = {
//         shopId: global.shopId,
//         body: {
//           roomId: global.room2Id,
//         },
//       };
//       const res = {
//         status: function (code) {
//           this.statusCode = code;
//           return this;
//         },
//         json: function (data) {
//           this.data = data;
//           return this;
//         },
//       };
//       await shopController.getShopRooms(req, res, errorHandler);
//       let room = res.data.find((room) => room._id === global.room2Id);
//       await shopController.checkInRoom(req, res, errorHandler);
//       await shopController.checkOutRoom(req, res, errorHandler);
//       await shopController.getShopRooms(req, res, errorHandler);
//       room = res.data.find((room) => room._id === global.room2Id);
//       expect(room.status).to.equal("available");
//       expect(room.reservations.length).to.equal(0);
//     });
//   });
// });

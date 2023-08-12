import {expect} from "chai";
import {createShop, createReservation} from "../fixtures.test.js";
import Shop from "../../models/Shop.js";
import * as shopService from "../../services/shopService.js";

describe("shop services tests", () => {
  it("Should check in with reservation", async () => {
    const shop = await createShop();
    const room = shop.rooms[0];
    const reservation = await createReservation(
      shop,
      room,
      new Date(new Date().getTime() + 6 * 60 * 1000),
      new Date(new Date().getTime() + 4 * 60 * 60 * 1000)
    );
    const returnValue = await shopService.checkInRoom(
      shop._id,
      {
        roomId: room._id,
        userId: null,
        endTime: null,
      },
      reservation._id
    );
    const newShop = await Shop.findById(shop._id);

    expect(newShop.rooms[0].status).to.equal("occupied");
    expect(returnValue.numVacancies).to.equal(shop.numVacancies - 1);
    expect(returnValue.session).to.not.be.null;
  });

  it("Should check in without reservation", async () => {
    const shop = await createShop();
    const room = shop.rooms[0];
    const returnValue = await shopService.checkInRoom(shop._id, {
      roomId: room._id,
      userId: null,
      endTime: null,
    });
    const newShop = await Shop.findById(shop._id);

    expect(newShop.rooms[0].status).to.equal("occupied");
    expect(returnValue.numVacancies).to.equal(shop.numVacancies - 1);
    expect(returnValue.session).to.not.be.null;
  });

  it("Should get shop table", async () => {
    const shop = await createShop();
    const room_1 = shop.rooms[0];
    const room_2 = shop.rooms[1];
    await createReservation(
      shop,
      room_1,
      new Date(new Date().getTime() + 6 * 60 * 1000),
      new Date(new Date().getTime() + 4 * 60 * 60 * 1000)
    );
    await createReservation(
      shop,
      room_1,
      new Date(new Date().getTime() + 6 * 6 * 60 * 1000),
      new Date(new Date().getTime() + 10 * 60 * 60 * 1000)
    );
    await createReservation(
      shop,
      room_2,
      new Date(new Date().getTime() + 6 * 6 * 60 * 1000),
      new Date(new Date().getTime() + 10 * 60 * 60 * 1000)
    );

    await shopService.checkInRoom(
      shop._id,
      {
        roomId: room_2._id,
        userId: null,
        endTime: null,
      },
    );

    const returnValue = await shopService.getShopTable(shop._id);
    expect(returnValue.length).to.equal(2);
    expect(returnValue[1].session.roomId).to.equal(room_2._id.toString());
    expect(returnValue[0].reservations.length).to.equal(2);
  });
});

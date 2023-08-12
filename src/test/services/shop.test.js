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
    expect(returnValue.numVacancies).to.equal(0);
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
    expect(returnValue.numVacancies).to.equal(0);
    expect(returnValue.session).to.not.be.null;
  });
});

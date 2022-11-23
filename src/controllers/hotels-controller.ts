import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const hotelsList = await hotelsService.getHotels();

    return res.status(httpStatus.OK).send(hotelsList);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getRoomByHotelId(req: AuthenticatedRequest, res: Response) {
  try {
    const hotelId = Number(req.params.hotelId);

    console.log(hotelId, " hotel id params");

    if (!hotelId && hotelId !== 0) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    console.log("continuei");

    const roomList = await hotelsService.getRoomsByHotelId(hotelId);
  
    return res.status(httpStatus.OK).send(roomList);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

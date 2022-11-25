import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const hotelsList = await hotelsService.getHotels(userId);

    return res.status(httpStatus.OK).send(hotelsList);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if(error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send([]);
    }
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getRoomByHotelId(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const hotelId = Number(req.params.hotelId);

    if (!hotelId && hotelId !== 0) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const roomList = await hotelsService.getRoomsByHotelId(hotelId, userId);

    return res.status(httpStatus.OK).send(roomList);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

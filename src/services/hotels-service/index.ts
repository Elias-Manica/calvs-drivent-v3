import { notFoundError } from "@/errors";
import hotelRepository from "@/repositories/hotels-repository";

async function getHotels() {
  const hotels = await hotelRepository.findHotels();

  return hotels;
}

async function getRoomsByHotelId(hotelId: number) {
  const rooms = await hotelRepository.findRoomByHotelId(hotelId);

  console.log(rooms, " rooms", !rooms);

  if(rooms.length === 0) {
    throw notFoundError();
  }

  return rooms;
}

const hotelsService = {
  getHotels,
  getRoomsByHotelId
};

export default hotelsService;

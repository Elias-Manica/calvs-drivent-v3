import { notFoundError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotels-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function verifyIfUserHasTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  
  if(!enrollment) {
    throw unauthorizedError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if(!ticket) {
    throw unauthorizedError();
  }
 
  if(ticket.TicketType.isRemote) {
    throw unauthorizedError();
  }

  if(!ticket.TicketType.includesHotel) {
    throw unauthorizedError();
  }
}

async function getHotels(userId: number) {
  await verifyIfUserHasTicket(userId);

  const hotels = await hotelRepository.findHotels();
 
  if(hotels.length === 0) {
    throw notFoundError();
  }

  return hotels;
}

async function getRoomsByHotelId(hotelId: number, userId: number) {
  await verifyIfUserHasTicket(userId);

  const rooms = await hotelRepository.findRoomByHotelId(hotelId);

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

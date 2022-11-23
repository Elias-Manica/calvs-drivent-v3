import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany({});
}

async function findRoomByHotelId(hotelId: number) {
  return prisma.room.findMany({
    where: {
      hotelId: hotelId
    }
  });
}

const hotelsRepository = {
  findHotels,
  findRoomByHotelId
};

export default hotelsRepository;

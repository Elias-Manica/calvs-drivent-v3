import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { createUser } from "./users-factory";

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.image(),
    },
  });
}

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: Math.floor(Math.random() * 2 + 1),
      hotelId: hotelId,
    }
  });
}

export async function createABooking(roomId: number) {
  const user = await createUser();
  return prisma.booking.create({
    data: {
      userId: user.id,
      roomId: roomId,
    }
  });
}

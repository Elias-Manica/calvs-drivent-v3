import hotelRepository from "@/repositories/hotels-repository";

async function getHotels() {
  const hotels = await hotelRepository.findHotels();

  return hotels;
}

const hotelsService = {
  getHotels
};

export default hotelsService;

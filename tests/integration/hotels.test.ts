import app, { init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser, createHotel, createRoom } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import faker from "@faker-js/faker";
import * as jwt from "jsonwebtoken";

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();

    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with empty array when there are no hotels created", async () => {
      const token = await generateValidToken();
  
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
  
      expect(response.body).toEqual([]);
    });

    it("should respond with status 200 and with existing hotels data", async () => {
      const token = await generateValidToken();

      const hotel = await createHotel();
  
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString(),
        }
      ]);
    });

    it("should respond with status 200 and with existing hotels data when legnth greater than 1", async () => {
      const token = await generateValidToken();
  
      const hotel = await createHotel();

      await createHotel();
    
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: hotel.id,
            name: hotel.name,
            image: hotel.image,
            createdAt: hotel.createdAt.toISOString(),
            updatedAt: hotel.updatedAt.toISOString(),
          })
        ])
      );
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels/1");
  
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
  
    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
  
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  describe("when token is valid", () => {
    it("should respond with status 400 when hotelId is not valid", async () => {
      const token = await generateValidToken();
      
      const response = await server.get("/hotels/:hotelId").set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when hotelId doesnt exist", async () => {
      const token = await generateValidToken();
        
      const response = await server.get("/hotels/0").set("Authorization", `Bearer ${token}`);
        
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
  
    it("should respond with status 200 and with existing hotels data", async () => {
      const token = await generateValidToken();
  
      const hotel = await createHotel();

      await createRoom(hotel.id);
    
      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.OK);
    });
  });
});

import app from "../../src/app"
import request from "supertest"
import { expect } from "chai"
import { PrismaClient } from "@prisma/client"

const newUser = {
  firstName: "User",
  lastName: "Test",
  email: "test-user@gmail.com",
  role: "USER",
  password: "Test@123",
  passwordConfirm: "Test@123"
}

const prisma = new PrismaClient()

describe("Authentication", () => {
  // Test case for successful authentication
  it("should create user", async () => {
    const res = await request(app).post("/api/v1/auth/register").send(newUser)

    expect(res.status).to.equal(201)
  })

  // test use login
  it("should login user", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: newUser.email,
      password: newUser.password
    })

    expect(res.status).to.equal(200)
  })

  after(async () => {
    //  for the case of FK in tokens tbl

    // find this user in the database
    const user = await prisma.user.findUnique({
      where: {
        email: newUser.email
      }
    })

    // delete user fk from token table
    await prisma.token.delete({
      where: {
        user_id: user?.id
      }
    })

    // then delete user
    await prisma.user.delete({
      where: {
        email: newUser.email
      }
    })
  })
})

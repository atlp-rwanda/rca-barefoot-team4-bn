import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../src/app";

let should = chai.should();

chai.use(chaiHttp);

describe("Testing the user registration", function () {
  it("should register the user", function (done) {
    chai
      .request(app)
      .post("/api/v1/auth/register")
      .send({
        firstName: "Marve",
        lastName: "Mario",
        email: "marve@gmail.com",
        role: "SUPER_ADMIN",
        password: "marve12345",
        passwordConfirm: "marve12345",
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");

        done();
      });
  });
});

describe("Test login", function () {
  it("Should login the user", function (done) {
    // follow up with login
    chai
      .request(app)
      .post("/api/v1/auth/login")
      // send user login details
      .send({
        email: "marve@gmail.com",
        password: "marve12345",
      })
      .end((err, res) => {
        res.body.should.have.property("accessToken");
        done();
      });
  });
});


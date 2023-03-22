import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../src/app";

chai.use(chaiHttp);

describe("Testing the users registration", function () {
  it("should register the user", function (done) {
    chai
      .request(app)
      .post("/api/v1/auth/register")
      .send({
        firstName: "Tester name 1",
        lastName: "Tester name 2",
        email: "tester@gmail.com",
        password: "tester1234",
        passwordConfirm: "tester1234",
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
        email: "tester@gmail.com",
        password: "tester1234",
      })
      .end((err, res) => {
        console.log("this runs the login part");
        res.body.should.have.property("access_token");
        done();
      });
  });
});

describe("Remove all users", () => {
  it("All the users must be removed from the table of users", function (done) {
    chai
      .request(app)
      .delete("/api/v1/auth")
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.be.eql("Done!");
        done();
      });
  });
});

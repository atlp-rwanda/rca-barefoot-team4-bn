import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/app";

const expect = chai.expect;
chai.use(chaiHttp);

describe("Root Route", () => {
  it("should return a welcome message on GET /", (done) => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.text).to.equal("Welcome to Barefoot Nomad APIs");
        done();
      });
  });
});

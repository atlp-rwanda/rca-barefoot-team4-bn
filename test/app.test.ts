import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /', () => {
  it('should return "Welcome to Barefoot Nomad APIs"', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('Welcome to Barefoot Nomad APIs');
        done();
      });
  });
});

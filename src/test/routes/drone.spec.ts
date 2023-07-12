import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../server';
import { EDroneModel, EDroneState, ETables } from '@/Type';
import { clearTable } from '../helper';

chai.use(chaiHttp);
const { expect } = chai;

describe('Drone Tests', async () => {

  after(async () => {
    await clearTable(ETables.DRONES);
  })

  describe('POST /drones/', () => {
    it('It should register drone', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/drones/')
        .send({
          serial_number: "394850248",
          model: EDroneModel.HEAVYWEIGHT,
          weight_limit: 430,
          battery: 100,
          state: EDroneState.IDLE,
        });
      
      expect(res.status).to.equals(201);
      expect(res.body).to.be.an('object');
      expect(res.body.data).to.have.all.keys([
        'id',
        'serial_number',
        'model',
        'weight_limit',
        'battery',
        'state',
        'created_at',
        'updated_at',
        'deleted_at'
      ]);
      expect(res.body.message).to.equals('Drone registered successfully');
      expect(res.body.data.model).to.equals(EDroneModel.HEAVYWEIGHT);
      expect(res.body.data.state).to.equals(EDroneState.IDLE);
    });

    it('Should not register drone with invalid data', async () => {
      const res = await chai.request(app).post('/api/v1/drones').send({
        serial_number: "38503058",
        model: "cool",
        weight_limit: 550,
        battery: 50,
        state: EDroneState.IDLE
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.all.keys(['errors', 'status']);
      expect(res.body.errors.length).to.equal(2);
    });

    it('Should not signup a drone with already existing serial number', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/drones/')
        .send({
          serial_number: "394850248",
          model: EDroneModel.HEAVYWEIGHT,
          weight_limit: 430,
          battery: 100,
          state: EDroneState.IDLE,
        });
      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.errors[0].msg).to.equal('Serial number in use!');
    });
  });

  describe('GET /drones/', () => {
    it("Should get all available drones in pagination", async () => {
      const res = await chai
      .request(app)
      .get('/api/v1/drones/');
    
    expect(res.status).to.equals(200);
    expect(res.body).to.be.an('object');
    expect(res.body.data).to.have.all.keys([
      "list",
      "pageTag",
      "total",
      "limit"
    ]);
    expect(res.body.message).to.equals('Fetched successfully');
    expect(res.body.data.limit).to.equals(20);
    expect(res.body.data.list).to.be.an("array");
    })

    it("Should accept query params and filter by drone state", async () => {
      const res = await chai
      .request(app)
      .get('/api/v1/drones')
      .query({
        limit: 10,
        page: "next",
        pt: "p1:1-10",
        state: EDroneState.IDLE
      })

      expect(res.status).to.equals(200);
      expect(res.body).to.be.an('object');
      expect(res.body.data).to.have.all.keys([
        "list",
        "pageTag",
        "total",
        "limit"
      ]);
      expect(res.body.message).to.equals('Fetched successfully');
      expect(res.body.data.limit).to.equals(10);
      expect(res.body.data.list).to.be.an("array");
    })

    it("Should fail with invalid page tag and page type", async () => {
      const res = await chai
      .request(app)
      .get('/api/v1/drones')
      .query({
        limit: 10,
        page: "now", // should be "next" or "prev"
        pt: "p1-dd", // should be in the form p{pageNo}:{firstIdInList}-{lastIdInList} e.g. p1:1-10, p1:1-10|p2:11-20
      })

      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors.length).to.equal(2)
    })
  })
});
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');

const User = require('../lib/models/User');

const Auction = require('../lib/models/Auction');

const Bid = require('../lib/models/Bid');

describe('basic-auth routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;

  beforeEach(async() => {
    user = await User.create({
      email: 'briseida@test.com',
      password: 'testpassword'
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('can create a new auction via POST', () => {
    return request(app)
      .post('/api/v1/auctions')
      .send({
        user: user._id,
        title: 'Old Relic',
        description: 'relic found in the lost underwater city of Atlantis',
        quantity: 1, 
        endDate: Date()
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          title: 'Old Relic',
          description: 'relic found in the lost underwater city of Atlantis',
          quantity: 1, 
          endDate: expect.anything(),
          __v: 0
        });
      });
  });

  it('can get auction by id via GET', async() => {
    const auction = await Auction.create({
      user: user._id,
      title: 'Old Relic',
      description: 'relic found in the lost underwater city of Atlantis',
      quantity: 1, 
      endDate: Date()
    });

    Bid.create({
      auction: auction.id,
      user: user.id, 
      price: 3000,
      quantity: 1, 
      isAccepted: true
    });

    return request(app)
      .get(`/api/v1/auctions/${auction._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          description: auction.description,
          endDate: expect.anything(),
          quantity: auction.quantity,
          title: auction.title,
          user: {
            _id: expect.anything(),
            email: user.email
          },
          bids: [{
            _id: expect.anything(),
            auction: auction.id,
            price: 3000 
          }],
          __v: 0

        });
      });
  });

  it('can get all auctions via GET', async() => {
    await Auction.create({
      user: user._id,
      title: 'Old Relic',
      description: 'relic found in the lost underwater city of Atlantis',
      quantity: 1, 
      endDate: Date()
    },
    {
      user: user._id,
      title: 'New Relic',
      description: 'relic found in the middle of a mall, at the forever21',
      quantity: 5, 
      endDate: Date()
    });

    return request(app)
      .get('/api/v1/auctions')
      .then(res => {
        expect(res.body).toEqual([
          {
            _id: expect.anything(),
            user: {
              _id: user.id
            },
            title: 'Old Relic',
            description: 'relic found in the lost underwater city of Atlantis',
            quantity: 1, 
            endDate: expect.anything(),
            __v: 0
          },
          {
            _id: expect.anything(),
            user: {
              _id: user.id
            },
            title: 'New Relic',
            description: 'relic found in the middle of a mall, at the forever21',
            quantity: 5, 
            endDate: expect.anything(),
            __v: 0
          }
        ]);
      });
  });
});

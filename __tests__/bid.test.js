const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');

const User = require('../lib/models/User');

const Auction = require('../lib/models/Auction');

// const Bid = require('../lib/models/Bid');

describe('bid routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let user;
  let auction;

  beforeEach(async() => {
    user = await User.create({
      email: 'briseida@test.com',
      password: 'testpassword'
    });

    auction = await Auction.create({
      user: user._id,
      title: 'Old Relic',
      description: 'relic found in the lost underwater city of Atlantis',
      quantity: 1, 
      endDate: Date()
    });
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('can create a new bid via POST', () => {
    return request(app)
      .post('/api/v1/bids')
      .auth('briseida@test.com', 'testpassword')
      .send({
        user: user._id,
        auction: auction._id,
        price: 2999,
        quantity: 1,
        isAccepted: true  
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          user: user.id,
          auction: auction.id,
          price: 2999,
          quantity: 1,
          isAccepted: true,  
          __v: 0
        });
      });
  });

});

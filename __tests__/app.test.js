require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token;
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

  test('returns s', async() => {

    const expectation = [
      {
        'id': 1,
        'name': 'Lemon Cello',
        'coolfactor': 9,
        'category': 'citrus',
        'crisp': true
      },
      {
        'id': 2,
        'name': 'Lime',
        'coolfactor': 3,
        'category':'citrus' ,
        'crisp': false
      },
      {
        'id': 3,
        'name': 'Watermelon',
        'coolfactor': 10,
        'category': 'sweet',
        'crisp': true
      }
    ];

    const data = await fakeRequest(app)
      .get('/lacroixs')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(data.body).toEqual(expectation);
    test('returns a single banjo', async() => {
      const expectation = {
        id: 1,
        brand: 'gold tone',
        noise_level: 3,
        owner_id: 1
      };
  
      const data = await fakeRequest(app)
        .get('/banjos/1')
        .expect('Content-Type', /json/)
        .expect(200);
  
      expect(data.body).toEqual(expectation);
    });

    test.only('adds a lacroixs to the DB and returns it', async() => {
      const expectation = {
        id: 1,
        name: 'Lemon Cello',
        cool_factor: 9,
        category: 'citrus',
        crisp: true
      };
  
      const data = await fakeRequest(app)
        .post('/lacroixs')
        .send({
          name: 'Lemon Cello',
          cool_factor: 9,
          category: 'citrus',
          crisp: true
        })
        .expect('Content-Type', /json/)
        .expect(200);
  
      const allLacroixs = await fakeRequest(app)
        .get('/lacroixs')
        .expect('Content-Type', /json/)
        .expect(200);
  

      expect(data.body).toEqual(expectation);
      expect(allLacroixs.body.length).toEqual(4);
  });
  });
})
});

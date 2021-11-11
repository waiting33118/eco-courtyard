import request from 'supertest';
import app from '../../app';

describe('POST /api/v1/region', () => {
  describe('add a new category name', () => {
    test('should response 201 status code & json content-type header', async () => {
      const response = await request(app)
        .post('/api/v1/region')
        .send({ regionName: 'Taiwanese' });

      expect(response.statusCode).toBe(201);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });

  describe('send request with an empty payload', () => {
    test('should response 400 status code & json content-type header', async () => {
      const response = await request(app).post('/api/v1/region').send({});

      expect(response.statusCode).toBe(400);
      expect(
        expect(response.headers['content-type']).toEqual(
          expect.stringContaining('json')
        )
      );
    });
  });

  describe('add an empty category name', () => {
    test('should response 400 status code & json content-type header', async () => {
      const response = await request(app)
        .post('/api/v1/region')
        .send({ regionName: ' ' });

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });
});

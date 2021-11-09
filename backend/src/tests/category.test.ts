import request from 'supertest';
import app from '../app';

describe('GET /api/v1/category', () => {
  describe('get all categories', () => {
    test('should response 200', async () => {
      const res = await request(app).get('/api/v1/category');

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });
});

describe('GET /api/v1/category/:categoryId', () => {
  describe('query specific category with id', () => {
    test('should response 200 & json result', async () => {
      const res = await request(app).get('/api/v1/category/1');

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });

  describe('query specific category with wrong id type', () => {
    test('should response 400 & error message', async () => {
      const res = await request(app).get('/api/v1/category/wrong');

      expect(res.statusCode).toBe(400);
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });
});

describe('POST /api/v1/category', () => {
  describe('add a new category name', () => {
    test('should response 201 & return result', async () => {
      const response = await request(app)
        .post('/api/v1/category')
        .send({ categoryName: 'beverage' });

      expect(response.statusCode).toBe(201);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });

  describe('send request with an empty payload', () => {
    test('should response 400 & error message', async () => {
      const response = await request(app).post('/api/v1/category').send({});

      expect(response.statusCode).toBe(400);
      expect(
        expect(response.headers['content-type']).toEqual(
          expect.stringContaining('json')
        )
      );
    });
  });

  describe('add an empty category name', () => {
    test('should response 400 & error message', async () => {
      const response = await request(app)
        .post('/api/v1/category')
        .send({ categoryName: ' ' });

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });
});

describe('PUT api/v1/category/:categoryId', () => {
  // eslint-disable-next-line quotes
  describe("edit specific category's name", () => {
    test('should response 200 & success message', async () => {
      const res = await request(app)
        .put('/api/v1/category/1')
        .send({ newCategoryName: 'breakfast' });

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });

  describe('send wrong id format', () => {
    test('should response 400 & error message', async () => {
      const res = await request(app)
        .put('/api/v1/category/wrong')
        .send({ newCategoryName: 'breakfast' });

      expect(res.statusCode).toBe(400);
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });

  describe('send request with empty payload', () => {
    test('should response 400 & error message', async () => {
      const res = await request(app).put('/api/v1/category/1').send({});

      expect(res.statusCode).toBe(400);
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });

  describe('send an empty new category name', () => {
    test('should response 400 & error message', async () => {
      const res = await request(app)
        .put('/api/v1/category/wrong')
        .send({ newCategoryName: ' ' });

      expect(res.statusCode).toBe(400);
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });
});

describe('DELETE /api/v1/category/:categoryId', () => {
  describe('delete specific category', () => {
    test('should response 200 & success message', async () => {
      const res = await request(app).delete('/api/v1/category/1');

      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });

  describe('send wrong id format', () => {
    test('should response 400 & error message', async () => {
      const res = await request(app).delete('/api/v1/category/wrong');

      expect(res.statusCode).toBe(400);
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });
  });
});

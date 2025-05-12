import request from 'supertest';
import { requestListener } from '../src/listener';
import {createServer} from "http";

describe('User API', () => {
  let userId = '';
  const server = createServer(requestListener);

  it('should get all users', async () => {
    const res = await request(server).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});
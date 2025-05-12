import request from 'supertest';
import {requestListener} from '../src/listener';
import {createServer} from "http";

describe('User API', () => {
    let userId = '';
    const server = createServer(requestListener);

    it('should GET all users', async () => {
        const res = await request(server).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('should create a new object by a POST api/users request', async () => {
        const res = await request(server).post('/api/users').send({
            username: 'testuser',
            age: 25,
            hobbies: ['surfing']
        });
        expect(res.statusCode).toBe(201);
        const res_all_users = await request(server).get('/api/users');
        expect(res.body).toEqual(res_all_users.body[0]);
    });

    it('should GET the created record by its uuid', async () => {
        const res = await request(server).post('/api/users').send({
            username: 'testuser',
            age: 25,
            hobbies: ['surfing']
        });
        expect(res.statusCode).toBe(201);

        const res_get_user = await request(server).get(`/api/users/${res.body.id}`);
        expect(res_get_user.statusCode).toBe(200);
        expect(res_get_user.body).toEqual(res.body);
    });

    it('should update the created record with a PUT request its uuid', async () => {
        const res = await request(server).post('/api/users').send({
            username: 'testuser',
            age: 25,
            hobbies: ['surfing']
        });
        expect(res.statusCode).toBe(201);

        const res_put_user = await request(server).put(`/api/users/${res.body.id}`).send({
            "username": "changed-testname"
        });
        expect(res_put_user.statusCode).toBe(200);
        expect(res_put_user.body.username).toEqual("changed-testname");
    });


    it('should DELETE the created record by its uuid', async () => {
        const res = await request(server).post('/api/users').send({
            username: 'testuser',
            age: 25,
            hobbies: ['surfing']
        });
        expect(res.statusCode).toBe(201);

        const res_put_user = await request(server).delete(`/api/users/${res.body.id}`);
        expect(res_put_user.statusCode).toBe(204);

    });

    it('should get deleted user by its uuid', async () => {
        const res = await request(server).post('/api/users').send({
            username: 'testuser',
            age: 25,
            hobbies: ['surfing']
        });
        expect(res.statusCode).toBe(201);

        const res_put_user = await request(server).delete(`/api/users/${res.body.id}`);
        expect(res_put_user.statusCode).toBe(204);

        const res_get_user = await request(server).get(`/api/users/${res.body.id}`);
        expect(res_get_user.statusCode).toBe(404);
    });

});
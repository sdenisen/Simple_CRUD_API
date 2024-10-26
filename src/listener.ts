import parseRequestBody from './parser';
import {IncomingMessage, ServerResponse} from "http";
import {parse} from 'url';
import {createUser, getAllusers, getUserById, updateUser, deleteUser} from "./controllers/userController";

const headers = {
    'Content-type': 'application/json'
};
export const requestListener = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    try {
        const method = req.method;
        const parsed_url = parse(req.url || '', true);
        const {pathname, query} = parsed_url;
        const match_path = pathname?.match('\/api\/users(?:\/*)([a-f0-9-]+)?');

        if (match_path === undefined || match_path === null) {
            throw new Error(`Bad request`);
        }

        const api_user_url = match_path[0];
        const user_uuid_url = match_path[1];

        if (method === 'GET' && api_user_url) {
            if (user_uuid_url === undefined) {
                res.writeHead(200, headers);
                const user_items = getAllusers();
                res.end(JSON.stringify(user_items));
            } else {
                const user = getUserById(user_uuid_url);
                if (user) {
                    res.writeHead(200, headers);
                    res.end(JSON.stringify(user));
                } else {
                    res.writeHead(404, headers);
                    res.end(JSON.stringify({message: 'User not found'}));
                }
            }
        }

        if (method === 'POST' && api_user_url) {
            const body = await parseRequestBody(req);
            const new_user = createUser(body.username, body.age, body.hobbies);

            res.writeHead(201, headers);
            res.end(JSON.stringify(new_user));
        }

        if (method === 'PUT' && user_uuid_url) {
            const body = await parseRequestBody(req);
            const updatedUser = updateUser(user_uuid_url, body.username, body.age, body.hobbies);
            if (updatedUser) {
                res.writeHead(200, headers);
                res.end(JSON.stringify(updatedUser));
            } else {
                res.writeHead(404, headers);
                res.end(JSON.stringify({message: `User with UUID ${user_uuid_url} wasn't found`}));
            }
        }

        if (req.method === 'DELETE' && user_uuid_url) {
            const updatedUser = deleteUser(user_uuid_url);
            res.writeHead(204, headers);
            res.end(JSON.stringify(updatedUser));
        }

    } catch (err: any) { // implement errors.
        if (err.message.includes('is invalid')) {
            res.writeHead(400, headers);
            res.end(JSON.stringify({message: err.message}));
            return;
        }
        if (err.message.includes('The record doesn\'t exist.')) {
            res.writeHead(404, headers);
            res.end(JSON.stringify({message: 'Bad request.'}));
        }
    }
};

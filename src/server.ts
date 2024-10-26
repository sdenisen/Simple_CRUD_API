import InterfaceUser from './models/interfaceUser'
import parseRequestBody from './parser';
import {IncomingMessage, ServerResponse, createServer} from "http";
import {parse} from 'url';
import {v4 as uuidv4, validate} from 'uuid';
import {createUser, getAllusers, getUserById, updateUser} from "./controllers/userController";

const headers = {
    'Content-type': 'application/json'
}

const requestListener = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
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

    } catch (err: any) { // implement errors.
        if (err.message.includes('is invalid')) {
            res.writeHead(400, headers);
            res.end(JSON.stringify({message: err.message}));
            return;
        }
        res.writeHead(500, headers);
        res.end(JSON.stringify({message: 'Bad request.'}));
    }

    // const parsedUrl = parse(req.url || '', true);
    // const { pathname, query } = parsedUrl;
    //
    // if (req.method === 'POST' && pathname === '/items') {
    //   try {
    //     const body = await parseRequestBody(req);
    //     const user: InterfaceUser = {
    //         id: uuidv4(),
    //         username: body.name,
    //         age: body.age,
    //         hobbies: body.hobbies,
    //     };
    //     user_items.push(user);
    //     res.writeHead(201, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify(user));
    //   } catch (error) {
    //     if (error instanceof Error){
    //       res.writeHead(400, { 'Content-Type': 'application/json' });
    //       res.end(JSON.stringify({ message: error.message }));
    //     }
    //   }
    //
    //
    // } else if (req.method === 'GET' && pathname === 'api/users') {
    //   res.writeHead(200, { 'Content-Type': 'application/json' });
    //   res.end(JSON.stringify(user_items));
    //
    // } else if (req.method === 'GET' && pathname?.startsWith('/items/')) {
    //   const id = pathname.split('/') [2];
    //   const user = user_items.find((i) => i.id === id);
    //   if (user) {
    //     res.writeHead(200, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify(user));
    //   } else {
    //     res.writeHead(404, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify({ message: 'Item not found' }));
    //   }
    //
    // } else if (req.method === 'PUT' && pathname?.startsWith('/items/')) {
    //   const id = pathname.split('/')[2];
    //   const userIndex = user_items.findIndex((i) => i.id === id);
    //   if (userIndex !== -1) {
    //     try {
    //       const body = await parseRequestBody(req);
    //       user_items[userIndex].username = body.username;
    //       user_items[userIndex].age = body.age;
    //       user_items[userIndex].hobbies = body.hobbies;
    //       res.writeHead(200, { 'Content-Type': 'application/json' });
    //       res.end(JSON.stringify(user_items[userIndex]));
    //     } catch (error) {
    //       if (error instanceof Error) {
    //         res.writeHead(400, { 'Content-Type': 'application/json' });
    //         res.end(JSON.stringify({ message: error.message }));
    //       }
    //     }
    //   } else {
    //     res.writeHead(404, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify({ message: 'Item not found' }));
    //   }
    //
    //
    // } else if (req.method === 'DELETE' && pathname?.startsWith('/items/')) {
    //   const id = pathname.split('/')[2];
    //   const userIndex = user_items.findIndex((i) => i.id === id);
    //   if (userIndex !== -1) {
    //     const deletedItem = user_items.splice(userIndex, 1);
    //     res.writeHead(200, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify(deletedItem[0]));
    //   } else {
    //     res.writeHead(404, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify({ message: 'Item not found' }));
    //   }
    // } else {
    //   res.writeHead(404, { 'Content-Type': 'application/json' });
    //   res.end(JSON.stringify({ message: 'Route not found' }));
    // }
};

const server = createServer(requestListener);
import * as dotenv from 'dotenv';

dotenv.config();
const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
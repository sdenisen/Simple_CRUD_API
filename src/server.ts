import User from './user'
import parseRequestBody from './parser';
import {IncomingMessage, ServerResponse, createServer} from "http";
import { parse } from 'url';
import { v4 as uuidv4 } from 'uuid';

let user_items: User[] = [];

const requestListener = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const parsedUrl = parse(req.url || '', true);
  const { pathname, query } = parsedUrl;

  if (req.method === 'POST' && pathname === '/items') {
    try {
      const body = await parseRequestBody(req);
      const user: User = {
          id: uuidv4(),
          username: body.name,
          age: body.age,
          hobbies: body.hobbies,
      };
      user_items.push(user);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } catch (error) {
      if (error instanceof Error){
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.message }));
      }
    }


  } else if (req.method === 'GET' && pathname === '/items') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user_items));

  } else if (req.method === 'GET' && pathname?.startsWith('/items/')) {
    const id = pathname.split('/') [2];
    const user = user_items.find((i) => i.id === id);
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Item not found' }));
    }

  } else if (req.method === 'PUT' && pathname?.startsWith('/items/')) {
    const id = pathname.split('/')[2];
    const userIndex = user_items.findIndex((i) => i.id === id);
    if (userIndex !== -1) {
      try {
        const body = await parseRequestBody(req);
        user_items[userIndex].username = body.username;
        user_items[userIndex].age = body.age;
        user_items[userIndex].hobbies = body.hobbies;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user_items[userIndex]));
      } catch (error) {
        if (error instanceof Error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: error.message }));
        }
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Item not found' }));
    }


  } else if (req.method === 'DELETE' && pathname?.startsWith('/items/')) {
    const id = pathname.split('/')[2];
    const userIndex = user_items.findIndex((i) => i.id === id);
    if (userIndex !== -1) {
      const deletedItem = user_items.splice(userIndex, 1);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(deletedItem[0]));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Item not found' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
};

const server = createServer(requestListener);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
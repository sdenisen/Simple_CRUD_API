import InterfaceUser from "./interfaceUser";

let user_items: InterfaceUser[] = [{
    id: "123e4567-e89b-12d3-a456-426614174000",
    username: "sadfaxcvzxvczxv",
    age: 10,
    hobbies: ["asdfasdf", "czxvzcxv", "fdghdfgh"]
}];


export class User {
    static getAll(): InterfaceUser[] {
        return user_items;
    }

     static getById(id: string): InterfaceUser | null {
        return user_items.find(user => user.id === id) || null;
    }

    static create(item: InterfaceUser): InterfaceUser{
        user_items.push(item);
        return item;
    }
}
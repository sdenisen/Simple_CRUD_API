import InterfaceUser from "./interfaceUser";

let user_items: InterfaceUser[] = [];


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
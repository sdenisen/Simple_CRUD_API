import InterfaceUser from "./interfaceUser";

let user_items: InterfaceUser[] = [];


export class User {
    static getAll(): InterfaceUser[] {
        return user_items;
    }
}
import InterfaceUser from "./interfaceUser";

let user_items: InterfaceUser[] = [];


export class User {
    static getAll(): InterfaceUser[] {
        return user_items;
    }

    static getById(id: string): InterfaceUser | null {
        return user_items.find(user => user.id === id) || null;
    }

    static create(item: InterfaceUser): InterfaceUser {
        user_items.push(item);
        return item;
    }

    static update(user_to_update: InterfaceUser): InterfaceUser | null {
        const idx = user_items.findIndex( u => {u.id === user_to_update.id});
        user_items[idx] = user_to_update;
        return user_items[idx];
    }

    static delete(userId: string) {
        const ind = user_items.findIndex(user => user.id === userId);
        if (ind === -1) {
            throw new Error("The record doesn't exist.");
        }
        const idx = user_items.findIndex( u => {u.id === userId});
        user_items.splice(idx, 1);
    }

    static convertObjToUser(obj: any): InterfaceUser | null{
        if (typeof obj !== 'object' || obj === null) return null;
        if (typeof obj["username"] !== 'string') return null;
        if (typeof obj["age"] !== 'number') return null;
        if (!Array.isArray(obj["hobbies"])) return null;
        return obj as InterfaceUser
    }
}
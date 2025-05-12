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

    static update(userId: string, userName: string, age: number, hobbies: string[]): InterfaceUser | null {
        const ind = user_items.findIndex(user => user.id === userId);
        if (ind === -1) {
            return null
        }

        user_items[ind].hobbies = hobbies;
        user_items[ind].age = age;
        user_items[ind].username = userName;

        return user_items[ind];
    }

    static delete(userId: string) {
        const ind = user_items.findIndex(user => user.id === userId);
        if (ind === -1) {
            throw new Error("The record doesn't exist.");
        }

        user_items = user_items.filter(item => item.id !== userId);
    }

    static convertObjToUser(obj: any): InterfaceUser | null{
        if (typeof obj !== 'object' || obj === null) return null;
        if (typeof obj["username"] !== 'string') return null;
        if (typeof obj["age"] !== 'number') return null;
        if (!Array.isArray(obj["hobbies"])) return null;
        return obj as InterfaceUser
    }
}
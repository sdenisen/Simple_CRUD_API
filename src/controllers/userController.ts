import InterfaceUser from "../models/interfaceUser";
import {User} from "../models/userModel";
import {v4 as uuidv4, validate} from 'uuid';

export const getAllusers = (): InterfaceUser[] => {
    return User.getAll();
}

export const getUserById = (userId: string): InterfaceUser | null => {
    if (!validate(userId)) {
        throw new Error(`${userId} is invalid`);
    }
    return User.getById(userId);
};

export const createUser = (body: any): InterfaceUser | null => {
    const result = User.convertObjToUser(body);
    console.log(result)
    if (!result) {
        throw new Error("Request does not contain required fields");
    }

    console.log("we are here...")
    const newUser: InterfaceUser = {id: uuidv4(), username: result.username, age: result.age, hobbies: result.hobbies};
    return User.create(newUser);
};

export const updateUser = (userId: string, userName: string, age: number, hobbies: string[]): InterfaceUser | null => {
    if (!validate(userId)) {
        throw new Error(`${userId} is invalid`)
    }

    return User.update(userId, userName, age, hobbies);
};

export const deleteUser = (userId: string) => {
    if (!validate(userId)) {
        throw new Error(`${userId} is invalid`)
    }

    User.delete(userId);
};


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

export const createUser = (userName: string, age: number, hobbies: string[]): InterfaceUser | null => {

    if (!userName || !age || !hobbies) {
        throw new Error("Missed required fields.");
    }

    const newUser: InterfaceUser = {id: uuidv4(), username: userName, age: age, hobbies: hobbies};
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


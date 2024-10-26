import InterfaceUser from "../models/interfaceUser";
import {User} from "../models/userModel";
import {validate,} from 'uuid';

export const getAllusers = (): InterfaceUser[] => {
    return User.getAll();
}

export const getUserById = (userId: string): InterfaceUser | null => {
    if (!validate(userId)) {
        throw new Error(`${userId} is invalid`);
    }
    return User.getById(userId);
};
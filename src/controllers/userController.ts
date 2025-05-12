import InterfaceUser from "../models/interfaceUser";
import {User} from "../models/userModel";
import {v4 as uuidv4, validate} from 'uuid';

export const getAllusers = (): InterfaceUser[] => {
    return User.getAll();
}

export const getUserById = (userId: string): InterfaceUser | null => {
    return User.getById(userId);
};

export const createUser = (body: any): InterfaceUser | null => {
    const result = User.convertObjToUser(body);
    if (!result) {
        throw new Error("Request does not contain required fields");
    }

    const newUser: InterfaceUser = {id: uuidv4(), username: result.username, age: result.age, hobbies: result.hobbies};
    return User.create(newUser);
};

export const updateUser = (userId: string, body: any): InterfaceUser | null => {
    if (!validate(userId)) {
        throw new Error(`${userId} is invalid`)
    }

    let user_to_update = User.getById(userId);
    if (!user_to_update){
        throw new Error("The record doesn\'t exist.")
    }
    const allowed_keys = ["id", "username", "age", "hobbies"];
    const has_invalid_keys = Object.keys(body).some(key => !allowed_keys.includes(key));

    if (has_invalid_keys ||
        body["username"] && typeof body["username"] !== 'string' ||
        body["age"] && typeof body["age"] !== 'number' ||
        body["hobbies"] && !Array.isArray(body["hobbies"])
    ){
        throw new Error("Request contains unexpected or wrong fields");
    }

    user_to_update.username = body["username"] ? body["username"] : user_to_update.username;
    user_to_update.age = body["age"] ? body["age"] : user_to_update.age;
    user_to_update.hobbies = body["hobbies"] ? body["hobbies"] : user_to_update.hobbies;
    return User.update(user_to_update);
};

export const deleteUser = (userId: string) => {
    User.delete(userId);
};


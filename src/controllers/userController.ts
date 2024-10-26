import InterfaceUser from "../models/interfaceUser";
import {User} from "../models/userModel";

export const getAllusers = (): InterfaceUser[] => {
    return User.getAll();
}
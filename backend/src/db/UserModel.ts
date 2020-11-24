import { prop, getModelForClass } from "@typegoose/typegoose";
import { Project } from "./ProjectModel";

class User {
    @prop({required: true})
    public email?: string;

    @prop({required: true})
    public password?: string;

    @prop({default: "todd.jpg"})
    public avatar?: string;

    @prop({type: () => Project, required: false})
    public projects?: Project[];
}

const UserModel = getModelForClass(User);

export {UserModel};
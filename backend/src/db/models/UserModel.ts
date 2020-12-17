import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { Project }                     from "./ProjectModel";

class User {
    @prop({required: true})
    public username?: string;

    @prop({required: true})
    public email?: string;

    @prop({required: true})
    public password?: string;

    @prop({default: "todd.jpg"})
    public avatar?: string;

    @prop({default: new Date(), required: true})
    public dateOfSignUp?: Date;

    @prop({ref: Project, required: false})
    public projects?: Ref<Project>[];
}

const UserModel = getModelForClass(User);

export { UserModel, User };
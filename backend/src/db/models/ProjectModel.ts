import { prop, getModelForClass } from "@typegoose/typegoose";

class Project {
    @prop({required: true, default: "Untitled"})
    public name?: string;

    @prop({required: true, default: Date.now()})
    public dateOfCreation?: Date;

    @prop({required: true, default: Date.now()})
    public dateOfLastChange?: Date;

    @prop({required: true, default: 0})
    public files?: number;

    @prop({required: true, default: false})
    public publicAccess?: boolean
}
const ProjectModel = getModelForClass(Project);

export { Project, ProjectModel };

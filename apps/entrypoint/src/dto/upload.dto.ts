import { IsNotEmpty } from "class-validator";

export default class createUpdate{
    @IsNotEmpty()
    repoUrl:string
}
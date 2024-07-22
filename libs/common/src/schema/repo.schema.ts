import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { User } from './User.schema';

export type RepoDocument = Repo & Document;

@Schema()
export class Repo {
  @Prop({ required: true })
  repo: string;

  @Prop([{ type: mongooseSchema.Types.ObjectId,  ref : 'User' }])
  owner: User;
}

export const RepoSchema = SchemaFactory.createForClass(Repo);

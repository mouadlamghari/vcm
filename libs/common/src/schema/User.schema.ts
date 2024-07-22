import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { Repo } from './repo.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  githubId: string;

  @Prop({ unique: true })
  username: string;

  @Prop({ nullable: true })
  avatarUrl: string;

  @Prop([{ type: mongooseSchema.Types.ObjectId, ref: 'Repo' }])
  repos: Repo[];

  @Prop({ nullable: true })
  accessToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

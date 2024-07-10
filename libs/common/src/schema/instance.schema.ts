import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InstanceDocument = Instance & Document;

@Schema()
export class Instance {
  @Prop({ required: true })
  project: string;

  @Prop()
  domain: string;

  @Prop()
  subdomain: number;
}

export const InstanceSchema = SchemaFactory.createForClass(Instance);

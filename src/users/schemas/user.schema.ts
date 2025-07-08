import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phoneNumber?: string;

  @Prop({ required: true })
  pseudo: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  verifyCode?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  friends: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  friendRequests: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  sentRequests: Types.ObjectId[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
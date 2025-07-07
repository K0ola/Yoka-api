import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // ajoute automatiquement createdAt / updatedAt
export class Photo {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: false })
  saved: boolean;

  @Prop({ required: true })
  takenAt: Date; // ← la date et heure exacte de la prise

  @Prop()
  location?: string; // ← le lieu (ex: "Paris, France")
}

export type PhotoDocument = Photo & Document;
export const PhotoSchema = SchemaFactory.createForClass(Photo);

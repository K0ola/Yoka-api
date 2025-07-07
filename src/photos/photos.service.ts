import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Photo, PhotoDocument } from './schemas/photos.schema';

@Injectable()
export class PhotosService {
  constructor(@InjectModel(Photo.name) private photoModel: Model<PhotoDocument>) {}

  async uploadPhoto(
    userId: string,
    imageUrl: string,
    saved = false,
    takenAt: Date,
    location?: string,
  ) {
    console.log('💾 Enregistrement en base de données...');
    console.log({
      userId,
      imageUrl,
      saved,
      takenAt,
      location,
    });

    const photo = new this.photoModel({
      userId,
      imageUrl,
      saved,
      takenAt,
      location,
    });

    const result = await photo.save();
    console.log('✅ Photo enregistrée en DB :', result);
    return result;
  }

  async getUserPhotos(userId: string) {
    return await this.photoModel.find({ userId });
  }
}

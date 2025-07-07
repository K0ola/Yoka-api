import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Photo, PhotoDocument } from './schemas/photos.schema';

@Injectable()
export class PhotosService {
  constructor(
    @InjectModel(Photo.name)
    private photoModel: Model<PhotoDocument>,
  ) {}

  async uploadPhoto({
    userId,
    imageUrl,
    saved = false,
    takenAt,
    location,
  }: {
    userId: string;
    imageUrl: string;
    saved?: boolean;
    takenAt: Date;
    location?: string;
  }) {
    if (!imageUrl) throw new Error('🛑 imageUrl est undefined dans le service !');

    const photo = new this.photoModel({
      userId,
      imageUrl,
      saved,
      takenAt,
      location,
    });

    return await photo.save();
  }

  async getUserPhotos(userId: string) {
    return await this.photoModel.find({ userId });
  }
}

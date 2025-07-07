import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { PhotosService } from './photos.service';
import * as path from 'path';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${uuidv4()}${path.extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: {
      userId: string;
      saved?: string;
      takenAt: string;
      location?: string;
    },
  ) {
    console.log('📥 Requête reçue dans /photos/upload :');
    console.log('🖼️ Fichier :', file);
    console.log('📄 Données :', body);

    if (!file || !file.filename) {
      throw new BadRequestException('Aucun fichier valide reçu.');
    }

    const imageUrl = `/uploads/${file.filename}`;
    console.log('📸 imageUrl généré :', imageUrl);

    return this.photosService.uploadPhoto(
      body.userId,
      imageUrl,
      body.saved === 'true',
      new Date(body.takenAt),
      body.location,
    );
  }
}

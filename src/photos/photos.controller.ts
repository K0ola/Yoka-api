import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { PhotosService } from './photos.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
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

    // Enregistrement manuel du fichier
    const filename = `${uuidv4()}.jpg`;
    const uploadPath = path.join(__dirname, '..', '..', 'uploads', filename);

    fs.writeFileSync(uploadPath, file.buffer);

    const imageUrl = `/uploads/${filename}`;
    console.log('✅ imageUrl final :', imageUrl);

    return this.photosService.uploadPhoto(
      body.userId,
      imageUrl,
      body.saved === 'true',
      new Date(body.takenAt),
      body.location,
    );
  }
}

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer'; // ⬅️ À ajouter
import { v4 as uuidv4 } from 'uuid';
import { PhotosService } from './photos.service';
import * as fs from 'fs';
import * as path from 'path';

const storage = multer.memoryStorage(); // ⬅️ Utiliser memory storage ici

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', { storage })) // ⬅️ Ajout de { storage }
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

    if (!file || !file.buffer) {
      console.error('❌ Aucun fichier reçu ou buffer vide');
      throw new InternalServerErrorException('Aucun fichier image reçu.');
    }

    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${uuidv4()}.jpg`;
    const uploadPath = path.join(uploadsDir, filename);

    fs.writeFileSync(uploadPath, file.buffer);

    const imageUrl = `/uploads/${filename}`;
    console.log('✅ imageUrl généré :', imageUrl);

    const saved = body.saved === 'true';
    const takenAt = new Date(body.takenAt);

    return this.photosService.uploadPhoto(
      body.userId,
      imageUrl,
      saved,
      takenAt,
      body.location,
    );
  }
}

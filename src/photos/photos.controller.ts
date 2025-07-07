import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  InternalServerErrorException,
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

    if (!file || !file.buffer) {
      console.error('❌ Aucun fichier reçu ou buffer vide');
      throw new InternalServerErrorException('Aucun fichier image reçu.');
    }

    // Dossier d'upload
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${uuidv4()}.jpg`;
    const uploadPath = path.join(uploadsDir, filename);

    try {
      fs.writeFileSync(uploadPath, file.buffer);
    } catch (err) {
      console.error('❌ Erreur lors de l\'écriture du fichier :', err);
      throw new InternalServerErrorException('Erreur lors de l\'enregistrement du fichier.');
    }

    // Correction ici : imageUrl défini juste avant l'appel
    const imageUrl: string = `/uploads/${filename}`;
    console.log('✅ imageUrl généré :', imageUrl);

    const saved = body.saved === 'true';
    const takenAt = new Date(body.takenAt);

    if (!body.userId || !imageUrl || !takenAt) {
      console.error('❌ Données manquantes');
      throw new InternalServerErrorException('Données incomplètes.');
    }

    return this.photosService.uploadPhoto(
      body.userId,
      imageUrl,
      saved,
      takenAt,
      body.location,
    );
  }
}

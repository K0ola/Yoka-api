import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PhotosService } from './photos.service';
import { randomUUID } from 'crypto';

@Controller('photos')
export class PhotosController {
  private readonly logger = new Logger(PhotosController.name);

  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${randomUUID()}`;
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    this.logger.log('📥 Requête reçue dans /photos/upload :');
    this.logger.log('🖼️ Fichier : ' + JSON.stringify(file, null, 2));
    this.logger.log('📄 Données : ' + JSON.stringify(body, null, 2));

    // Vérification du fichier
    if (!file || !file.filename) {
      throw new Error('🛑 Aucun fichier reçu ou nom de fichier manquant');
    }

    // Construction de l’URL de l'image (adapte le domaine selon ton serveur)
    const imageUrl = `http://82.25.112.112:3000/uploads/${file.filename}`;

    const { userId, saved, takenAt, location } = body;

    this.logger.log('💾 Enregistrement en base de données...');
    this.logger.log({
      userId,
      imageUrl,
      saved,
      takenAt,
      location,
    });

    return await this.photosService.uploadPhoto({
      userId,
      imageUrl,
      saved: saved === 'true',
      takenAt: new Date(takenAt),
      location,
    });
  }
}

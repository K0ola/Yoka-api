import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
  ) {}

  async register(dto: { email: string; password: string; phoneNumber?: string; pseudo: string }) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const verifyCode = Math.floor(1000 + Math.random() * 9000).toString(); // Code à 4 chiffres

    const user = new this.userModel({
      ...dto,
      password: hashedPassword,
      isVerified: false,
      verifyCode,
    });

    const createdUser = await user.save();
    await this.mailService.sendVerificationEmail(createdUser.email, verifyCode);

    return { message: 'Inscription réussie, veuillez vérifier votre email.' };
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException("Utilisateur non trouvé");
    if (user.isVerified) throw new UnauthorizedException("Déjà vérifié");
  
    if (user.verifyCode !== code)
      throw new UnauthorizedException("Code invalide");
  
    user.isVerified = true;
    user.verifyCode = undefined;
    await user.save();
  
    return { message: "Adresse email vérifiée avec succès !" };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException("Utilisateur non trouvé");
    if (!user.isVerified) throw new UnauthorizedException("Email non vérifié");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException("Mot de passe incorrect");

    return {
      message: "Connexion réussie",
      user: {
        _id: user._id,
        email: user.email,
        pseudo: user.pseudo,
      }
    };
  }
  
}
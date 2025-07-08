import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Conversation, ConversationDocument } from '../conversations/schemas/conversation.schema'; // <-- Ajouté
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>, // <-- Ajouté
  ) {}

  async create(dto: { email: string; password: string; phoneNumber?: string; pseudo: string }) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({
      ...dto,
      password: hashedPassword,
    });
    return user.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async sendFriendRequest(fromId: string, toId: string) {
    if (fromId === toId) throw new BadRequestException("Impossible de s'ajouter soi-même.");

    const fromUser = await this.userModel.findById(fromId);
    const toUser = await this.userModel.findById(toId);

    if (!fromUser || !toUser) throw new NotFoundException('Utilisateur non trouvé');

    if (toUser.friendRequests.includes(new Types.ObjectId(fromId))) {
      throw new BadRequestException('Demande déjà envoyée');
    }

    toUser.friendRequests.push(new Types.ObjectId(fromId));
    fromUser.sentRequests.push(new Types.ObjectId(toId));

    await toUser.save();
    await fromUser.save();
  }

  async acceptFriendRequest(userId: string, requesterId: string) {
    const user = await this.userModel.findById(userId);
    const requester = await this.userModel.findById(requesterId);

    if (!user || !requester) throw new NotFoundException('Utilisateur non trouvé');

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);
    requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== userId);

    user.friends.push(new Types.ObjectId(requesterId));
    requester.friends.push(new Types.ObjectId(userId));

    await user.save();
    await requester.save();

    // ➕ Créer une conversation automatiquement (sauf si elle existe déjà)
    const existing = await this.conversationModel.findOne({
      participants: { $all: [user._id, requester._id], $size: 2 },
    });

    if (!existing) {
      await this.conversationModel.create({
        participants: [user._id, requester._id],
      });
    }
  }

  async rejectFriendRequest(userId: string, requesterId: string) {
    const user = await this.userModel.findById(userId);
    const requester = await this.userModel.findById(requesterId);

    if (!user || !requester) throw new NotFoundException('Utilisateur non trouvé');

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);
    requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== userId);

    await user.save();
    await requester.save();
  }

  async findByEmailOrPseudo(query: string) {
    return this.userModel.findOne({
      $or: [{ email: query }, { pseudo: query }],
    }).exec();
  }

  async getFriendRequests(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('friendRequests', 'pseudo _id')
      .exec();

    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    return user.friendRequests;
  }
}

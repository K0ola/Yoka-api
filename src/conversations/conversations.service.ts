import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './schemas/conversation.schema';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name) private convoModel: Model<Conversation>,
  ) {}

  async findOrCreateConversation(userIds: string[]) {
    const convo = await this.convoModel.findOne({
      participants: { $all: userIds, $size: userIds.length },
    });

    if (convo) return convo;
    return this.convoModel.create({ participants: userIds });
  }

  async getUserConversations(userId: string) {
    return this.convoModel.find({ participants: userId }).populate('participants');
  }
}

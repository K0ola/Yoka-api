import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private msgModel: Model<Message>,
  ) {}

  async sendMessage(conversationId: string, senderId: string, content: string) {
    return this.msgModel.create({ conversation: conversationId, sender: senderId, content });
  }

  async getMessages(conversationId: string) {
    return this.msgModel
      .find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'pseudo');
  }
}

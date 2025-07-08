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
    const created = await this.msgModel.create({
      conversation: conversationId,
      sender: senderId,
      content,
    });
  
    // Peupler le champ sender (nécessaire pour voir le pseudo côté front)
    return this.msgModel.findById(created._id).populate('sender', 'pseudo');
  }
  

  async getMessages(conversationId: string) {
    return this.msgModel
      .find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'pseudo');
  }
}

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

  // conversations.service.ts
async getConversationsForUser(userId: string) {
    const conversations = await this.convoModel
    .find({ participants: userId })
    .populate('participants', 'pseudo _id')
    .exec();

  
    return conversations.map((conv) => {
      const other = conv.participants.find(
        (p: any) => p._id.toString() !== userId
      );
  
      return conversations.map((conv) => {
        const populatedParticipants = conv.participants as any[];
        const other = populatedParticipants.find(
          (p) => p._id.toString() !== userId
        );
      
        return {
          _id: conv._id,
          pseudo: other?.pseudo || 'Inconnu',
        };
      });   
    }) 
    }
}

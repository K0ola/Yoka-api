import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly service: ConversationsService) {}

  @Post()
  create(@Body() body: { userIds: string[] }) {
    return this.service.findOrCreateConversation(body.userIds);
  }

  @Get(':userId')
    getUserConvos(@Param('userId') userId: string) {
    return this.service.getConversationsForUser(userId); // ✅ Remplacé
    }


}

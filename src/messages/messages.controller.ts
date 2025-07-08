import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  @Post()
  send(@Body() body: { conversationId: string, senderId: string, content: string }) {
    return this.service.sendMessage(body.conversationId, body.senderId, body.content);
  }

  @Get(':conversationId')
  getMessages(@Param('conversationId') conversationId: string) {
    return this.service.getMessages(conversationId);
  }
}

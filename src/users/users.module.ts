import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { Conversation, ConversationSchema } from '../conversations/schemas/conversation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Conversation.name, schema: ConversationSchema }
    ])
    
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [
    UsersService,
    MongooseModule, 
  ],
})
export class UsersModule {}

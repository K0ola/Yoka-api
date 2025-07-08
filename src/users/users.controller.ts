import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body() dto: { email: string; password: string; phoneNumber?: string; pseudo: string },
  ) {
    return this.usersService.create(dto);
  }



  @Post(':id/friends/request/:targetId')
  async sendRequest(@Param('id') id: string, @Param('targetId') targetId: string) {
    return this.usersService.sendFriendRequest(id, targetId);
  }

  @Post(':id/friends/accept/:requesterId')
  async acceptRequest(@Param('id') id: string, @Param('requesterId') requesterId: string) {
    return this.usersService.acceptFriendRequest(id, requesterId);
  }

  @Post(':id/friends/reject/:requesterId')
  async rejectRequest(@Param('id') id: string, @Param('requesterId') requesterId: string) {
    return this.usersService.rejectFriendRequest(id, requesterId);
  }

  @Get('search/:query')
  async searchUser(@Param('query') query: string) {
    return this.usersService.findByEmailOrPseudo(query);
  }

}

import { Body, Controller, Post } from '@nestjs/common';
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
}

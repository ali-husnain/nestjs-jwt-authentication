import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { CreateUserDTO } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    response.statusMessage = 'Logged in successfully';
    return this.authService.login(req.user);
  }

  @Post('auth/register')
  async register(
    @Body() createUserDto: CreateUserDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const checkExistingEmail = await this.userService.findOne(
      createUserDto.email,
    );
    if (checkExistingEmail) {
      throw new ConflictException('User already exist');
    }

    try {
      response.statusMessage = 'User created successfully';
      return await this.authService.register(createUserDto);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUsers() {
    return await this.userService.findAll();
  }
}

import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return this.sanitizedUser(user);
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDTO) {
    const user = await this.usersService.create(createUserDto);
    return this.sanitizedUser(user);
  }

  sanitizedUser(user: any) {
    return { email: user.email, name: user.name, _id: user._id };
  }
}

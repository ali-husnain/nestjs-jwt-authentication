import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDTO): Promise<User> {
    return this.userModel.create(createUserDto);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ email: username });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({}, { name: 1, email: 1 });
  }
}

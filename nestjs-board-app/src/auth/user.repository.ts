import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(credentialDto: AuthCredentialDto): Promise<void> {
    const { username, password } = credentialDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (e: any) {
      if (e.code === '23505') {
        throw new ConflictException('Existing Username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findUserByUsername(username: string): Promise<User> {
    return await this.findOneBy({ username: username });
  }
}

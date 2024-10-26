import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(credentialDto: AuthCredentialDto): Promise<void> {
    const { username, password } = credentialDto;
    const user = this.create({ username, password });

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
}

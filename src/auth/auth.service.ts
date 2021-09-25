import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { SlackService } from 'src/slack/slack.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger: Logger = new Logger('AuthService');

  async validateUser(authLoginDto: AuthLoginDto) {
    const { username, password } = authLoginDto;
    const user = await this.userService.findByUsernameOrEmail(username);
    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        const { password, ...result } = user;
        if (!user.emailConfirmed) {
          this.logger.verbose(
            `${authLoginDto.username} tried to login but didn't have email confirmed`,
          );
          throw new ForbiddenException(`Email not confirmed`);
        }
        this.logger.verbose(`${authLoginDto.username} logged in`);
        return result;
      }
    }
    this.logger.verbose(
      `${authLoginDto.username} tried to login but didn't provide correct credentials`,
    );
    throw new UnauthorizedException();
  }

  async login(authLoginDto: AuthLoginDto) {
    const user = await this.validateUser(authLoginDto);

    const payload = {
      userId: user.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}

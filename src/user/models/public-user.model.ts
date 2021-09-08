import { Plan, Role, User } from '@prisma/client';
import { Expose } from 'class-transformer';

export class PublicUser implements User {
  id: number;
  role: Role;
  plan: Plan;
  forgotPasswordToken: string;

  @Expose()
  username: string;

  @Expose()
  email: string;
  emailConfirmed: boolean;

  password: string;

  profileId: number;

  @Expose()
  score: number;

  lastDaily: Date;
  dailySessionUuid: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

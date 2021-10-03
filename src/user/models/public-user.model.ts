import { Plan, Profile, Role, User } from '@prisma/client';
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

  @Expose()
  emailConfirmed: boolean;

  emailConfirmationSentAt: Date;

  @Expose()
  ageConfirmed: boolean;

  password: string;

  @Expose()
  profile: Profile;
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

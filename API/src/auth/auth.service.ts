import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private supabase: SupabaseService,
    private prisma: PrismaService,
  ) {}

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.getClient().auth.signUp({
      email,
      password,
    });

    if (error) throw new ConflictException(error.message);

    // Mirror user in your own DB via Prisma
    const user = await this.prisma.user.create({
      data: {
        id: data.user?.id,
        email,
        createdAt: new Date(),
      },
    });

    return { user, session: data.session };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({
        email,
        password,
      });

    if (error) throw new UnauthorizedException(error.message);

    return { user: data.user, session: data.session };
  }

  async signOut(jwt: string) {
    // Set auth header then sign out
    const { error } = await this.supabase.getClient().auth.signOut();
    if (error) throw new UnauthorizedException(error.message);
    return { message: 'Signed out successfully' };
  }

  async getUser(jwt: string) {
    const { data, error } = await this.supabase.getClient().auth.getUser(jwt);
    if (error) throw new UnauthorizedException(error.message);
    return data.user;
  }
}

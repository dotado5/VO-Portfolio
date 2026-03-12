import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SupabaseGuard implements CanActivate {
  constructor(private supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) throw new UnauthorizedException('No token provided');

    const { data, error } = await this.supabase.getClient().auth.getUser(token);
    if (error || !data.user) throw new UnauthorizedException('Invalid token');

    request.user = data.user; // attach user to request
    return true;
  }
}

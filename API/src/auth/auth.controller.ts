import { Controller, Post, Body, Headers, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

class AuthDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto.email, dto.password);
  }

  @Post('signin')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto.email, dto.password);
  }

  @Post('signout')
  signOut(@Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    return this.authService.signOut(token);
  }

  @Get('me')
  getUser(@Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    return this.authService.getUser(token);
  }
}

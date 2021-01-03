import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { CreateUserDto } from '../../users/dto/create.dto';
import { AuthService } from '../service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { AuthResult } from '../dto/auth-result.dto';
import { AuthGoogleDto } from '../dto/auth-google.dto';
import { AuthGoogleGuard } from '@common/guards/google.guard';
import { GetGoogleUser } from '@common/decorators/get-google-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user by token' })
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser() user: any): any {
    return this.authService.getMe(user.id)
  }
  
  @ApiOperation({ summary: 'Login with email & password' })
  @ApiBody({ type: AuthCredentialsDto })
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  login(@GetUser() user: any): AuthResult {
    return this.authService.login(user)
  }

  @ApiOperation({ summary: 'Login with google' })
  @ApiBody({ type: AuthGoogleDto })
  @Post('/login/google')
  @UseGuards(new AuthGoogleGuard())
  async loginGoogle(@GetGoogleUser() user: any): Promise<AuthResult> {
    return this.authService.loginGoogle(user)
  }

  @ApiOperation({ summary: 'Sign up User' })
  @Post('/signup')
  async signUp(
    @Body() dto: CreateUserDto
  ): Promise<AuthResult> {
    return this.authService.signUp(dto)
  }
}

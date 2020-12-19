import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { v4 } from 'uuid';

import { redis } from '../../common/constants/redis';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { AuthGuard, AuthGuardGoogle } from '../../guards/auth.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { ConfigService } from '../../shared/services/config.service';
import { MailService } from '../mail/mail.service';
import { UserDto } from '../user/dto/UserDto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginPayloadDto } from './dto/LoginPayloadDto';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { UserLoginDto } from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        public readonly userService: UserService,
        public readonly authService: AuthService,
        public readonly mailService: MailService,
        public readonly configService: ConfigService,
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: LoginPayloadDto,
        description: 'User info with access token',
    })
    async userLogin(
        @Body() userLoginDto: UserLoginDto,
    ): Promise<LoginPayloadDto> {
        const userEntity = await this.authService.validateUser(userLoginDto);

        if (!userEntity.verified) {
            throw new UnauthorizedException();
        }

        const token = await this.authService.createToken(userEntity);
        return new LoginPayloadDto(userEntity.toDto(), token);
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    // @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
    // @ApiConsumes('multipart/form-data')
    // @ApiFile('avatar')
    // @UseInterceptors(FileInterceptor('avatar'))
    async userRegister(
        @Body() userRegisterDto: UserRegisterDto,
        // @UploadedFile() file: IFile,
    ): Promise<UserDto> {
        const createdUser = await this.userService.createUser(
            userRegisterDto,
            // file,
        );

        const code = v4();
        await redis.set(code, createdUser.id, 'ex', 60 * 60 * 15);

        await this.mailService.sendConfirmationEmail(createdUser, code);

        return createdUser.toDto();
    }

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    @UseInterceptors(AuthUserInterceptor)
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserDto, description: 'current user info' })
    getCurrentUser(@AuthUser() user: UserEntity) {
        return user.toDto();
    }

    @Get('confirm/:code')
    @HttpCode(HttpStatus.OK)
    async confirmEmail(@Param('code') code: string): Promise<UserDto> {
        return this.userService.confirmEmail(code);
    }

    @Get('google')
    @UseGuards(AuthGuardGoogle)
    googleAuth() {
        // do nothing.
    }

    @Get('google/callback')
    @UseGuards(AuthGuardGoogle)
    googleAuthRedirect(@Req() req, @Res() res) {
        const host = this.configService.get('CLIENT_HOST');
        const port = this.configService.get('CLIENT_PORT');
        if (req.user) {
            const payload = req.user as TokenPayloadDto;
            return res.redirect(
                `${host}:${port}/auth/welcome-page?accessToken=${payload.accessToken}&expiresIn=${payload.expiresIn}`,
            );
        }
        return res.redirect(`${host}:${port}/auth/login`);
    }
}

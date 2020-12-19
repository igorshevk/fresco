import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { UserGoogleNotValidException } from '../../exceptions/user-google-not-valid-exception';
import { ConfigService } from '../../shared/services/config.service';
import { AuthService } from './auth.service';
import { GoogleProfileDto } from './dto/GoogleProfileDto';
import { UserLoginGoogleDto } from './dto/UserLoginGoogleDto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        public readonly configService: ConfigService,
        public readonly authService: AuthService,
    ) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_SECRET'),
            callbackURL: configService.get('CALL_BACK_URL'),
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: GoogleProfileDto,
        done: VerifyCallback,
    ): Promise<any> {
        try {
            const { displayName, emails, id } = profile;
            if (emails && emails.length > 0 && !emails[0].verified) {
                throw new UserGoogleNotValidException();
            }

            const userLoginGoogleDto: UserLoginGoogleDto = {
                email: emails[0].value,
                name: displayName,
                verified: true,
                googleId: id,
            };

            const user = await this.authService.validateOAuthLoginEmail(
                userLoginGoogleDto.email,
                userLoginGoogleDto,
            );

            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }
}

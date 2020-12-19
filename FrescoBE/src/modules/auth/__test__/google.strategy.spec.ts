import { Test } from '@nestjs/testing';

import { ConfigService } from '../../../shared/services/config.service';
import { AuthService } from '../auth.service';
import { GoogleProfileDto } from '../dto/GoogleProfileDto';
import { GoogleStrategy } from '../google.strategy';

const mockAuthService = () => ({
    validateOAuthLoginEmail: jest.fn(),
});

describe('GoogleStrategy', () => {
    let googleStrategy: GoogleStrategy;
    let authService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                GoogleStrategy,
                ConfigService,
                { provide: AuthService, useFactory: mockAuthService },
            ],
        }).compile();

        googleStrategy = module.get<GoogleStrategy>(GoogleStrategy);
        authService = module.get<AuthService>(AuthService);
    });

    describe('validate', () => {
        it('validate and return the user token payload', async () => {
            const done = jest.fn();
            const googleProfile = new GoogleProfileDto();
            googleProfile.displayName = 'display name';
            googleProfile.verified = true;
            googleProfile.emails = [
                {
                    value: 'test@example.com',
                    verified: true,
                },
            ];

            authService.validateOAuthLoginEmail.mockResolvedValue({
                accessToken: 'JWT Token',
                expiresIn: 12321123,
            });
            expect(authService.validateOAuthLoginEmail).not.toHaveBeenCalled();

            await googleStrategy.validate(null, null, googleProfile, done);
            expect(done).toBeCalled();
        });

        it('throws an user google not valid exception with email is null', async () => {
            const done = jest.fn();
            const googleProfile = new GoogleProfileDto();
            googleProfile.displayName = 'display name';
            googleProfile.verified = true;
            googleProfile.emails = null;

            await googleStrategy.validate(null, null, googleProfile, done);

            expect(authService.validateOAuthLoginEmail).not.toHaveBeenCalled();
            expect(done).toBeCalled();
        });

        it('throws an user google not valid exception with email is empty', async () => {
            const done = jest.fn();
            const googleProfile = new GoogleProfileDto();
            googleProfile.displayName = 'display name';
            googleProfile.verified = true;
            googleProfile.emails = [
                {
                    value: null,
                    verified: null,
                },
            ];

            await googleStrategy.validate(null, null, googleProfile, done);

            expect(authService.validateOAuthLoginEmail).not.toHaveBeenCalled();
            expect(done).toBeCalled();
        });
    });
});

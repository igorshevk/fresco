import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';

import { ConfigService } from '../../../shared/services/config.service';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { UserLoginGoogleDto } from '../dto/UserLoginGoogleDto';

const mockUserGoogle: UserLoginGoogleDto = {
    email: 'test@gmail.com',
    name: 'test user',
    verified: true,
};

const mockJwtService = () => ({
    signAsync: jest.fn(),
});

const mockConfigService = () => ({
    getNumber: jest.fn(),
});

const mockUserService = () => ({
    findByUsernameOrEmail: jest.fn(),
    createUserForGoogle: jest.fn(),
    update: jest.fn(),
});

describe('AuthService', () => {
    let authService;
    let jwtService;
    let configService;
    let userService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: JwtService, useFactory: mockJwtService },
                { provide: ConfigService, useFactory: mockConfigService },
                { provide: UserService, useFactory: mockUserService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);
        userService = module.get<UserService>(UserService);
    });

    describe('validateOAuthLoginEmail', () => {
        it('find an email from user service', async () => {
            const expectedResult = {
                accessToken: 'JWT Token',
                expiresIn: 12321123,
            };
            userService.findByUsernameOrEmail.mockResolvedValue({
                id: '3731dc00-e5e9-4069-bc64-9e59a5e9795b',
            }); // or mockReturnValue, mockRejectedValue
            configService.getNumber.mockReturnValue(expectedResult.expiresIn);
            jwtService.signAsync.mockResolvedValue(expectedResult.accessToken);

            expect(userService.findByUsernameOrEmail).not.toHaveBeenCalled();
            // class authService.validateOAuthLoginEmail
            const result = await authService.validateOAuthLoginEmail(
                mockUserGoogle.email,
                mockUserGoogle,
            );
            // expect authService.validateOAuthLoginEmail TO HAVE BEEN CALLED
            expect(userService.createUserForGoogle).not.toHaveBeenCalled();
            expect(userService.findByUsernameOrEmail).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });

        it('email not found from user service', async () => {
            const expectedResult = {
                accessToken: 'JWT Token',
                expiresIn: 12321123,
            };
            userService.findByUsernameOrEmail.mockResolvedValue(null);
            userService.createUserForGoogle.mockResolvedValue({
                id: 'testId',
            });
            configService.getNumber.mockReturnValue(expectedResult.expiresIn);
            jwtService.signAsync.mockResolvedValue(expectedResult.accessToken);

            expect(userService.findByUsernameOrEmail).not.toHaveBeenCalled();
            expect(userService.createUserForGoogle).not.toHaveBeenCalled();

            const result = await authService.validateOAuthLoginEmail(
                mockUserGoogle.email,
                mockUserGoogle,
            );

            expect(userService.createUserForGoogle).toHaveBeenCalled();
            expect(userService.findByUsernameOrEmail).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });
    });
});

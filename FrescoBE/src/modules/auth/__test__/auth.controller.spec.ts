/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';

import { ConfigService } from '../../../shared/services/config.service';
import { MailService } from '../../mail/mail.service';
import { UserService } from '../../user/user.service';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { TokenPayloadDto } from '../dto/TokenPayloadDto';

const mockUserService = () => ({});

const mockAuthService = () => ({});

const mockMailService = () => ({});

describe('AuthController', () => {
    let authController: AuthController;
    let configService: ConfigService;
    let userService: UserService;
    let authService: AuthService;
    let mailService: MailService;
    let host: string;
    let port: string;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                ConfigService,
                { provide: UserService, useFactory: mockUserService },
                { provide: AuthService, useFactory: mockAuthService },
                { provide: MailService, useFactory: mockMailService },
            ],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        configService = module.get<ConfigService>(ConfigService);
        userService = module.get<UserService>(UserService);
        authService = module.get<AuthService>(AuthService);
        mailService = module.get<MailService>(MailService);
        host = configService.get('CLIENT_HOST');
        port = configService.get('CLIENT_PORT');
    });

    describe('googleAuthRedirect', () => {
        it('redirect to welcome page', () => {
            const user: TokenPayloadDto = {
                accessToken: 'JWT Token',
                expiresIn: 123123,
            };
            const req = {
                user,
            };
            const res = {
                redirect: jest.fn(),
            };

            const url = `${host}:${port}/auth/welcome-page?accessToken=${user.accessToken}&expiresIn=${user.expiresIn}`;

            authController.googleAuthRedirect(req, res);
            expect(res.redirect).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenLastCalledWith(url);
        });

        it('redirect to login page', () => {
            const req = {
                user: null,
            };
            const res = {
                redirect: jest.fn(),
            };
            const url = `${host}:${port}/auth/login`;

            authController.googleAuthRedirect(req, res);
            expect(res.redirect).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenLastCalledWith(url);
        });
    });
});

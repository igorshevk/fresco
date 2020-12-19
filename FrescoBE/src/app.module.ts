import './boilerplate.polyfill';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import * as path from 'path';

import { contextMiddleware } from './middlewares';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { UserModule } from './modules/user/user.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        MailModule,
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) =>
                configService.typeOrmConfig,
            inject: [ConfigService],
        }),
        I18nModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                fallbackLanguage: configService.fallbackLanguage,
                parserOptions: {
                    path: path.join(__dirname, '/i18n/'),
                    watch: configService.isDevelopment,
                },
            }),
            imports: [SharedModule],
            parser: I18nJsonParser,
            inject: [ConfigService],
        }),
        MailerModule.forRootAsync({
            imports: [MailerModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const {
                    host,
                    port,
                    user,
                    password,
                    defaultFrom,
                } = configService.smtpConfig;
                return {
                    transport: {
                        host,
                        port,
                        // secure: true,
                        // tls: { ciphers: 'SSLv3' }, // gmail
                        auth: {
                            user,
                            pass: password,
                        },
                    },
                    defaults: {
                        from: defaultFrom,
                    },
                    template: {
                        dir: __dirname + '/templates',
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                };
            },
        }),
        BullModule.registerQueueAsync({
            imports: [BullModule],
            inject: [ConfigService],
            name: 'email',
            useFactory: (configService: ConfigService) => ({
                redis: {
                    host: configService.redisConfig.host,
                    port: configService.redisConfig.port,
                },
            }),
        }),
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(contextMiddleware).forRoutes('*');
    }
}

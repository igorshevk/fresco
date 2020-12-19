import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { MailController } from './mail.controller';
import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'email',
        }),
    ],
    controllers: [MailController],
    exports: [MailService],
    providers: [MailProcessor, MailService],
})
export class MailModule {}

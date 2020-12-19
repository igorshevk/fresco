import { MailerService } from '@nestjs-modules/mailer';
import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { UserDto } from '../user/dto/UserDto';

// Consumer class as mentioned in the docs
@Processor('email')
export class MailProcessor {
    private readonly _logger = new Logger(MailProcessor.name);

    constructor(private readonly _mailerService: MailerService) {}

    @OnQueueActive()
    onActive(job: Job): null {
        this._logger.debug(
            `Processing job ${job.id} of type ${
                job.name
            }. Data: ${JSON.stringify(job.data)}`,
        );
        return null;
    }

    @OnQueueCompleted()
    onComplete(job: Job, result: any): null {
        this._logger.debug(
            `Completed job ${job.id} of type ${
                job.name
            }. Result: ${JSON.stringify(result)}`,
        );
        return null;
    }

    @OnQueueFailed()
    onError(job: Job<any>, error: any): null {
        this._logger.error(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `Failed job ${job.id} of type ${job.name}: ${error.message}`,
            error.stack,
        );
        return null;
    }

    @Process('confirmation')
    async sendWelcomeEmail(
        job: Job<{ user: UserDto; code: string }>,
    ): Promise<any> {
        // eslint-disable-next-line no-restricted-syntax
        this._logger.log(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `Sending confirmation email to '${job.data.user.email}'`,
        );

        const url = `http://localhost:3001/auth/email-confirmation/${job.data.code}`;

        // if (config.get<boolean>('mail.live')) {
        //     return 'SENT MOCK CONFIRMATION EMAIL';
        // }

        try {
            const result = await this._mailerService.sendMail({
                template: 'confirmation',
                context: {
                    url,
                    user: job.data.user,
                },
                subject: 'Welcome to Fresco! Please Confirm Your Email Address',
                to: job.data.user.email,
            });
            // eslint-disable-next-line @typescript-eslint/tslint/config
            return result;
        } catch (error) {
            this._logger.error(
                `Failed to send confirmation email to '${job.data.user.email}'`,
                error.stack,
            );
            throw error;
        }
    }
}

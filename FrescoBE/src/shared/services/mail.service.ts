import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MailService {
    constructor(
        @InjectQueue('email')
        private _mailQueue: Queue,
    ) {}

    /** Send email confirmation link to new user account. */
    async sendConfirmationEmail(
        userId: string,
        code: string,
    ): Promise<boolean> {
        try {
            //  name job. name is optional
            await this._mailQueue.add('confirmation', {
                userId,
                code,
            });
            return true;
        } catch (error) {
            // this.logger.error(`Error queueing confirmation email to user ${user.email}`)
            return false;
        }
    }
}

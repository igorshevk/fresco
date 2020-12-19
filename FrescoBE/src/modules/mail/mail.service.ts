import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { UserDto } from '../user/dto/UserDto';

@Injectable()
export class MailService {
    constructor(
        @InjectQueue('email')
        private _mailQueue: Queue,
    ) {}

    /** Send email confirmation link to new user account. */
    async sendConfirmationEmail(user: UserDto, code: string): Promise<boolean> {
        try {
            //  named job. name is optional
            await this._mailQueue.add('confirmation', {
                user,
                code,
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}

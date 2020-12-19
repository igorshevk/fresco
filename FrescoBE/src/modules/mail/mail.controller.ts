'use strict';

import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MailService } from './mail.service';

@Controller('mail')
@ApiTags('mail')
export class MailController {
    constructor(private _mailService: MailService) {}
}

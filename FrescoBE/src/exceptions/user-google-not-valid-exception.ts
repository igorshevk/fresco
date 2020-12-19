import { InternalServerErrorException } from '@nestjs/common';

export class UserGoogleNotValidException extends InternalServerErrorException {
    constructor(error?: string) {
        super('error.user_google_not_Valid', error);
    }
}

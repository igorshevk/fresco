'use strict';

export class GoogleProfileDto {
    id: string;

    displayName: string;

    emails: [{ value: string; verified: boolean }];

    name: { familyName: string; givenName: string };

    photos: [{ value: string }];

    verified: boolean;
}

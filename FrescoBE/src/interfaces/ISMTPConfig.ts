'use strict';

export interface ISMTPConfig {
    host: string;
    port: string;
    user: string;
    password: string;
    defaultFrom: string;
}

'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class UserLoginGoogleDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @Column()
    readonly name: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    @Column()
    readonly email: string;

    readonly verified?: boolean;

    readonly googleId?: string;
}

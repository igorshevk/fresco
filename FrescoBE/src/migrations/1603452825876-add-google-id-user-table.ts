import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGoogleIdUserTable1603452825876 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE `users` ADD `googleId` VARCHAR(255) DEFAULT NULL;',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'googleId');
    }
}

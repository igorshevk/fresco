import {MigrationInterface, QueryRunner} from "typeorm";

export class userTable1603144374815 implements MigrationInterface {
    name = 'userTable1603144374815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `users` (`id` varchar(36) NOT NULL, `name` varchar(255) NULL, `role` enum ('USER', 'ADMIN') NOT NULL DEFAULT 'USER', `email` varchar(255) NULL, `password` varchar(255) NULL, `verified` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`");
        await queryRunner.query("DROP TABLE `users`");
    }

}

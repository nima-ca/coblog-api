import { MigrationInterface, QueryRunner } from "typeorm";

export class PostPublishedStatus1728850321065 implements MigrationInterface {
    name = 'PostPublishedStatus1728850321065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "isPublished" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "isPublished"`);
    }

}

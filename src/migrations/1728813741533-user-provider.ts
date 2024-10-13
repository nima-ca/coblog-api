import { MigrationInterface, QueryRunner } from "typeorm";

export class UserProvider1728813741533 implements MigrationInterface {
    name = 'UserProvider1728813741533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_provider_enum" AS ENUM('google', 'password')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "provider" "public"."user_provider_enum" NOT NULL DEFAULT 'password'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "provider"`);
        await queryRunner.query(`DROP TYPE "public"."user_provider_enum"`);
    }

}

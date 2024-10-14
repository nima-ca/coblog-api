import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryPostOnDeleteOnUpdate1728903295627 implements MigrationInterface {
    name = 'CategoryPostOnDeleteOnUpdate1728903295627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_category" DROP CONSTRAINT "FK_08d685cc924e645dfad494c9129"`);
        await queryRunner.query(`ALTER TABLE "post_category" ADD CONSTRAINT "FK_08d685cc924e645dfad494c9129" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_category" DROP CONSTRAINT "FK_08d685cc924e645dfad494c9129"`);
        await queryRunner.query(`ALTER TABLE "post_category" ADD CONSTRAINT "FK_08d685cc924e645dfad494c9129" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

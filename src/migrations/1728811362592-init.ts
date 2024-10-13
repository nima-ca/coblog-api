import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1728811362592 implements MigrationInterface {
    name = 'Init1728811362592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reaction_type_enum" AS ENUM('like', 'dislike', 'love', 'wow', 'sad', 'angry', 'think')`);
        await queryRunner.query(`CREATE TABLE "reaction" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "type" "public"."reaction_type_enum" NOT NULL, "userId" integer, "postId" integer, "commentId" integer, CONSTRAINT "PK_41fbb346da22da4df129f14b11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "content" text NOT NULL, "authorId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "content" text NOT NULL, "userId" integer, "postId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "profilePicture" character varying, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "isVerified" boolean NOT NULL DEFAULT false, "otp" character varying, "otpSendTime" TIMESTAMP WITH TIME ZONE, "lastLogin" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_category" ("postId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_f31260b64eb7c3b1679d826dace" PRIMARY KEY ("postId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_494ef7ec4fdfe88460918524b5" ON "post_category" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_08d685cc924e645dfad494c912" ON "post_category" ("categoryId") `);
        await queryRunner.query(`CREATE TABLE "post_tag" ("postId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_7e4fae2ea901c7c38a0e431d2b3" PRIMARY KEY ("postId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_444c1b4f6cd7b632277f557935" ON "post_tag" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_346168a19727fca1b1835790a1" ON "post_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_e58a09ab17e3ce4c47a1a330ae1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_dc3aeb83dc815f9f22ebfa7785f" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reaction" ADD CONSTRAINT "FK_4584f851fc6471f517d9dad8966" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_category" ADD CONSTRAINT "FK_494ef7ec4fdfe88460918524b51" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_category" ADD CONSTRAINT "FK_08d685cc924e645dfad494c9129" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_tag" ADD CONSTRAINT "FK_444c1b4f6cd7b632277f5579354" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_tag" ADD CONSTRAINT "FK_346168a19727fca1b1835790a14" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_tag" DROP CONSTRAINT "FK_346168a19727fca1b1835790a14"`);
        await queryRunner.query(`ALTER TABLE "post_tag" DROP CONSTRAINT "FK_444c1b4f6cd7b632277f5579354"`);
        await queryRunner.query(`ALTER TABLE "post_category" DROP CONSTRAINT "FK_08d685cc924e645dfad494c9129"`);
        await queryRunner.query(`ALTER TABLE "post_category" DROP CONSTRAINT "FK_494ef7ec4fdfe88460918524b51"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_4584f851fc6471f517d9dad8966"`);
        await queryRunner.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_dc3aeb83dc815f9f22ebfa7785f"`);
        await queryRunner.query(`ALTER TABLE "reaction" DROP CONSTRAINT "FK_e58a09ab17e3ce4c47a1a330ae1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_346168a19727fca1b1835790a1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_444c1b4f6cd7b632277f557935"`);
        await queryRunner.query(`DROP TABLE "post_tag"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_08d685cc924e645dfad494c912"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_494ef7ec4fdfe88460918524b5"`);
        await queryRunner.query(`DROP TABLE "post_category"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "reaction"`);
        await queryRunner.query(`DROP TYPE "public"."reaction_type_enum"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}

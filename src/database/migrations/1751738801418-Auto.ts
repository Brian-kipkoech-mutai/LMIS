import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1751738801418 implements MigrationInterface {
    name = 'Auto1751738801418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "region" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8d766fc1d4d2e72ecd5f6567a02" UNIQUE ("name"), CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "market" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "market" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "market" ADD "regionId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "UQ_1aeb3f3714d39ebc4697c220e97" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "market" ADD CONSTRAINT "FK_672bccddc5f7a96013b47503154" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "FK_672bccddc5f7a96013b47503154"`);
        await queryRunner.query(`ALTER TABLE "market" DROP CONSTRAINT "UQ_1aeb3f3714d39ebc4697c220e97"`);
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "regionId"`);
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "market" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "market" ADD "location" jsonb`);
        await queryRunner.query(`ALTER TABLE "market" ADD "region" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "region"`);
    }

}

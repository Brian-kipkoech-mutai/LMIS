import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1752752288139 implements MigrationInterface {
    name = 'Auto1752752288139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "livestock_grade" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "speciesId" integer NOT NULL, CONSTRAINT "PK_378867f7bc886cea8ba66648222" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "livestock_species" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_298cb82a744916ae3bb0ee1a507" UNIQUE ("name"), CONSTRAINT "PK_c21f1eb7ee9e7fe419e4759d4d4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "livestock_grade" ADD CONSTRAINT "FK_430cc21dc42d4800b3241afd981" FOREIGN KEY ("speciesId") REFERENCES "livestock_species"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "livestock_grade" DROP CONSTRAINT "FK_430cc21dc42d4800b3241afd981"`);
        await queryRunner.query(`DROP TABLE "livestock_species"`);
        await queryRunner.query(`DROP TABLE "livestock_grade"`);
    }

}

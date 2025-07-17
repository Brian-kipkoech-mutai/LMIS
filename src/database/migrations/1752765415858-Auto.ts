 import { MigrationInterface, QueryRunner } from 'typeorm';

 export class Auto1752765415858 implements MigrationInterface {
   name = 'Auto1752765415858';

   public async up(queryRunner: QueryRunner): Promise<void> {
     // Only add the foreign key constraint (assumes the old ones were already removed manually)
     await queryRunner.query(`
      ALTER TABLE "lmis_user"
      ADD CONSTRAINT "FK_1900d41dfd389d74d5a5156811e"
      FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
   }

   public async down(queryRunner: QueryRunner): Promise<void> {
     // In case you ever need to roll back
     await queryRunner.query(`
      ALTER TABLE "lmis_user"
      DROP CONSTRAINT "FK_1900d41dfd389d74d5a5156811e"
    `);

     await queryRunner.query(`
      ALTER TABLE "lmis_user"
      ADD CONSTRAINT "UQ_1900d41dfd389d74d5a5156811e"
      UNIQUE ("regionId")
    `);

     await queryRunner.query(`
      ALTER TABLE "lmis_user"
      ADD CONSTRAINT "FK_1900d41dfd389d74d5a5156811e"
      FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
   }
 }


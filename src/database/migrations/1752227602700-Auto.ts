import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1752227602700 implements MigrationInterface {
    name = 'Auto1752227602700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."market_markettype_enum" RENAME TO "market_markettype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."market_markettype_enum" AS ENUM('local', 'export')`);
        await queryRunner.query(`ALTER TABLE "market" ALTER COLUMN "marketType" TYPE "public"."market_markettype_enum" USING "marketType"::"text"::"public"."market_markettype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."market_markettype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."market_markettype_enum_old" AS ENUM('import', 'export')`);
        await queryRunner.query(`ALTER TABLE "market" ALTER COLUMN "marketType" TYPE "public"."market_markettype_enum_old" USING "marketType"::"text"::"public"."market_markettype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."market_markettype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."market_markettype_enum_old" RENAME TO "market_markettype_enum"`);
    }

}

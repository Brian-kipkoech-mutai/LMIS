import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1751620147539 implements MigrationInterface {
    name = 'Auto1751620147539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "market" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "region" character varying NOT NULL, "location" jsonb, CONSTRAINT "PK_1e9a2963edfd331d92018e3abac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otp" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "code" character varying NOT NULL, "type" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lmis_user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, "deletedAt" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLogin" TIMESTAMP, "lastPasswordChange" TIMESTAMP, CONSTRAINT "UQ_3f8208d9448917f6fab9758b475" UNIQUE ("username"), CONSTRAINT "UQ_22b486809da172d6c9d83eb1456" UNIQUE ("email"), CONSTRAINT "PK_03e10b9efc1c61ebd6966484ef5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "audit_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" character varying NOT NULL, "entityType" character varying NOT NULL, "entityId" character varying, "actor" jsonb, "oldValues" jsonb, "newValues" jsonb, "ipAddress" character varying NOT NULL, "userAgent" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "success" boolean NOT NULL DEFAULT true, "errorMessage" character varying, "description" text, CONSTRAINT "PK_07fefa57f7f5ab8fc3f52b3ed0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "otp" ADD CONSTRAINT "FK_db724db1bc3d94ad5ba38518433" FOREIGN KEY ("userId") REFERENCES "lmis_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "otp" DROP CONSTRAINT "FK_db724db1bc3d94ad5ba38518433"`);
        await queryRunner.query(`DROP TABLE "audit_log"`);
        await queryRunner.query(`DROP TABLE "lmis_user"`);
        await queryRunner.query(`DROP TABLE "otp"`);
        await queryRunner.query(`DROP TABLE "market"`);
    }

}

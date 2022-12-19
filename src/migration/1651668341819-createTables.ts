import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTables1651668341819 implements MigrationInterface {
  name = 'createTables1651668341819';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dialog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userIds" character varying array NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4f781f5927f06344939f8c3a1f1" UNIQUE ("userIds"), CONSTRAINT "PK_09744e0ee61b1ddf028d8eb8497" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "dialogId" uuid NOT NULL, "isChanged" boolean NOT NULL DEFAULT false, "text" text, "file" character varying DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_272cbdaaa9de52e4d879fa5a501" FOREIGN KEY ("dialogId") REFERENCES "dialog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_272cbdaaa9de52e4d879fa5a501"`,
    );
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "dialog"`);
  }
}

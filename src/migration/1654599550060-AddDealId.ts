import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDealId1654599550060 implements MigrationInterface {
  name = 'AddDealId1654599550060';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE dialog CASCADE`);
    await queryRunner.query(`TRUNCATE message CASCADE`);

    await queryRunner.query(
      `ALTER TABLE "dialog" ADD "dealId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "dialog" ADD CONSTRAINT "UQ_51fe3d2f9fd85583f61af3978ae" UNIQUE ("dealId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "dialog" DROP CONSTRAINT "UQ_4f781f5927f06344939f8c3a1f1"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dialog" ADD CONSTRAINT "UQ_4f781f5927f06344939f8c3a1f1" UNIQUE ("userIds")`,
    );
    await queryRunner.query(
      `ALTER TABLE "dialog" DROP CONSTRAINT "UQ_51fe3d2f9fd85583f61af3978ae"`,
    );
    await queryRunner.query(`ALTER TABLE "dialog" DROP COLUMN "dealId"`);
  }
}

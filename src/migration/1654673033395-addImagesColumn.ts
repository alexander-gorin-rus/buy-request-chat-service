import { MigrationInterface, QueryRunner } from 'typeorm';

export class addImagesColumn1654673033395 implements MigrationInterface {
  name = 'addImagesColumn1654673033395';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message" ADD "images" character varying array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "images"`);
  }
}

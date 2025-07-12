import { MigrationInterface, QueryRunner } from "typeorm";

export class SetupTables1752327563815 implements MigrationInterface {
    name = 'SetupTables1752327563815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "service" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "duration" integer NOT NULL, "price" numeric(10,2) NOT NULL, "bufferTime" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "appointment" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "staffId" integer NOT NULL, "serviceId" integer NOT NULL, "startTime" TIMESTAMP WITH TIME ZONE NOT NULL, "endTime" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "staff" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "timezone" character varying NOT NULL DEFAULT 'UTC', CONSTRAINT "PK_e4ee98bb552756c180aec1e854a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "working_hours" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "dayOfWeek" integer NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "staffId" integer, CONSTRAINT "PK_5f84d2fa3953367fe9d704d8df6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "staff_services_service" ("staffId" integer NOT NULL, "serviceId" integer NOT NULL, CONSTRAINT "PK_88026c9cc44b3d320794d588a79" PRIMARY KEY ("staffId", "serviceId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_42b67933b216d6143edb933eb6" ON "staff_services_service" ("staffId") `);
        await queryRunner.query(`CREATE INDEX "IDX_212c7ba88eca06bbfb5792f774" ON "staff_services_service" ("serviceId") `);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_9c1066af3b6cc0f8c54de747b07" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "working_hours" ADD CONSTRAINT "FK_f0865cbd77448d0d22386ecf9c1" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff_services_service" ADD CONSTRAINT "FK_42b67933b216d6143edb933eb6b" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "staff_services_service" ADD CONSTRAINT "FK_212c7ba88eca06bbfb5792f7745" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff_services_service" DROP CONSTRAINT "FK_212c7ba88eca06bbfb5792f7745"`);
        await queryRunner.query(`ALTER TABLE "staff_services_service" DROP CONSTRAINT "FK_42b67933b216d6143edb933eb6b"`);
        await queryRunner.query(`ALTER TABLE "working_hours" DROP CONSTRAINT "FK_f0865cbd77448d0d22386ecf9c1"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_9c1066af3b6cc0f8c54de747b07"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_212c7ba88eca06bbfb5792f774"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_42b67933b216d6143edb933eb6"`);
        await queryRunner.query(`DROP TABLE "staff_services_service"`);
        await queryRunner.query(`DROP TABLE "working_hours"`);
        await queryRunner.query(`DROP TABLE "staff"`);
        await queryRunner.query(`DROP TABLE "appointment"`);
        await queryRunner.query(`DROP TABLE "service"`);
    }

}

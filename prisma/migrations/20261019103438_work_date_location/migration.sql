-- Ажлын огноо ба байршил. Одоо байгаа мөрд огноог бүртгэсэн өдрөөр (Улаанбаатар),
-- байршлыг хоосноор бөглөөд админ засна.
ALTER TABLE "Work" ADD COLUMN "doneOn" DATE;
ALTER TABLE "Work" ADD COLUMN "location" TEXT NOT NULL DEFAULT '';
UPDATE "Work" SET "doneOn" = ("createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Ulaanbaatar')::date;
ALTER TABLE "Work" ALTER COLUMN "doneOn" SET NOT NULL;
ALTER TABLE "Work" ALTER COLUMN "location" DROP DEFAULT;

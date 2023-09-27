/*
  Warnings:

  - You are about to drop the `Directory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Directory";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CrateSrc" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL
);

/*
  Warnings:

  - The primary key for the `FilesDirectory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CrateSrc` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FilesDirectory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL
);
INSERT INTO "new_FilesDirectory" ("id", "path") SELECT "id", "path" FROM "FilesDirectory";
DROP TABLE "FilesDirectory";
ALTER TABLE "new_FilesDirectory" RENAME TO "FilesDirectory";
CREATE UNIQUE INDEX "FilesDirectory_path_key" ON "FilesDirectory"("path");
CREATE TABLE "new_CrateSrc" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_CrateSrc" ("id", "path", "type") SELECT "id", "path", "type" FROM "CrateSrc";
DROP TABLE "CrateSrc";
ALTER TABLE "new_CrateSrc" RENAME TO "CrateSrc";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

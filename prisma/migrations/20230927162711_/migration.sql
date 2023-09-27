/*
  Warnings:

  - You are about to drop the column `filename` on the `FilesDirectory` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FilesDirectory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL
);
INSERT INTO "new_FilesDirectory" ("id", "path") SELECT "id", "path" FROM "FilesDirectory";
DROP TABLE "FilesDirectory";
ALTER TABLE "new_FilesDirectory" RENAME TO "FilesDirectory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

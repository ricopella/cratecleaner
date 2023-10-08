/*
  Warnings:

  - Added the required column `scanId` to the `DeletedFiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `success` to the `DeletedFiles` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DeletedFiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "count" INTEGER NOT NULL,
    "errors" TEXT NOT NULL,
    "success" TEXT NOT NULL,
    "scanId" TEXT NOT NULL,
    CONSTRAINT "DeletedFiles_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DeletedFiles" ("count", "createdAt", "errors", "id", "updatedAt") SELECT "count", "createdAt", "errors", "id", "updatedAt" FROM "DeletedFiles";
DROP TABLE "DeletedFiles";
ALTER TABLE "new_DeletedFiles" RENAME TO "DeletedFiles";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

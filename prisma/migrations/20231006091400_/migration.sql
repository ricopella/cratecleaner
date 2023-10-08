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
    "status" TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT "DeletedFiles_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DeletedFiles" ("count", "createdAt", "errors", "id", "scanId", "success", "updatedAt") SELECT "count", "createdAt", "errors", "id", "scanId", "success", "updatedAt" FROM "DeletedFiles";
DROP TABLE "DeletedFiles";
ALTER TABLE "new_DeletedFiles" RENAME TO "DeletedFiles";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

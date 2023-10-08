-- CreateTable
CREATE TABLE "DeletedFiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "count" INTEGER NOT NULL,
    "errors" TEXT NOT NULL
);

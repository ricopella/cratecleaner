/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `FilesDirectory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FilesDirectory_path_key" ON "FilesDirectory"("path");

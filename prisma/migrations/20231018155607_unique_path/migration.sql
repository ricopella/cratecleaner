/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `CrateSrc` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CrateSrc_path_key" ON "CrateSrc"("path");

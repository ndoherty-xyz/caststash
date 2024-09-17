-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerFid" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_casts" (
    "id" TEXT NOT NULL,
    "castHash" TEXT NOT NULL,
    "ownerFid" INTEGER NOT NULL,
    "collectionsId" TEXT NOT NULL,

    CONSTRAINT "saved_casts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "saved_casts" ADD CONSTRAINT "saved_casts_collectionsId_fkey" FOREIGN KEY ("collectionsId") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

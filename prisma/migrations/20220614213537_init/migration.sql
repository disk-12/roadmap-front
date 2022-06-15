-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history" (
    "id" SERIAL NOT NULL,
    "roadmapId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fav" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "roadmapId" INTEGER NOT NULL,

    CONSTRAINT "fav_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "node" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "video_from_sec" INTEGER,
    "video_to_sec" INTEGER,
    "roadmapId" INTEGER NOT NULL,

    CONSTRAINT "node_pkey" PRIMARY KEY ("id","roadmapId")
);

-- CreateTable
CREATE TABLE "arrow" (
    "id" SERIAL NOT NULL,
    "from_node" INTEGER NOT NULL,
    "to_node" INTEGER NOT NULL,
    "roadmapId" INTEGER NOT NULL,
    "dashed" BOOLEAN NOT NULL,

    CONSTRAINT "arrow_pkey" PRIMARY KEY ("id","roadmapId")
);

-- CreateTable
CREATE TABLE "visited" (
    "id" SERIAL NOT NULL,
    "historyId" INTEGER,
    "nodeId" INTEGER,
    "nodeRoadmapId" INTEGER,

    CONSTRAINT "visited_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fav" ADD CONSTRAINT "fav_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fav" ADD CONSTRAINT "fav_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap" ADD CONSTRAINT "roadmap_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "node" ADD CONSTRAINT "node_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arrow" ADD CONSTRAINT "arrow_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visited" ADD CONSTRAINT "visited_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "history"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visited" ADD CONSTRAINT "visited_nodeId_nodeRoadmapId_fkey" FOREIGN KEY ("nodeId", "nodeRoadmapId") REFERENCES "node"("id", "roadmapId") ON DELETE SET NULL ON UPDATE CASCADE;

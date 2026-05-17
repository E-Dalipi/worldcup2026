-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "homeTeamId" INTEGER,
    "awayTeamId" INTEGER,
    "homePlaceholder" TEXT,
    "awayPlaceholder" TEXT,
    "scoreHome" INTEGER,
    "scoreAway" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'scheduled',

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalEvent" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "playerName" TEXT NOT NULL,
    "minute" INTEGER NOT NULL,
    "minuteExtra" INTEGER,
    "assistName" TEXT,
    "goalType" TEXT NOT NULL DEFAULT 'goal',

    CONSTRAINT "GoalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Highlight" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "minute" INTEGER,
    "videoUrl" TEXT,
    "type" TEXT NOT NULL DEFAULT 'moment',

    CONSTRAINT "Highlight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_code_key" ON "Team"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Match_matchNumber_key" ON "Match"("matchNumber");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalEvent" ADD CONSTRAINT "GoalEvent_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalEvent" ADD CONSTRAINT "GoalEvent_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Highlight" ADD CONSTRAINT "Highlight_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

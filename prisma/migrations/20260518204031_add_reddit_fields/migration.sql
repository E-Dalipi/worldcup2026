-- AlterTable
ALTER TABLE "Highlight" ADD COLUMN     "redditUrl" TEXT,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'editorial',
ADD COLUMN     "subreddit" TEXT,
ADD COLUMN     "upvotes" INTEGER;

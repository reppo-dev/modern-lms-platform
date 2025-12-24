import db from "@/lib/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";

const f = createUploadthing();

type Metadata = {
  userId: string;
};

export const ourFileRouter = {
  mediUploader: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async ({ req }): Promise<Metadata> => {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      await db.upload.create({
        data: {
          key: file.key,
          url: file.url,
          name: file.name,
          size: file.size,
          type: file.type,
          userId: metadata.userId,
        },
      });
      return { key: file.key, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

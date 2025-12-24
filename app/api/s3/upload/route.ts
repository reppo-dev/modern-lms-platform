import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/S3Clint";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "Filename is request" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  siz: z.number().min(1, { message: "Size is required" }),
  isImage: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        {
          status: 400,
        }
      );
    }

    const { fileName, contentType, siz } = validation.data;

    const uniqueKey = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: siz,
    });

    const presignerdUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });

    const response = {
      presignerdUrl,
      key: uniqueKey,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
      }
    );
  }
}

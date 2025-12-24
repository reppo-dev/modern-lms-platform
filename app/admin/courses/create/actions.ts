"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { headers } from "next/headers";

export async function createCourse(
  values: CourseSchemaType
): Promise<ApiResponse> {
  try {
    const validation = courseSchema.safeParse(values);
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    const data = await db.course.create({
      data: { ...validation.data, userId: session?.user.id as string },
    });
    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}

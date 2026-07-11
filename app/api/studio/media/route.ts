import { isAdminRequest } from "@/lib/admin-auth";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const maxFileSize = 80 * 1024 * 1024;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function safeBaseName(fileName: string) {
  return path
    .basename(fileName, path.extname(fileName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64) || "media";
}

async function availableFilePath(directory: string, base: string, extension: string) {
  let index = 1;
  let fileName = `${base}${extension}`;

  while (true) {
    try {
      await fs.access(path.join(directory, fileName));
      index += 1;
      fileName = `${base}-${index}${extension}`;
    } catch {
      return fileName;
    }
  }
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    const body = (await request.json()) as HandleUploadBody;
    if (body.type === "blob.generate-client-token" && !(await isAdminRequest())) {
      return new NextResponse(null, { status: 401 });
    }
    try {
      const result = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname) => {
          if (!pathname.startsWith("studio/")) {
            throw new Error("Invalid media path.");
          }
          return {
            allowedContentTypes: ["image/*", "video/*"],
            addRandomSuffix: true,
            maximumSizeInBytes: 500 * 1024 * 1024,
          };
        },
        onUploadCompleted: async () => {},
      });
      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Upload failed." },
        { status: 400 }
      );
    }
  }

  if (!(await isAdminRequest())) {
    return new NextResponse(null, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const slug = String(formData.get("slug") ?? "").trim();

  if (!(file instanceof File) || !slugPattern.test(slug)) {
    return NextResponse.json({ error: "A valid file and slug are required." }, { status: 400 });
  }

  if (file.size > maxFileSize) {
    return NextResponse.json(
      { error: "Local media is limited to 80 MB. Use an external video embed for larger files." },
      { status: 413 }
    );
  }

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Only image and video files are supported." },
      { status: 415 }
    );
  }

  const extension = path.extname(file.name).toLowerCase() || (isImage ? ".png" : ".mp4");
  const directory = path.join(process.cwd(), "public", "media", slug);
  await fs.mkdir(directory, { recursive: true });

  const fileName = await availableFilePath(
    directory,
    safeBaseName(file.name),
    extension
  );
  const targetFile = path.join(directory, fileName);
  await fs.writeFile(targetFile, Buffer.from(await file.arrayBuffer()));

  const src = `/media/${slug}/${fileName}`;
  const embed = isImage
    ? `<Figure\n  src="${src}"\n  alt="${safeBaseName(file.name)}"\n  caption=""\n/>`
    : `<Video\n  src="${src}"\n  caption=""\n/>`;

  return NextResponse.json({ embed, src });
}

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function saveImageFile(file: File, folder = "custom-orders") {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;

  const absoluteFolder = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(absoluteFolder, { recursive: true });

  const absoluteFilePath = path.join(absoluteFolder, fileName);
  await writeFile(absoluteFilePath, buffer);

  return `/uploads/${folder}/${fileName}`;
}

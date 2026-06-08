import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // Read file as ArrayBuffer and convert to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique name
    const ext = path.extname(file.name) || ".png";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const targetPath = path.join(uploadsDir, filename);

    // Save file
    await writeFile(targetPath, buffer);

    const relativePath = `/uploads/${filename}`;
    return NextResponse.json({ filePath: relativePath }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/uploads]", error);
    return NextResponse.json(
      { message: "Gagal mengunggah file", error: String(error) },
      { status: 500 }
    );
  }
}

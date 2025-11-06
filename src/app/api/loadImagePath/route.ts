// // src/app/api/uploads/route.ts
// import fs from 'fs';
// import path from 'path';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(req: NextRequest) {
//   const url = new URL(req.url);
//   const rawPath = url.searchParams.get('imagePath');

//   if (!rawPath) {
//     return NextResponse.json({ error: 'File path is required' }, { status: 400 });
//   }

//   // Normalize slashes
//   let filePath = rawPath.replace(/\\/g, '/');

//   // Only allow access to 'uploads' or 'certificates' folders
//   const validRoots = ['uploads', 'certificates'];
//   const matchingRoot = validRoots.find(root => filePath.startsWith(`/${root}/`));

//   if (!matchingRoot) {
//     return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
//   }

//   // Remove leading slash and form absolute path
//   const relativePath = filePath.slice(1); // remove leading slash
//   const absolutePath = path.join(process.cwd(), relativePath);

//   // Prevent path traversal (security check)
//   const normalized = path.normalize(absolutePath);
//   const baseDir = path.join(process.cwd(), matchingRoot);
//   if (!normalized.startsWith(baseDir)) {
//     return NextResponse.json({ error: 'Access denied' }, { status: 403 });
//   }

//   // Check file exists
//   if (!fs.existsSync(normalized)) {
//     return NextResponse.json({ error: 'File not found' }, { status: 404 });
//   }

//   // Detect MIME type
//   const ext = path.extname(normalized).toLowerCase();
//   const mimeTypes: Record<string, string> = {
//     '.jpg': 'image/jpeg',
//     '.jpeg': 'image/jpeg',
//     '.png': 'image/png',
//     '.webp': 'image/webp',
//     '.gif': 'image/gif',
//     '.pdf': 'application/pdf',
//     '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     '.doc': 'application/msword',
//     '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     '.xls': 'application/vnd.ms-excel',
//     '.csv': 'text/csv',
//     '.txt': 'text/plain',
//   };

//   const contentType = mimeTypes[ext] || 'application/octet-stream';

//   const fileBuffer = fs.readFileSync(normalized);
//   return new NextResponse(fileBuffer, {
//     status: 200,
//     headers: {
//       'Content-Type': contentType,
//       'Content-Disposition': `inline; filename="${path.basename(normalized)}"`,
//     },
//   });
// }


// src/app/api/uploads/route.ts
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const rawPath = url.searchParams.get('imagePath');

  if (!rawPath) {
    return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
  }

  // Normalize path
  let imagePath = rawPath.replace(/\\/g, '/'); // Normalize Windows slashes

let baseFolder = '';
let relativePath = '';

// Detect which root folder to use
if (imagePath.includes('/uploads/')) {
  baseFolder = 'uploads';
  relativePath = imagePath.split('/uploads/')[1];
} else if (imagePath.includes('/certificates/')) {
  baseFolder = 'certificates';
  relativePath = imagePath.split('/certificates/')[1];
} else {
  return NextResponse.json({ error: 'Invalid image path' }, { status: 400 });
}

// Reconstruct the absolute file path
const filePath = path.join(process.cwd(), baseFolder, relativePath);
console.log('Resolved file path:', filePath);

if (!fs.existsSync(filePath)) {
  return NextResponse.json({ error: 'Image not found' }, { status: 404 });
}
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.doc': 'application/msword',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls': 'application/vnd.ms-excel',
    '.csv': 'text/csv',
    '.txt': 'text/plain',
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';

  const fileBuffer = fs.readFileSync(filePath);
  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${path.basename(filePath)}"`,

    },
  });
}

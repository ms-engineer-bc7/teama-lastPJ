import { NextResponse } from "next/server";

const DJANGO_USER_API_URL = "http://backend:8000/api/users/";

interface Params {
  id: string;
}

// 特定のIDのユーザーを取得
export async function GET(req: Request, { params }: { params: Params }) {
  // トークンを抽出
  const accessToken = req.headers.get('Authorization')?.split('Bearer ')[1];

  const { id } = params;
  return await fetch(`${DJANGO_USER_API_URL}${id}/`, {
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${accessToken}`,
    },

  });
}

// 特定のIDのユーザーを更新
export async function PUT(req: Request, { params }: { params: Params }) {
  const { id } = params;
  const body = await req.json();
  return await fetch(`${DJANGO_USER_API_URL}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

// 特定のIDのユーザーを削除
export async function DELETE(req: Request, { params }: { params: Params }) {
  const { id } = params;
  const res = await fetch(`${DJANGO_USER_API_URL}${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error(`Django API Error: ${res.status} ${res.statusText}`);
    console.error(`Response body: ${await res.text()}`);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "User deleted" });
}

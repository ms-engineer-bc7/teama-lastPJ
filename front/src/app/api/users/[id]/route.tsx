import { NextResponse } from "next/server";

const DJANGO_USER_API_URL = "http://backend:8000/api/users/";

interface Params {
  id: string;
}

// 特定のIDのユーザーを取得
export async function GET(req: Request, { params }: { params: Params }) {
  const { id } = params;
  const res = await fetch(`${DJANGO_USER_API_URL}${id}/`);

  if (!res.ok) {
    console.error(`Django API Error: ${res.status} ${res.statusText}`);
    console.error(`Response body: ${await res.text()}`);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }

  const user = await res.json();
  return NextResponse.json(user);
}

// 特定のIDのユーザーを更新
export async function PUT(req: Request, { params }: { params: Params }) {
  const { id } = params;
  const body = await req.json();
  const res = await fetch(`${DJANGO_USER_API_URL}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error(`Django API Error: ${res.status} ${res.statusText}`);
    console.error(`Response body: ${await res.text()}`);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }

  const updatedUser = await res.json();
  return NextResponse.json(updatedUser);
}

// 特定のIDのユーザーを削除
export async function DELETE(req: Request, { params }: { params: Params }) {
  const { id } = params;
  const res = await fetch(`${DJANGO_USER_API_URL}${id}/`, {
    method: "DELETE",
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

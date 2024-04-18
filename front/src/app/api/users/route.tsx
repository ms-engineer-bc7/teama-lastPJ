import { NextRequest, NextResponse } from "next/server";
const DJANGO_USER_API_URL = "http://backend:8000/api/users/";

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(DJANGO_USER_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Django API Error: ${res.status} ${res.statusText}`);
      console.error(`Response body: ${await res.text()}`);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    const users = await res.json();
    console.log(users);
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await req.json();
  return await fetch(DJANGO_USER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}

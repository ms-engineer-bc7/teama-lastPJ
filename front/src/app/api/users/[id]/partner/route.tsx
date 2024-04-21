import { NextResponse } from "next/server";
import { User } from "../../../../../../@type";

const DJANGO_USER_API_URL = "http://backend:8000/api/users/";

interface Params {
  id: string;
}

// 特定のIDのユーザーのパートナーメールと一致した情報を返したい。
export async function PUT(req: Request, { params }: { params: Params }) {
  const { id } = params;

  const body = await req.json()

  // ユーザー情報を取得し、一致するメールを確認する
  const res = await fetch(`${DJANGO_USER_API_URL}`)

  const users = await res.json()

  const partners = users.filter((u: User) => u.email == body.partner_email && u.role == 'partner')
  if (partners.length == 0) {
    return NextResponse.json(
      { error: "Failed to match partner email." },
      { status: 404 }
    );
  }
  console.log(partners)
  const reqBody = {
    "id": body.user.id,
    "uid": body.user.uid,
    "name": body.user.name,
    "email": body.user.email,
    "role": body.user.role,
    "partner": partners[0].id,
  }
  console.log(reqBody)
  // 更新処理
  return await fetch(`${DJANGO_USER_API_URL}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });

}

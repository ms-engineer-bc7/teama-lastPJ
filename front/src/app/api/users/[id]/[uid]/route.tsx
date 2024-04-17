import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

const DJANGO_USER_API_URL = "http://backend:8000/api/users/";

// APIハンドラ関数　リクエストの query パラメータから
// uid を取得し、Authorization ヘッダーからトークンを抜き出す
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, uid } = req.query; // URLからidとuidを抽出

  const token = req.headers.authorization?.split(" ")[1];
  try {
    const djangoResponse = await fetch(
      `http://backend:8000/api/users/${id}/${uid}/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!djangoResponse.ok) {
      throw new Error("Failed to fetch from Django");
    }

    const userData = await djangoResponse.json();
    res.status(200).json(userData);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

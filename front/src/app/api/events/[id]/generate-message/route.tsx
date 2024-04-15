import { NextResponse } from "next/server";

const DJANGO_API_URL = "http://backend:8000/api/events/";

interface Params {
  id: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    console.log(`Fetching message for event ID: ${id}`);

    // Django APIにGETリクエストを送信し、レスポンスを待つ
    const res = await fetch(`${DJANGO_API_URL}${id}/generate_message/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(`Django API Error: ${res.status} ${res.statusText}`);
      console.error(`Response body: ${await res.text()}`);
      return NextResponse.json(
        { error: "Failed to generate message" },
        { status: 500 }
      );
    }

    const message = await res.json(); // レスポンスのJSONを解析してmessageを取得
    console.log("Message generated successfully");
    console.log(message); // 取得したデータをログに出す
    // 取得したメッセージデータをJSONレスポンスとしてクライアントに送信
    return NextResponse.json(message);
  } catch (error) {
    console.error("Error generating message:", error);
    return NextResponse.json(
      { error: "Failed to generate message" },
      { status: 500 }
    );
  }
}

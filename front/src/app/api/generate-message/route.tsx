import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL = "http://backend:8000/api/events/";

// 非同期関数GETをエクスポートし、NextRequestオブジェクトを引数に取る
export async function GET(req: NextRequest) {
  //   try {
  //     const { searchParams } = new URL(req.url);　// req.urlを使ってURLオブジェクトを生成
  //     const eventId = searchParams.get("eventId");　// URLのクエリパラメータからeventIdを取得
  //     console.log(`Request URL: ${req.url}`);　// リクエストのURLをログ出力
  //     console.log(`Search Params:`, searchParams.toString());　// URLのクエリパラメータをしてログ出力

  //     if (!eventId) {
  //       console.error("Event ID is missing");
  //       return NextResponse.json(
  //         { error: "Event ID is missing" },
  //         { status: 400 }
  //       );
  //     }

  //     console.log(`Fetching message for event ID: ${eventId}`);
  try {
    const eventId = 2; //IDがうまく取得できず固定
    console.log(`Fetching message for event ID: ${eventId}`);
    // Django APIにGETリクエストを送信し、レスポンスを待つ
    const res = await fetch(`${DJANGO_API_URL}${eventId}/generate_message/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`Django API response status: ${res.status}`);

    if (!res.ok) {
      console.error(`Django API Error: ${res.status} ${res.statusText}`);
      console.error(`Response body: ${await res.text()}`);
      return NextResponse.json(
        { error: "Failed to generate message" },
        { status: 500 }
      );
    }

    const data = await res.json(); // レスポンスのJSONを解析してデータを取得
    console.log("Message generated successfully");
    console.log(data); // 取得したデータをログに出す

    // 取得したメッセージデータをJSONレスポンスとしてクライアントに送信
    return NextResponse.json({ message: data.message });
  } catch (error) {
    console.error("Error generating message:", error);
    return NextResponse.json(
      { error: "Failed to generate message" },
      { status: 500 }
    );
  }
}

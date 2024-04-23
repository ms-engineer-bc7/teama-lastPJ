import { Anybody } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL = "http://backend:8000/api/events/";

export async function GET(req: NextRequest) {
  try {
    console.log("Fetching events from Django API...");
    // トークンを抽出
    const accessToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    console.log("Sending accessToken:", accessToken); // 送信するトークンのログ出力

    const res = await fetch(DJANGO_API_URL, {
      method: "GET",
      // headers: req.headers,
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`
      },
    });

    console.log(`Django API response status: ${res.status}`);

    if (!res.ok) {
      console.error(`Django API Error: ${res.status} ${res.statusText}`);
      console.error(`Response body: ${await res.text()}`);
      return NextResponse.json(
        { error: "Failed to fetch events" },
        { status: 500 }
      );
    }

    const events = await res.json();
    console.log("Events fetched successfully");
    console.log(events);
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    const res = await fetch(DJANGO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!res.ok) {
      console.error(`Django API Error: ${res.status} ${res.statusText}`);
      console.error(`Response body: ${await res.text()}`);
      return NextResponse.json(
        { error: "Failed to create event" },
        { status: 500 }
      );
    }

    console.log("Event created successfully");
    console.log(event);
    return NextResponse.json({ message: "Event created" });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

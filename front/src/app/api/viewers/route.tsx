import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL = "http://backend:8000/api/viewers/";

export async function GET(req: NextRequest) {
  try {
    console.log("Fetching viewer data from Django API...");
    const res = await fetch(DJANGO_API_URL, {
      method: "GET",
    //   headers: req.headers, //この記述のみじゃGETできない↓の形式で！
      headers: {
        'Accept': 'application/json', // JSONレスポンスを要求
        ...req.headers,
      },
    });

    console.log(`Django API response status: ${res.status}`);

    if (!res.ok) {
      console.error(`Django API Error: ${res.status} ${res.statusText}`);
      console.error(`Response body: ${await res.text()}`);
      return NextResponse.json(
        { error: "Failed to fetch viewer data" },
        { status: 500 }
      );
    }

    const viewerData = await res.json();
    console.log("Viewer data fetched successfully");
    console.log(viewerData);
    return NextResponse.json(viewerData);
  } catch (error) {
    console.error("Error fetching viewer data:", error);
    return NextResponse.json(
      { error: "Failed to fetch viewer data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const viewerData = await req.json();
    const { event_id, allowed_email } = viewerData;
    const res = await fetch(DJANGO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: event_id,
        allowed_email: allowed_email,
      }),
    });

    if (!res.ok) {
      console.error(`Django API Error: ${res.status} ${res.statusText}`);
      console.error(`Response body: ${await res.text()}`);
      return NextResponse.json(
        { error: "Failed to create viewer" },
        { status: 500 }
      );
    }

    console.log("Viewer created successfully");
    console.log(viewerData);
    return NextResponse.json({ message: "Viewer created" });
  } catch (error) {
    console.error("Error creating viewer:", error);
    return NextResponse.json(
      { error: "Failed to create viewer" },
      { status: 500 }
    );
  }
}

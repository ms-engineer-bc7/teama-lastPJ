import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL = "http://backend:8000/api/events/";

export async function GET(req: NextRequest) {
  //   try {
  //     const { searchParams } = new URL(req.url);
  //     const eventId = searchParams.get("eventId");
  //     console.log(`Request URL: ${req.url}`);
  //     console.log(`Search Params:`, searchParams.toString());

  //     if (!eventId) {
  //       console.error("Event ID is missing");
  //       return NextResponse.json(
  //         { error: "Event ID is missing" },
  //         { status: 400 }
  //       );
  //     }

  //     console.log(`Fetching message for event ID: ${eventId}`);
  try {
    const eventId = 2;
    console.log(`Fetching message for event ID: ${eventId}`);
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

    const data = await res.json();
    console.log("Message generated successfully");
    console.log(data);

    return NextResponse.json({ message: data.message });
  } catch (error) {
    console.error("Error generating message:", error);
    return NextResponse.json(
      { error: "Failed to generate message" },
      { status: 500 }
    );
  }
}

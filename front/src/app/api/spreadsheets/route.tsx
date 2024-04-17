import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL = "http://backend:8000/api/spreadsheets/";

export async function GET(req: NextRequest) {
    try {
        console.log("Fetching events from Django API...");
        const res = await fetch(DJANGO_API_URL, {
            method: "GET",
            headers: req.headers,
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

        const spreadsheets = await res.json();
        console.log("Spreadsheets fetched successfully");
        return NextResponse.json(spreadsheets);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const data = await req.json();
    return await fetch(DJANGO_API_URL, {
        method: "POST",
        headers: req.headers,
        body: JSON.stringify(data),
    });
}

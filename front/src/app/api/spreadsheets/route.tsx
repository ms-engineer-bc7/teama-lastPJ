import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL = "http://backend:8000/api/spreadsheets/";

export async function GET(req: NextRequest) {
    try {
        console.log("Fetching events from Django API...");
        // トークンを抽出
        const accessToken = req.headers.get('Authorization')?.split('Bearer ')[1];

        const res = await fetch(DJANGO_API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
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
    // トークンを抽出
    const accessToken = req.headers.get('Authorization')?.split('Bearer ')[1];

    const data = await req.json();
    return await fetch(DJANGO_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
    });
}

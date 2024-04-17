import { NextRequest, NextResponse } from "next/server";

const DJANGO_API_URL = "http://backend:8000/api/spreadsheets/";

export async function GET(req: NextRequest) {
    try {
        await setTimeout(() => {
            console.log("Delayed for 1 second.");
        }, 10000)
        console.log("Fetching events from Django API...");
        const res = await fetch(DJANGO_API_URL + "?user=" + req.nextUrl.searchParams.get('user'), {
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
    try {
        const event = await req.json();
        const res = await fetch(DJANGO_API_URL + "?user=" + req.nextUrl.searchParams.get('user'), {
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

        const spreadsheets = await res.json();
        console.log("Spreadsheets created successfully");
        return NextResponse.json(spreadsheets);
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { error: "Failed to create event" },
            { status: 500 }
        );
    }
}

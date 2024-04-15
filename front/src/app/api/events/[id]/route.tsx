import { NextResponse } from "next/server";

const DJANGO_API_URL = "http://backend:8000/api/events/";

interface Params {
  id: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  const { id } = params;
  const res = await fetch(`${DJANGO_API_URL}${id}/`);
  const event = await res.json();
  return NextResponse.json(event);
}

export async function PUT(req: Request, { params }: { params: Params }) {
  const { id } = params;
  const body = await req.json();
  const res = await fetch(`${DJANGO_API_URL}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const updatedEvent = await res.json();
  return NextResponse.json(updatedEvent);
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { id } = params;
  const res = await fetch(`${DJANGO_API_URL}${id}/`, {
    method: "DELETE",
  });
  return NextResponse.json({ message: "Event deleted" });
}

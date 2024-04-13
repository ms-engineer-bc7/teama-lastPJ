import { EventInput } from "@fullcalendar/core";
import Calendar from "./calendar/page";

// get fetch
export async function getFetchData(): Promise<EventInput[]> {
  try {
    const response = await fetch("/api/events", {
      method: "GET",
    });
    const data = await response.json();

    const events: EventInput[] = data.map((e: any) => ({
      title: e.title,
      start: e.start_date,
      end: e.end_date,
    }));

    return events;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// post fetch
export async function postFetchData(
  title: string,
  start_date: string,
  end_date: string,
  user: number
): Promise<{ data?: typeof Calendar; error?: string }> {
  try {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        start_date,
        end_date,
        user,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error("Failed to post event data.");
    }
    return { data };
  } catch (error) {
    if (error instanceof Error) {
      console.error("POST request failed:", error);
      return { error: error.message };
    }
    return { error: "POSTができませんでした" };
  }
}

import { EventInput } from "@fullcalendar/core";
import Calendar from "./calendar/page";

// get fetch
export async function getFetchData(): Promise<EventInput[]> {
  try {
    const response = await fetch("/api/events", {
      method: "GET",
    });
    // console.log("GETレスポンス:", response);
    const data = await response.json();
    // console.log("dataの値:", data);

    const events: EventInput[] = data.map((e: any) => ({
      id: e.id,
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

// delete fetch
export async function deleteFetchData(
  id: number
): Promise<{ success?: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch(`/api/events/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("DELETEのresponse:", response);

    const data = await response.json();
    console.log("DELETEのdata:", data);

    if (!response.ok) {
      const data = await response.json();
      console.log("DELETEのdata:", data);
      throw new Error(
        data.message ||
          "イベントの削除に失敗しました。サーバーから不正なレスポンスが返されています。"
      );
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error("DELETEリクエストに失敗しました:", error);
      return { error: error.message };
    }
    return { error: "DELETEに失敗しました" };
  }
}

// put fetch
export async function putFetchData(
  id: number,
  updatedData: any
): Promise<{ success?: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    console.log("PUTのresponse:", response);
    const data = await response.json();
    console.log("PUTのdata:", data);

    if (!response.ok) {
      throw new Error(
        data.message ||
          "イベントの更新に失敗しました。サーバーから不正なレスポンスが返されています。"
      );
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error("PUTリクエストに失敗しました:", error);
      return { error: error.message };
    }
    return { error: "PUTに失敗しました" };
  }
}

import { EventInput } from "@fullcalendar/core";
import Calendar from "./calendar/page";
// import axios from "axios";
// import { useRouter } from "next/navigation";

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

    // const data = await response.json();
    // console.log("DELETEのdata:", data);
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      console.error("DELETEリクエストに失敗しました:", error);
      return { error: error.message };
    }
    return { error: "DELETEに失敗しました" };
  }
}

// const deleteFetchData = async () => {
//   const router = useRouter();
//   try {
//     const response: any = await axios.delete(`/api/events/${id}`);
//     console.log("削除が成功しました:", response.data);
//     router.push("/");
//   } catch (error) {
//     console.error("削除中にエラーが発生しました:", error);
//   }
// };
// export default deleteFetchData;

// export async function deleteFetchData(
//   id: number
// ): Promise<{ success?: boolean; error?: string }> {
//   try {
//     const response = await fetch(`/api/events/${id}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to delete event data.");
//     }

//     return { success: true };
//   } catch (error) {
//     if (error instanceof Error) {
//       console.error("DELETE request failed:", error);
//       return { error: error.message };
//     }
//     return { error: "DELETEができませんでした" };
//   }
// }

// async function deleteEvent(id: number) {
//   try {
//     const response = await fetch(`/api/events/${id}`, {
//       method: "DELETE",
//     });
//     const result = await response.json();
//     if (response.ok) {
//       console.log("削除成功:", result);
//       // ここでフロントエンドの状態を更新
//       removeEventFromState(id);
//     } else {
//       throw new Error(result.message);
//     }
//   } catch (error) {
//     console.error("削除エラー:", error);
//   }
// }

// function removeEventFromState(id: number) {
//   setEvents((currentEvents: any) =>
//     currentEvents.filter((event: any) => event.id !== id)
//   );
// }

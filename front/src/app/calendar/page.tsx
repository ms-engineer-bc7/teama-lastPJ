"use client";
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // 月表示
import interactionPlugin, {
  DateClickArg,
  // EventClickArg, clickInfoでエラー
} from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import { EventContentArg } from "@fullcalendar/common";
import Modal from "../_components/Modal";
import { getFetchData, postFetchData } from "../fetch";
import { EventInfo } from "../types";

let eventGuid = 0;

export default function Calendar() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [modalEventTitle, setModalEventTitle] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [selectedTime, setSelectedTime] = useState("00:00");

  // get fetch
  useEffect(() => {
    async function fetchData() {
      const events = await getFetchData();
      setEvents(events);
    }
    fetchData();
  }, []);

  // ユーザーが日付(マス)をクリックしたらモーダルが開き、それぞれの項目の入力できる
  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    // ログ
    console.log("イベント", event);
    console.log("イベントタイトル", event.title);
    console.log("開始日", event.startStr);
    console.log("終了日", event.endStr);

    // ユーザーが入力できる項目(タイトル、開始日、終了日)
    setModalEventTitle(event.title);
    setStartDateTime(event.startStr);
    setEndDateTime(event.endStr);
    setIsModalOpen(true);
  };

  // カレンダーの日付(マス)をクリックしたときの処理
  const handleDateClick = (clickInfo: DateClickArg) => {
    console.log("handleDateClick 実行確認");

    // モーダルの情報を次回の入力で保持しないために、タイトル、開始日、終了日を初期化
    setModalEventTitle("");
    setStartDateTime("");
    setEndDateTime("");

    // 日付フォーマット修正
    const formattedDate = `${clickInfo.dateStr}T${selectedTime}`;
    console.log("日付の取得確認", formattedDate);
    setSelectedDate(formattedDate);
    setIsModalOpen(true);
  };

  // カレンダーに新しいイベントを追加する関数
  const submitEvent = async (
    eventTitle: string,
    startDate: string,
    endDate: string
  ) => {
    const eventId = createEventId();
    const newEvent = {
      id: eventId,
      title: eventTitle,
      start: startDate,
      end: endDate,
      color: "blue",
    };

    // POST fetch
    try {
      // POST処理を実行し結果を取得
      const result = await postFetchData(eventTitle, startDate, endDate, 1);
      if (!result.error) {
        // POST処理が成功したら、カレンダーにイベントを追加する
        const newEvents = [...events, newEvent];
        console.log("POST成功時のレスポンス", newEvents);
        setEvents(newEvents);
        setEventTitle("");
        setSelectedDate("");
        setIsModalOpen(false);
      } else {
        console.error("データの送信でエラーが発生しました:", result.error);
      }
    } catch (error) {
      console.error("データの送信でエラーが発生しました:", error);
    }
  };

  // 予定のIDを生成
  const createEventId = () => {
    return `event-${eventGuid++}`; // 予定のIDを生成
  };

  // モーダル閉じたときの処理
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // カレンダーのイベント表示をカスタマイズする関数
  const renderEventContent = (eventInfo: EventContentArg) => {
    return (
      <>
        <b>{eventInfo.event.title}</b>
      </>
    );
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        selectable={true}
        dayMaxEvents={true}
        businessHours={{ daysOfWeek: [1, 2, 3, 4, 5] }}
        dayCellContent={(e) => {
          let dayNumber = parseInt(e.dayNumberText, 10);
          return { html: dayNumber.toString() };
        }}
        locale="ja"
        firstDay={1}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        contentHeight={700}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={submitEvent}
        submitEvent={submitEvent}
        event={{
          title: modalEventTitle,
          start: startDateTime,
          end: endDateTime,
        }}
      />
    </>
  );
}

// 書き換え前
// "use client";
// import React, { useState, useEffect } from "react";
// import { EventInput, EventClickArg } from "@fullcalendar/core";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid"; // 月表示
// import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
// import ReactDOM from "react-dom";

// let eventGuid = 0;

// export default function Calendar() {
//   const [events, setEvents] = useState<EventInput[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [eventTitle, setEventTitle] = useState("");
//   const [selectedEndDate, setSelectedEndDate] = useState("");
//   const [modalEventTitle, setModalEventTitle] = useState("");
//   const [startDateTime, setStartDateTime] = useState("");
//   const [endDateTime, setEndDateTime] = useState("");
//   const [selectedTime, setSelectedTime] = useState("00:00");

//   // 新しいイベントをカレンダーに追加
//   const addEvent = (id: string, title: string, date: string) => {
//     const newEvents: EventInput[] = [
//       ...events,
//       { id, title, date, color: "blue" },
//     ];
//     setEvents(newEvents);
//   };

//   // イベント削除
//   // const removeEvent = (id: string) => {
//   //   const newEvents: EventInput[] = events.filter((event) => event.id !== id);
//   //   setEvents(newEvents);
//   // };

//   // ---------- GET fetch ----------
//   useEffect(() => {
//     async function getFetchData(): Promise<Date[]> {
//       try {
//         const response = await fetch("/api/events", {
//           method: "GET",
//         });
//         console.log("GETのresponse", response);
//         if (!response.ok) {
//           throw new Error("Could not fetch resource");
//         }
//         const data = await response.json();
//         console.log("GETのdata", data);

//         const events: EventInput[] = [];
//         data.forEach((e: any) => {
//           events.push({
//             title: e.title,
//             start: e.start_date,
//             end: e.end_date,
//           });
//         });

//         setEvents(events);

//         return data as Date[];
//       } catch (error) {
//         console.error(error);
//         return [];
//       }
//     }
//     getFetchData();
//   }, []);

//   async function postFetchData(
//     title: string,
//     start_date: string,
//     end_date: string,
//     user: number
//   ): Promise<{ data?: Calendar; error?: string }> {
//     try {
//       const response = await fetch("/api/events", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title,
//           start_date,
//           end_date,
//           user,
//         }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error("Failed to post event data.");
//       }
//       return { data };
//     } catch (error) {
//       console.error("POST request failed:", error);
//       return { error: error.message };
//     }
//   }

//   // 日付
//   function formatDate(originalDateTime: string) {
//     const convertedDateTime = originalDateTime.substring(0, 16); // "YYYY-MM-DDTHH:mm" の形式に切り取る
//     console.log(convertedDateTime);
//     return convertedDateTime;
//   }

//   // ユーザーが日付(マス)をクリックしたら起こる処理
//   const handleEventClick = (clickInfo: EventClickArg) => {
//     const event = clickInfo.event;
//     // ログ
//     console.log("イベント", event);
//     console.log("イベントタイトル", event.title);
//     console.log("開始日", event.startStr);
//     console.log("終了日", event.endStr);

//     // クリックされた予定の詳細情報をセット
//     setModalEventTitle(event.title);
//     setStartDateTime(event.startStr);
//     setEndDateTime(event.endStr);
//     // モーダルを開く
//     setIsModalOpen(true);
//   };

//   // 予定のIDを生成
//   const createEventId = () => {
//     return `event-${eventGuid++}`;
//   };

//   // カレンダーの日付(マス)をクリックしたときの処理
//   const handleDateClick = (clickInfo: DateClickArg) => {
//     console.log("handleDateClickログ");
//     // タイトル、開始日、終了日 初期化
//     setModalEventTitle("");
//     setStartDateTime("");
//     setEndDateTime("");

//     // 正しい日付フォーマットに修正  ここを追加
//     const formattedDate = `${clickInfo.dateStr}T${selectedTime}`; // 日付と時間を結合
//     console.log("日付の取得確認", formattedDate);
//     setSelectedDate(formattedDate);
//     setIsModalOpen(true);
//   };

//   // モーダル閉じたときの処理
//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   // モーダルに入力する内容
//   const submitEvent = async (
//     eventTitle: string,
//     startDate: string,
//     endDate: string
//   ) => {
//     const eventId = createEventId();
//     const newEvent = {
//       id: eventId,
//       title: eventTitle,
//       start: startDate,
//       end: endDate,
//       color: "blue",
//     };

//     try {
//       // POST処理を実行し結果を取得
//       const result = await postFetchData(eventTitle, startDate, endDate, 1);
//       if (!result.error) {
//         // POST処理が成功したら、カレンダーにイベントを追加する
//         const newEvents = [...events, newEvent];
//         setEvents(newEvents);
//         setEventTitle("");
//         setSelectedDate("");
//         setIsModalOpen(false);
//       } else {
//         console.error("データの送信でエラーが発生しました:", result.error);
//       }
//     } catch (error) {
//       console.error("データの送信でエラーが発生しました:", error);
//     }
//   };

//   // 予定をクリックしたら詳細モーダル表示
//   const renderEventContent = (eventInfo) => {
//     return (
//       <>
//         <b>{eventInfo.event.title}</b>
//       </>
//     );
//   };

//   // ---------- モーダル ----------
//   const Modal = ({ isOpen, onClose, onConfirm, event }: any) => {
//     const [modalEventTitle, setModalEventTitle] = useState(""); // イベントタイトルのステート
//     const [startDateTime, setStartDateTime] = useState(""); // 開始日時のステート
//     const [endDateTime, setEndDateTime] = useState(""); // 終了日時のステート

//     const wrapSetStartDatetime = (a: string) => {
//       setStartDateTime(a);
//       console.log(startDateTime);
//     };

//     useEffect(() => {
//       if (isOpen && event) {
//         setModalEventTitle(event.title);
//         setStartDateTime(formatDate(event.start));
//         setEndDateTime(formatDate(event.end));

//         console.log("event.startの値", event.start);
//         console.log("event.endの値", event.end);
//         // 背景をスクロールできないようにする
//         document.body.style.overflow = "hidden";
//       } else {
//         // モーダルが閉じられるときに背景のスクロール制限を解除する
//         document.body.style.overflow = "auto";
//       }
//     }, [isOpen, event]);

//     const handleModalClick = (
//       e: React.MouseEvent<HTMLDivElement, MouseEvent>
//     ) => {
//       // モーダルの背景がクリックされたときに閉じる
//       if (e.target === e.currentTarget) {
//         onClose();
//       }
//     };

//     if (!isOpen) return null;

//     const handleConfirm = () => {
//       // 新しいイベントオブジェクトを作成して渡す
//       const newEvent = {
//         title: modalEventTitle,
//         start: startDateTime,
//         end: endDateTime,
//       };
//       onConfirm(newEvent);
//     };

//     const handleClose = () => {
//       onClose();
//     };

//     // POST fetch
//     const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
//       e.preventDefault();
//       const handleData = await postFetchData(
//         modalEventTitle,
//         startDateTime,
//         endDateTime,
//         1
//       );
//       console.log("データ", handleData);
//     };

// return ReactDOM.createPortal(
//   <div className="modal" onClick={handleModalClick}>
//     <div className="modal-content">
//       <h2 className="text-lg font-bold mb-4">イベントを追加</h2>
//       <label htmlFor="event-title" className="mb-2">
//         イベントのタイトル:
//       </label>
//       <input
//         id="event-title"
//         type="text"
//         value={modalEventTitle}
//         onChange={(e) => setModalEventTitle(e.target.value)}
//         className="border rounded px-3 py-2 mb-4 w-full"
//         maxLength={50}
//       />
//       <label htmlFor="start-date" className="mb-2">
//         開始日時:
//       </label>
//       <input
//         id="start-date"
//         type="datetime-local"
//         value={startDateTime}
//         onChange={(e) => wrapSetStartDatetime(e.target.value)}
//         className="border rounded px-3 py-2 mb-4 w-full"
//       />
//       <label htmlFor="end-date" className="mb-2">
//         終了日時:
//       </label>
//       <input
//         id="end-date"
//         type="datetime-local"
//         value={endDateTime}
//         onChange={(e) => setEndDateTime(e.target.value)}
//         className="border rounded px-3 py-2 mb-4 w-full"
//       />
//       <div className="flex justify-end">
//         <button
//           onClick={async () => {
//             await submitEvent(modalEventTitle, startDateTime, endDateTime);
//           }}
//           className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
//         >
//           保存
//         </button>
//         <button
//           onClick={handleClose}
//           className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
//         >
//           閉じる
//         </button>
//       </div>
//     </div>
//   </div>,
//   document.body
// );
// };

//   return (
//     <>
//       <div id="calendar" className="m-10">
//         <FullCalendar
//           plugins={[dayGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           events={events}
//           selectable={true}
//           dayMaxEvents={true}
//           businessHours={{ daysOfWeek: [1, 2, 3, 4, 5] }}
//           dayCellContent={(e) => {
//             let dayNumber = parseInt(e.dayNumberText, 10);
//             return { html: dayNumber.toString() };
//           }}
//           locale="ja"
//           firstDay={1}
//           dateClick={handleDateClick}
//           eventClick={handleEventClick}
//           eventContent={renderEventContent}
//           contentHeight={700}
//         />
//         <Modal
//           isOpen={isModalOpen}
//           onClose={closeModal}
//           onConfirm={submitEvent}
//           event={{
//             title: modalEventTitle,
//             start: startDateTime,
//             end: endDateTime,
//           }}
//         />
//       </div>
//     </>
//   );
// }

// サーバーサイドで処理する
// route.ts post
// GET サーバーサイドで page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { EventInput, EventClickArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import ReactDOM from "react-dom";

let eventGuid = 0;

export default function Calendar() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [modalEventTitle, setModalEventTitle] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  // 新しいイベントをカレンダーに追加
  const addEvent = (id: string, title: string, date: string) => {
    const newEvents: EventInput[] = [
      ...events,
      { id, title, date, color: "blue" },
    ];
    setEvents(newEvents);
  };

  // イベント削除
  // const removeEvent = (id: string) => {
  //   const newEvents: EventInput[] = events.filter((event) => event.id !== id);
  //   setEvents(newEvents);
  // };

  // 予定をクリックしたときに詳細をモーダルで表示する
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    // クリックされた予定の詳細情報をセット
    setModalEventTitle(event.title);
    setStartDateTime(event.startStr);
    setEndDateTime(event.endStr);
    // モーダルを開く
    setIsModalOpen(true);
  };

  // 予定のIDを生成
  const createEventId = () => {
    return `event-${eventGuid++}`;
  };

  // カレンダーの日付をクリックしたときの処理
  const handleDateClick = (clickInfo: DateClickArg) => {
    setSelectedDate(clickInfo.dateStr);
    setIsModalOpen(true);
  };

  // モーダル閉じたときの処理
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // モーダルに入力する内容
  const submitEvent = (
    eventTitle: string,
    startDate: string,
    endDate: string
  ) => {
    const eventId = createEventId();
    const newEvent = {
      id: eventId,
      title: eventTitle,
      start: startDate, // 開始時間を追加
      end: endDate, // 終了時間を追加
      color: "blue",
    };
    const newEvents = [...events, newEvent];
    setEvents(newEvents);
    setEventTitle("");
    setSelectedDate("");
    setIsModalOpen(false);
  };

  // ---------- モーダル ----------
  const Modal = ({ isOpen, onClose, onConfirm, event }: any) => {
    const [modalEventTitle, setModalEventTitle] = useState(""); // イベントタイトルのステート
    const [startDateTime, setStartDateTime] = useState(""); // 開始日時のステート
    const [endDateTime, setEndDateTime] = useState(""); // 終了日時のステート

    useEffect(() => {
      // モーダルが開かれるたびにイベント情報をリセットする
      if (isOpen) {
        setModalEventTitle("");
        setStartDateTime("");
        setEndDateTime("");
        // 背景をスクロールできないようにする
        document.body.style.overflow = "hidden";
      } else {
        // モーダルが閉じられるときに背景のスクロール制限を解除する
        document.body.style.overflow = "auto";
      }
    }, [isOpen]);

    const handleModalClick = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      // モーダルの背景がクリックされたときに閉じる
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    if (!isOpen) return null;

    const handleConfirm = () => {
      // 新しいイベントオブジェクトを作成して渡す
      const newEvent = {
        title: modalEventTitle,
        start: startDateTime,
        end: endDateTime,
      };
      onConfirm(newEvent);
    };

    const handleClose = () => {
      onClose();
    };

    return ReactDOM.createPortal(
      <div className="modal" onClick={handleModalClick}>
        <div className="modal-content">
          <h2 className="text-lg font-bold mb-4">イベントを追加</h2>
          <label htmlFor="event-title" className="mb-2">
            イベントのタイトル:
          </label>
          <input
            id="event-title"
            type="text"
            value={modalEventTitle}
            onChange={(e) => setModalEventTitle(e.target.value)}
            className="border rounded px-3 py-2 mb-4 w-full"
            maxLength={50}
          />
          <label htmlFor="start-date" className="mb-2">
            開始日時:
          </label>
          <input
            id="start-date"
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            className="border rounded px-3 py-2 mb-4 w-full"
          />
          <label htmlFor="end-date" className="mb-2">
            終了日時:
          </label>
          <input
            id="end-date"
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            className="border rounded px-3 py-2 mb-4 w-full"
          />
          <div className="flex justify-end">
            <button
              onClick={() => {
                submitEvent(modalEventTitle, selectedDate, selectedEndDate);
                setModalEventTitle(""); // 入力内容をリセット
                setSelectedDate(""); // 開始日をリセット
                setSelectedEndDate(""); // 終了日をリセット
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
            >
              保存
            </button>
            <button
              onClick={handleClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div id="calendar" className="m-10">
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
          contentHeight={700}
        />
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={submitEvent}
          title={eventTitle}
        />
      </div>
    </>
  );
}

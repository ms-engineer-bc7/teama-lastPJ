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
import { getFetchData, postFetchData, deleteFetchData } from "../fetch";
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
  const [selectedEventId, setSelectedEventId] = useState("");

  // get fetch
  useEffect(() => {
    async function fetchData() {
      const events = await getFetchData();
      console.log("getした値(event)", events);
      setEvents(events);
    }
    fetchData();
  }, []);

  // ユーザーが予定をクリックしたらモーダルが開き、詳細が見れる
  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    // ログ
    console.log("予定クリック時:イベント", event);
    console.log("予定クリック時:イベントタイトル", event.title);
    console.log("予定クリック時:開始日", event.startStr);
    console.log("予定クリック時:終了日", event.endStr);
    console.log("取得したID:", event.id);

    setSelectedEventId(event.id);
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
        console.log("POST一覧", newEvents);
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

  // DELETE fetch
  const deleteEvent = async (eventId: string) => {
    try {
      const numericId = parseInt(eventId);
      const result = await deleteFetchData(numericId);
      console.log("数値に変換されたID:", numericId);
      console.log("削除処理の結果:", result);
      if (result.success) {
        // DELETE処理が成功したら、カレンダーからイベントを削除する
        const updatedEvents = events.filter(
          (event: any) => event.id !== numericId
        );
        console.log("更新後のイベントリスト:", updatedEvents);
        setEvents(updatedEvents);
        setIsModalOpen(false);
      } else if (result.error) {
        console.error("イベント削除に失敗しました:", result.error);
      }
    } catch (error) {
      console.error("イベント削除中にエラーが発生しました:", error);
    }
  };

  // const deleteEvent = async (eventId: string) => {
  //   try {
  //     const numericId = parseInt(eventId);
  //     const result = await deleteFetchData(numericId);
  //     console.log("数値に変換されたID:", numericId);
  //     console.log("削除処理の結果:", result);
  //     if (result.success) {
  //       // DELETE処理が成功したら、カレンダーからイベントを削除する
  //       const updatedEvents = events.filter(
  //         (event: any) => event.id !== numericId
  //       );
  //       console.log("更新後のイベントリスト:", updatedEvents);
  //       setEvents(updatedEvents);
  //       setIsModalOpen(false);
  //     } else {
  //       console.error("イベント削除に失敗しました:", result.error);
  //     }
  //   } catch (error) {
  //     console.error("イベント削除中にエラーが発生しました:", error);
  //   }
  // };

  // const deleteEvent = async (eventId: string) => {
  //   try {
  //     const result = await deleteFetchData(parseInt(eventId));
  //     console.log("数値に変換されたID:", eventId);
  //     console.log("削除処理の結果:", result);
  //     if (result.success) {
  //       // DELETE処理が成功したら、カレンダーからイベントを削除する
  //       const updatedEvents = events.filter(
  //         (event: any) => event.id.toString() !== eventId
  //       );
  //       console.log("更新後のイベントリスト:", updatedEvents);
  //       setEvents(updatedEvents);
  //       setIsModalOpen(false);
  //     } else {
  //       console.error("イベント削除に失敗しました:", result.error);
  //     }
  //   } catch (error) {
  //     console.error("イベント削除中にエラーが発生しました:", error);
  //   }
  // };

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
        deleteEvent={deleteEvent}
        event={{
          id: selectedEventId,
          title: modalEventTitle,
          start: startDateTime,
          end: endDateTime,
        }}
      />
    </>
  );
}

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
import {
  getFetchData,
  postFetchData,
  deleteFetchData,
  putFetchData,
} from "../fetch";
import { EventInfo } from "../types";
import MessageBanner from "../_components/MessageBannar"; // MessageBannerコンポーネントのパス

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
    const newEvent = {
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
        // サーバーから返されたイベントIDを使用
        const newEvents = [...events, { ...newEvent, id: result.id }];
        console.log("POST一覧", newEvents);
        setEvents(newEvents);
        // バックエンドにイベントIDを送信してメッセージを生成する
        setSelectedEventId(result.id); // MessageBannerに表示するIDをセット

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

  // PUT fetch
  const updateEvent = async (
    eventId: string,
    title: string,
    startDate: string,
    endDate: string
  ) => {
    const updatedData = {
      title: title,
      start_date: startDate,
      end_date: endDate,
      user: 1,
    };

    const result = await putFetchData(parseInt(eventId), updatedData);

    if (result.success) {
      console.log("イベントの更新成功:", result.data);
      // イベントの配列を更新する際、IDの比較を適切に行う
      const updatedEvents = events.map((event) =>
        parseInt(event.id || "0") === parseInt(eventId || "0")
          ? { ...event, title, start: startDate, end: endDate }
          : event
      );
      setEvents(updatedEvents);
      setIsModalOpen(false);
    } else {
      console.error("イベントの更新エラー:", result.error);
    }
  };

  // 予定のIDを生成
  //   const createEventId = () => {
  //     return `event-${eventGuid++}`;
  //   };

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
        onConfirm={selectedEventId ? updateEvent : submitEvent}
        submitEvent={submitEvent}
        deleteEvent={deleteEvent}
        updateEvent={updateEvent}
        event={{
          id: selectedEventId,
          title: modalEventTitle,
          start: startDateTime,
          end: endDateTime,
        }}
      />
      {selectedEventId && <MessageBanner id={selectedEventId} />}
    </>
  );
}

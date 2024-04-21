"use client";
import styles from './styles.module.css'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // 月表示
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import { EventContentArg } from "@fullcalendar/common";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Modal from "../_components/Modal";
import { LoadingSpinner } from '../_components/LoadingSpinner';
import {
  getFetchData,
  postFetchData,
  deleteFetchData,
  putFetchData,
  getUserInfo,
} from "../fetch";
import MessageBanner from "../_components/MessageBannar"; // MessageBannerコンポーネントのパス
import { User } from "../../../@type";
import Menu from "../_components/Menu";

let eventGuid = 0;

// カレンダーに足りないイベント情報を追加
export type MyEventInput = {
  alert_message_for_u: string;
  alert_message_for_p: string;
} & EventInput

export default function Calendar() {
  const router = useRouter();
  const [authUser] = useAuthState(auth);
  const [user, setUser] = useState<User>();
  const [events, setEvents] = useState<MyEventInput[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [modalEventTitle, setModalEventTitle] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [selectedTime, setSelectedTime] = useState("00:00");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventMessages, setSelectedEventMessages] = useState({
    alert_message_for_u: '',
    alert_message_for_p: '',
  });

  const fetchData = async () => {
    getUserInfo(authUser)
      .then(async (res) => {
        const data = await res.json();
        setUser(data);
        if (data.role == "") router.push("/role");
        if (data.role == "partner") router.push("/partner");
        const events = await getFetchData(authUser?.accessToken);
        console.log("getした値(event)", events);
        setEvents(events);
        setIsLoading(false)
      })
      .catch((err) => {
        router.push("/login");
      });

  }

  // GET の処理
  useEffect(() => {
    setIsLoading(true)
    if (!authUser) return;
    fetchData()

  }, [authUser]);

  // ユーザーが予定をクリックしたらモーダルが開き、詳細が見れる
  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    // ログ
    console.log("予定クリック時:イベント", event);
    console.log("予定クリック時:イベントタイトル", event.title);
    console.log("予定クリック時:開始日", event.startStr);
    console.log("予定クリック時:終了日", event.endStr);
    console.log("予定クリック時:取得したID", event.id);
    console.log("予定クリック時:取得したメッセージu", event.extendedProps.alert_message_for_u);
    console.log("予定クリック時:取得したメッセージp", event.extendedProps.alert_message_for_p);

    setSelectedEventId(event.id);
    setModalEventTitle(event.title);
    setStartDateTime(event.startStr);
    setEndDateTime(event.endStr);
    setIsModalOpen(true);
    // イベント情報から必要なメッセージを取得して状態を更新
    setSelectedEventMessages({
      alert_message_for_u: clickInfo.event.extendedProps.alert_message_for_u,
      alert_message_for_p: clickInfo.event.extendedProps.alert_message_for_p,
    });
  };

  // カレンダーの日付(マス)をクリックしたときの処理
  const handleDateClick = (clickInfo: DateClickArg) => {
    console.log("日付空欄クリック時:handleDateClick動作確認");

    // 日付フォーマット修正 カズさんとハンズオン
    const formattedDate = `${clickInfo.dateStr}T${selectedTime}`;
    console.log("日付形式の取得確認", formattedDate);

    // モーダルの情報を次回の入力で保持しないために、タイトル、開始日、終了日を初期化
    setModalEventTitle("");
    setStartDateTime(formattedDate);
    setEndDateTime("");

    setSelectedDate(formattedDate);
    setIsModalOpen(true);
  };

  // カレンダーに新しいイベントを追加する関数
  const submitEvent = async (
    eventTitle: string,
    startDate: string,
    endDate: string
  ) => {
    setIsLoading(true)
    const newEvent = {
      title: eventTitle,
      start: startDate,
      end: endDate,
      color: "blue",
    };

    console.log("POSTされたデータ:", newEvent);

    // POST の処理
    try {
      // POST処理を実行し結果を取得
      const result = await postFetchData(
        eventTitle,
        startDate,
        endDate,
        user!.id
      );
      if (!result.error) {
        fetchData();
        setIsModalOpen(false);
      } else {
        console.error("データの送信でエラーが発生しました:", result.error);
      }
    } catch (error) {
      console.error("データの送信でエラーが発生しました:", error);
    }
  };

  // DELETE 処理
  const deleteEvent = async (eventId: string) => {
    try {
      const numericId = parseInt(eventId);
      const result = await deleteFetchData(numericId);

      console.log("DELETEされたデータ:", result);
      if (result.success) {
        await fetchData();
        setIsModalOpen(false);
      } else if (result.error) {
        //   console.error("イベント削除に失敗しました:", result.error);
      }
    } catch (error) {
      console.error("イベント削除中にエラーが発生しました:", error);
    }
  };

  // PUT 処理
  const updateEvent = async (
    eventId: string,
    title: string,
    startDate: string,
    endDate: string
  ) => {
    setIsLoading(true)
    const updatedData = {
      title: title,
      start_date: startDate,
      end_date: endDate,
      user: user!.id,
    };

    console.log("PUTされたデータ:", updatedData);

    const result = await putFetchData(parseInt(eventId), updatedData);

    if (result.success) {
      // イベントの配列を更新する際、IDの比較を適切に行う
      const updatedEvents = events.map((event: any) =>
        parseInt(event.id || "0") === parseInt(eventId || "0")
          ? { ...event, title, start: startDate, end: endDate }
          : event
      );
      await fetchData();
      setIsModalOpen(false);
    } else {
      console.error("イベントの更新エラー:", result.error);
    }
  };

  // モーダルを非表示にする
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
      <div className="flex w-full">
        <div className="flex-shrink-0">
          <Menu user={user} />
        </div>

        {/* カレンダー */}
        <div className={`flex-grow fc-wrapper-woman ${styles.fc_wrapper}`}>
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
          {selectedEventId && (
            <MessageBanner
              id={selectedEventId}
              messages={selectedEventMessages}
              role={user.role}
            />
          )}
        </div>
        {isLoading && <LoadingSpinner />}
      </div>
    </>
  );
}

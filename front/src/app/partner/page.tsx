"use client";
import React, { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin, { EventClickArg } from "@fullcalendar/interaction";
// import { EventInput } from "@fullcalendar/core";
// import { EventContentArg } from "@fullcalendar/common";
// import ModalPartner from "../_components/ModalPartner";
// import { getFetchData } from "../fetch";
// import { EventInfo } from "../types";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  EventContentArg,
  EventClickArg,
} from "@fullcalendar/common"; // EventClickArgをこちらに移動
import ModalPartner from "../_components/ModalPartner";
import MessageBanner from "../_components/MessageBannar"; // MessageBannerコンポーネントのパス
import { getFetchData } from "../fetch";
import { EventInfo } from "../types";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function Partner() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventInfo | null>(null);
  const [authUser] = useAuthState(auth);
  const [modalEventTitle, setModalEventTitle] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");

  // GET の処理
  useEffect(() => {
    if (!authUser) return;
    async function fetchData() {
      console.log(authUser);
      const events = await getFetchData(authUser.accessToken);
      // const events = await getFetchData();
      console.log("getした値(event)", events);
      setEvents(events);
    }
    fetchData();
  }, [authUser]);

  // ユーザーが予定をクリックしたらモーダルが開き、詳細が見れる
  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log("予定クリック時:イベント", clickInfo.event);
    setSelectedEvent({
      event: {
        id: Number(clickInfo.event.id),
        title: clickInfo.event.title,
        start: clickInfo.event.startStr,
        end: clickInfo.event.endStr,
      },
    });
    setIsModalOpen(true);
  };

  // const handleEventClick = (clickInfo: any) => {
  //   const event = clickInfo.event;
  //   // ログ
  //   console.log("予定クリック時:イベント", event);
  //   console.log("予定クリック時:イベントタイトル", event.title);
  //   console.log("予定クリック時:開始日", event.startStr);
  //   console.log("予定クリック時:終了日", event.endStr);
  //   console.log("予定クリック時:取得したID", event.id);

  //   setSelectedEventId(event.id);
  //   setModalEventTitle(event.title);
  //   setStartDateTime(event.startStr);
  //   setEndDateTime(event.endStr);
  //   setIsModalOpen(true);
  // };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        selectable={false}
        dayMaxEvents={true}
        businessHours={{ daysOfWeek: [1, 2, 3, 4, 5] }}
        dayCellContent={(e) => {
          let dayNumber = parseInt(e.dayNumberText, 10);
          return { html: dayNumber.toString() };
        }}
        locale="ja"
        firstDay={1}
        eventClick={handleEventClick}
        eventContent={(eventInfo: EventContentArg) => (
          <b>{eventInfo.event.title}</b>
        )}
        contentHeight={700}
      />
      {isModalOpen && selectedEvent && (
        <ModalPartner
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
        />
      )}
      {selectedEventId && <MessageBanner id={selectedEventId} />}
    </>
  );
}

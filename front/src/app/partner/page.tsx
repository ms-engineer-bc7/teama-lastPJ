"use client";
import styles from './styles.module.css'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { getFetchData, getUserInfo } from "../fetch";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import PartnerMenu from "../_components/PartnerMenu";

import { MyEventInput } from "../calendar/page";
import { User } from "../../../@type";

export default function Partner() {
  const router = useRouter();
  const [user, setUser] = useState<User>();
  const [events, setEvents] = useState<MyEventInput[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MyEventInput | null>(null);
  const [authUser] = useAuthState(auth);
  const [modalEventTitle, setModalEventTitle] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventMessages, setSelectedEventMessages] = useState({
    alert_message_for_u: '',
    alert_message_for_p: '',
  });
  // const[user,setUser] = useState({role:''});// ユーザー情報とroleを状態で管理


  const fetchData = async () => {
    const events = await getFetchData(authUser?.accessToken);
    console.log("getした値(event)", events);
    setEvents(events);
  }



  // GET の処理
  useEffect(() => {
    if (!authUser) return;
    getUserInfo(authUser)
      .then(async (res) => {
        const data = await res.json();
        setUser(data);
        if (data.role == "") router.push("/role");
        if (data.role == "partner") router.push("/partner");
      })
      .catch((err) => {
        router.push("/login");
      });
      
    fetchData();
  }, [authUser,router]);

  // ユーザーが予定をクリックしたらモーダルが開き、詳細が見れる
  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log("予定クリック時:イベント", clickInfo.event);
    setSelectedEvent({
      id: Number(clickInfo.event.id),
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
    });
    setSelectedEventId(clickInfo.event.id);  // メッセージ生成のためIDをセット
    console.log("送信されたID", clickInfo.event.id);
    setIsModalOpen(true);
    // イベント情報から必要なメッセージを取得して状態を更新
    setSelectedEventMessages({
      alert_message_for_u: clickInfo.event.extendedProps.alert_message_for_u,
      alert_message_for_p: clickInfo.event.extendedProps.alert_message_for_p,
    });
  };

  return (
    <>
      <div className="flex w-full">
        <div className="flex-shrink-0">
          <PartnerMenu user={user} />
        </div>

        {/* カレンダー */}
        <div className={`flex-grow fc-wrapper-partner ${styles.fc_wrapper}`}>
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
          {selectedEventId && (
          <MessageBanner
          // id={selectedEventId} 
          messages={selectedEventMessages}
          role={user.role}
          />
          )}
        </div>
      </div>
    </>
  );
}

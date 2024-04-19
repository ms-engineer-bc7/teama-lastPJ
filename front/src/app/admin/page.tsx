'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Event {
    id: string;
    name: string;
  }

  interface Viewer {
    id: string;
    allowed_email: string;
    event: string;
  }


//許可するメールアドレスをPOSTするときはイベントも一緒に送らないとNG
export default function AllowEmail() {
  const [email, setEmail] = useState<string>('')
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string>(''); // 選択されたイベントのIDを保持
  const [events, setEvents] = useState<Event[]>([]); // イベントのリストを保持
  const router = useRouter()

  useEffect(() => { //イベントを取得する
    const fetchEvents = async () => {
      const response = await fetch('/api/events');
    //   headers: {
    //     'Authorization': `Bearer ${token}`  // トークンをヘッダーに追加
    //   }
    // });
      const data = await response.json();
      setEvents(data); // ここでイベントリストをstateにセット
    };

    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      // メールアドレスとイベントIDをサーバーに送信する
      const res = await fetch('/api/viewers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ allowed_email: email, event_id: selectedEvent }),
      })

      if (res.ok) {
        setSubmittedEmail(email); // 送信されたメールアドレスを保存
        setEmail('')  // 成功したら、メールアドレスを空にする
        setSelectedEvent(''); // イベント選択をリセット
        router.refresh()  // ページを更新する
        alert(`メールアドレス「${submittedEmail}」を許可しました`);  // 成功アラートを表示
      } else {
        // エラー処理
        console.error('Error submitting email:', res.statusText)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <h1>予定を共有するメールアドレスを入力</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレスを入力"
          required
        />
        <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} required>
          <option value="">イベントを選択</option>
          {events.map((evt) => (
            <option key={evt.id} value={evt.id}>{evt.name}</option>
          ))}
        </select>
        <button type="submit">送信</button>
      </form>
      {/* 送信されたメールアドレスを表示 */}
      {submittedEmail && <p>許可されたメールアドレス: {submittedEmail}</p>}
    </div>
  )
}
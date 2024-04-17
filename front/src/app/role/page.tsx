"use client";
import { useRouter } from 'next/navigation';

export default function Role() {
  const router = useRouter();

  const handleWomanClick = () => {
    router.push('/calendar');
  };

  const handlePartnerClick = () => {
    router.push('/partner');
  };


  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div>
          <h2 className="text-center mb-6">タイプを選択してください</h2>

          <div className="flex flex-col space-y-6">
            <button className="for-woman border-2 border-black hover:border-orange-500 rounded-lg p-4 transition-colors duration-300" onClick={handleWomanClick}>
              <p className="font-bold mb-2" >女性</p>
              <p>
                治療の記録や治療金額の見積もり、カウンセリングなどを利用できます。
                <br />
                また、治療に向けたメッセージも受け取ることができます。
              </p>
            </button>

            <button className="for-partner border-2 border-black hover:border-orange-500 rounded-lg p-4 transition-colors duration-300 mt-2.5" onClick={handlePartnerClick}>
              <p className="font-bold mb-2">パートナー</p>
              <p>
                女性版で入力されたスケジュールを閲覧できます。
                <br />
                また、治療のサポートに向けたメッセージを受け取ることができます。
              </p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

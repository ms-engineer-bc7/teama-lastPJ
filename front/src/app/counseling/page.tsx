import Menu from "../_components/Menu";

export default function Counseling() {
  const stripeUrl = "https://buy.stripe.com/test_8wM6qu4v33Vf6Qw000";

  return (
    <>
      <div className="flex w-full">
        <div className="flex-shrink-0 sticky top-0">
          <Menu />
        </div>

        {/* カウンセリング */}
        <div className="flex-grow">
          <div className="p-8">
            <p className="font-semibold text-center mb-3 text-gray-800">
              身体と心の両面から治療をサポート
            </p>
            <h1 className="text-3xl font-semibold text-center mb-9 text-gray-800">
              カウンセリング
            </h1>

            {/* 説明 */}
            <div className="text-center mb-12">
              <div className="flex flex-wrap justify-center gap-10 items-stretch">
                {/* サービス1 */}
                <div className="flex flex-col w-72">
                  {" "}
                  {/* 横幅を指定し、flex-colで縦に並べる */}
                  <div className="flex flex-col p-6 bg-white rounded-lg border border-gray-300 shadow flex-grow">
                    {" "}
                    {/* flex-growでカードの高さを揃える */}
                    <h2 className="font-extrabold mb-3 text-[#DD6E00]">
                      サービス内容
                    </h2>
                    <p className="text-gray-600 flex-grow">
                      {" "}
                      専門家によるカウンセリングで、不妊治療を心理的にもサポートします。
                      おひとりでも、カップルでも受けることができます。
                    </p>
                  </div>
                </div>

                {/* サービス2 */}
                <div className="flex flex-col w-72">
                  <div className="flex flex-col p-6 bg-white rounded-lg border border-gray-300 shadow flex-grow">
                    <h2 className="font-extrabold mb-3 text-[#DD6E00]">
                      カウンセラーについて
                    </h2>
                    <p className="text-gray-600 flex-grow">
                      臨床心理士、公認心理師資格を保持している、不妊治療専門の経験豊富なカウンセラーがお待ちしています。
                    </p>
                  </div>
                </div>

                {/* サービス3 */}
                <div className="flex flex-col w-72">
                  <div className="flex flex-col p-6 bg-white rounded-lg border border-gray-300 shadow flex-grow">
                    <h2 className="font-extrabold mb-3 text-[#DD6E00]">
                      価格について
                    </h2>
                    <p className="text-gray-600 flex-grow">
                      初回無料。
                      2回目以降は、1回5,000円です。1か月15,000円で何回でもご利用いただけるプランもご用意しております。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 予約フォーム */}
            <div className="flex flex-col md:flex-row p-6 mt-10 bg-[#F4F1EA]">
              {/* 左側画像 */}
              <div style={{ width: "400px" }} className="flex justify-center">
                <img src="/img/counseling.svg" alt="Counselor" />
              </div>

              {/* 予約フォーム */}
              <div className="flex-grow pl-12">
                <h3 className="text-base font-semibold mb-4">
                  ご予約はこちらから
                </h3>
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      お名前
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm"
                      placeholder="お名前を入力"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      メールアドレス
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm"
                      placeholder="メールアドレスを入力"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      日付選択
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-gray-700"
                    >
                      時間選択
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <a
                      href="stripeUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button
                        type="button"
                        className="py-2 px-4 bg-[#0E535F] text-white font-semibold rounded-lg shadow-md hover:bg-[#0B3B45]"
                      >
                        予約 / お支払い
                      </button>
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

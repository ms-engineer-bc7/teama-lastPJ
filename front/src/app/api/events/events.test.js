import { createMocks } from "node-mocks-http";

describe("/api/events", () => {
  test("GET /api/events", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    // Djangoの応答をモック化
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, title: "Event 1" },
          { id: 2, title: "Event 2" },
        ]),
    });

    await require("../../app/api/events/route").GET(req, res);

    expect(res._getJSONData()).toEqual([
      { id: 1, title: "Event 1" },
      { id: 2, title: "Event 2" },
    ]);
  });

  // 他のメソッド (POST, PUT, DELETE) のテストも書く
});

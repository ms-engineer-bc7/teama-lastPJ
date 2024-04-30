import "@testing-library/jest-dom";
import React from "react";
import { render, waitFor } from "@testing-library/react";
import Calendar from "../src/app/calendar/page";
import * as fetchModule from "../src/app/fetch";
import { useAuthState } from "react-firebase-hooks/auth";

// react-firebase-hooks/authのモック設定
jest.mock("react-firebase-hooks/auth", () => ({
  useAuthState: jest.fn(),
}));

// ユーザーデータとイベントデータのモック
const mockUser = {
  id: 1,
  uid: "uid123",
  name: "John Doe",
  email: "john@example.com",
  role: "user",
  partner: undefined,
  partner_email: undefined,
  accessToken: "fake-token",
};

const mockEvents = [
  { id: 1, title: "Event 1", start: "2022-01-01", end: "2022-01-02" },
  { id: 2, title: "Event 2", start: "2022-01-03", end: "2022-01-04" },
];

// Fetch モジュールのモック設定
jest.mock("../src/app/fetch", () => ({
  getUserInfo: jest.fn(),
  getFetchData: jest.fn(),
}));

describe("Calendar Component", () => {
  beforeEach(() => {
    // authUserのモックを設定
    (useAuthState as jest.Mock).mockReturnValue([mockUser, false, undefined]);

    // モック関数の戻り値を設定
    (fetchModule.getUserInfo as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve(mockUser),
    });
    (fetchModule.getFetchData as jest.Mock).mockResolvedValue(mockEvents);
  });

  it("fetches user info and events on component mount and sets them", async () => {
    const { findByText } = render(<Calendar />);

    await waitFor(() => {
      expect(fetchModule.getUserInfo).toHaveBeenCalled();
      expect(fetchModule.getFetchData).toHaveBeenCalledWith("fake-token");
    });

    expect(await findByText("Event 1")).toBeInTheDocument();
    expect(await findByText("Event 2")).toBeInTheDocument();
  });
});

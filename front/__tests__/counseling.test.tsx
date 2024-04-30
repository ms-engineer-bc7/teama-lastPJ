import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counseling from "../src/app/counseling/page";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";
import { createRouterMock } from "next-router-mock";

// next/router をモック化
jest.mock("next/router");

describe("Counseling component", () => {
  let mockRouter: any;

  beforeEach(() => {
    // モックされたルーターの作成
    mockRouter = createRouterMock({
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
    });

    // useRouter モックの戻り値を設定
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // コンポーネントのレンダリング
    render(<Counseling />);
  });

  it("初期にローディング状態がレンダリングされる", async () => {
    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  it("ロード後にユーザー情報が表示される", async () => {
    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });
  });

  it("ロールが空の場合に /role へリダイレクトされる", async () => {
    mockRouter.push.mockImplementation((url: string) => {
      expect(url).toBe("/role");
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/role");
    });
  });

  it("カウンセリング情報が表示される", async () => {
    await waitFor(() => {
      expect(screen.getByText(/オンラインカウンセリング/i)).toBeInTheDocument();
      expect(screen.getByText(/サービス内容/i)).toBeInTheDocument();
      expect(screen.getByText(/カウンセラーについて/i)).toBeInTheDocument();
      expect(screen.getByText(/価格・営業時間について/i)).toBeInTheDocument();
    });
  });

  it("ユーザーが予約フォームに情報を入力できる", async () => {
    await waitFor(() => {
      userEvent.type(screen.getByLabelText(/お名前/i), "John Doe");
      userEvent.type(
        screen.getByLabelText(/メールアドレス/i),
        "test@example.com"
      );
      userEvent.type(screen.getByLabelText(/日付選択/i), "2024-05-01");
      userEvent.type(screen.getByLabelText(/時間選択/i), "12:00");
    });

    expect(screen.getByLabelText(/お名前/i)).toHaveValue("John Doe");
    expect(screen.getByLabelText(/メールアドレス/i)).toHaveValue(
      "test@example.com"
    );
    expect(screen.getByLabelText(/日付選択/i)).toHaveValue("2024-05-01");
    expect(screen.getByLabelText(/時間選択/i)).toHaveValue("12:00");
  });
});

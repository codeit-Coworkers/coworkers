"use client";

import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchClient } from "@/lib/fetchClient";
import { BASE_URL } from "@/api/config";

interface KakaoLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    nickname: string;
    image: string;
    teamId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function KakaoRedirectPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get("code");

  const hasCalledAPI = useRef(false);

  useEffect(() => {
    if (!code || hasCalledAPI.current) return;

    const loginWithKakao = async () => {
      hasCalledAPI.current = true;

      try {
        const currentRedirectUri =
          window.location.origin + window.location.pathname;

        const response = await fetchClient<KakaoLoginResponse>(
          `${BASE_URL}/auth/signIn/KAKAO`,
          {
            method: "POST",
            body: JSON.stringify({
              state: "random_state",
              redirectUri: currentRedirectUri,
              token: code,
            }),
          },
        );

        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        alert("카카오 로그인 성공!");
        navigate("/team");
      } catch (error) {
        console.error("카카오 로그인 실패 상세:", error);
        if (error instanceof Error) {
          const serverMessage = error.message;
          alert(`로그인 실패: ${serverMessage}`);
        }

        navigate("/login");
      }
    };

    loginWithKakao();
  }, [code, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-bold">카카오 인증 처리 중...</p>
        <p className="text-color-secondary text-sm">잠시만 기다려 주세요.</p>
      </div>
    </div>
  );
}

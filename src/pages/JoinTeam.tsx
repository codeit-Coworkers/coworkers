import { useAcceptGroupInvitation } from "@/api/group";
import { useUser } from "@/api/user";
import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { HttpError } from "@/lib/fetchClient";
import { useToastStore } from "@/stores/useToastStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinTeam() {
  // 상태 관리
  const [teamLink, setTeamLink] = useState<string>("");
  const [teamLinkError, setTeamLinkError] = useState<string>("");

  // 훅
  const { data: user } = useUser();
  const { mutate } = useAcceptGroupInvitation();
  const navigate = useNavigate();
  const toast = useToastStore();

  const handleBlur = () => {
    if (!teamLink) {
      setTeamLinkError("팀 링크를 입력해주세요.");
    }
  };

  const handleSubmit = () => {
    if (!teamLink) {
      setTeamLinkError("팀 링크를 입력해주세요.");
      return;
    }

    mutate(
      { userEmail: user.email, token: teamLink },
      {
        onSuccess: (data) => {
          toast.show("팀에 성공적으로 참여했습니다.");
          navigate(`/team/${data.groupId}`);
        },

        // 서버에서 온 에러메세지 화면에 보여주기
        onError: (error) => {
          const message =
            error instanceof HttpError && error.data?.message
              ? error.data.message
              : "유효하지 않은 팀 링크입니다.";
          toast.show(message);
          setTeamLinkError(message);
        },
      },
    );
  };

  return (
    <>
      <div className="flex h-[100vh] flex-col items-center justify-center">
        <div className="bg-background-primary w-[calc(100%-20px)] max-w-[550px] rounded-[20px] px-[20px] pt-[52px] pb-[74px] md:px-[45px] md:pt-[61px] md:pb-[64px]">
          <h3 className="text-color-primary text-xl-b md:text-2xl-b mb-[32px] md:mb-[48px]">
            팀 참여하기
          </h3>
          <div className="mt-[12px] md:mt-[32px]">
            <div className="space-y-1">
              <Input
                label="팀 링크"
                placeholder="팀 링크를 입력해주세요"
                value={teamLink}
                onChange={(e) => {
                  setTeamLink(e.target.value);
                  if (teamLinkError) setTeamLinkError("");
                }}
                onBlur={handleBlur}
                className={`focus:ring-2 focus:outline-none ${teamLinkError ? "border-status-danger" : ""}`}
              />
              {teamLinkError && (
                <p className="text-status-danger text-xs">{teamLinkError}</p>
              )}
            </div>
          </div>
          <div className="mt-[40px]">
            <Button
              size="authWide"
              onClick={handleSubmit}
              disabled={!teamLink}
              className="disabled:cursor-not-allowed disabled:opacity-50"
            >
              참여하기
            </Button>
          </div>
          <p className="text-color-default text-xs-r md:text-lg-r mt-[20px] text-center md:mt-[24px]">
            공유받은 팀링크를 이용해 참여할 수 있어요.
          </p>
        </div>
      </div>
    </>
  );
}

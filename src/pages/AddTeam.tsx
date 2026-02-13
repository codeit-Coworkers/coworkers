import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { useCreateGroup } from "@/api/group";
import { useGroups } from "@/api/user";
import { useToastStore } from "@/stores/useToastStore";
import TeamImageUpload from "@/features/team/components/TeamImageUpload";

export default function AddTeam() {
  // 데이터 불러오기
  const { data: groups } = useGroups();

  // 상태 관리
  const [imageUrl, setImageUrl] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  // 훅 및 유틸리티
  const navigate = useNavigate();
  const { mutate } = useCreateGroup();
  const toast = useToastStore();

  const TEAM_NAME_REGEX = /^[a-zA-Z0-9가-힣_]+$/;

  const validateName = (value: string): string | null => {
    if (!value) return "팀 이름을 입력해주세요.";
    if (!TEAM_NAME_REGEX.test(value))
      return "팀이름에 공백 특수문자는 사용하지 못합니다.";
    if (
      groups.some((group) => group.name.toLowerCase() === value.toLowerCase())
    )
      return "이미 존재하는 이름입니다.";
    return null;
  };

  const handleBlur = () => {
    const error = validateName(name);
    if (error) setNameError(error);
  };

  const isValid = name !== "" && nameError === "";

  const handleSubmit = () => {
    if (!isValid) return;

    mutate(
      { name, image: imageUrl },
      {
        onSuccess: (group) => {
          toast.show("팀이 성공적으로 생성되었습니다.");
          navigate(`/team/${group.id}`);
        },
        onError: () => {
          toast.show("팀 생성에 실패했습니다. 다시 시도해주세요.");
        },
      },
    );
  };

  return (
    <div>
      <div className="flex h-[100vh] flex-col items-center justify-center">
        <div className="bg-background-primary w-[calc(100%-20px)] max-w-[550px] rounded-[20px] px-[20px] pt-[52px] pb-[74px] md:px-[45px] md:pt-[61px] md:pb-[64px]">
          <h3 className="text-color-primary text-xl-b md:text-2xl-b mb-[32px] md:mb-[48px]">
            팀 생성하기
          </h3>
          <div className="flex justify-center">
            <TeamImageUpload imageUrl={imageUrl} onImageChange={setImageUrl} />
          </div>
          <div className="mt-[12px] md:mt-[32px]">
            <div className="space-y-1">
              <Input
                label="팀 이름"
                placeholder="팀 이름을 입력해주세요"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError("");
                }}
                onBlur={handleBlur}
                className={`focus:ring-2 focus:outline-none ${nameError ? "border-status-danger" : ""}`}
              />
              {nameError && (
                <p className="text-status-danger text-xs">{nameError}</p>
              )}
            </div>
          </div>
          <div className="mt-[40px]">
            <Button
              size="authWide"
              onClick={handleSubmit}
              disabled={!isValid}
              className="disabled:cursor-not-allowed disabled:opacity-50"
            >
              생성하기
            </Button>
          </div>
          <p className="text-color-default text-xs-r md:text-lg-r mt-[20px] text-center md:mt-[24px]">
            팀 이름은 회사명이나 모임 이름 등으로 설정하면 좋아요.
          </p>
        </div>
      </div>
    </div>
  );
}

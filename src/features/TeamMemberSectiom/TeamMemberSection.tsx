import { useGroup } from "@/api/group";
import InviteModal from "@/components/common/Modal/Contents/InviteModal";
import ProfileModal from "./ProfileModal";
import Modal from "@/components/common/Modal/Modal";
import { useState } from "react";
import RemoveMemberModal from "./RemoveMemberModal";
import MemberItem from "./MemberItem";

type Member = {
  userId: number;
  userName: string;
  userEmail: string;
  userImage: string;
};

/** 모달 종류: invite(초대), profile(프로필), remove(추방), null(닫힘) */
type ModalType = "invite" | "profile" | "remove" | null;

export default function TeamMemberSection() {
  // 데이터 요청
  const { data: groupData } = useGroup(3810);

  const members = groupData?.members || [];
  const memberCount = members.length;

  const [modalType, setModalType] = useState<ModalType>(null);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  /** 모달 열기 - member가 있으면 선택된 멤버도 함께 저장 */
  const openModal = (type: ModalType, member?: Member) => {
    setModalType(type);
    if (member) setSelectedMember(member);
  };

  /** 모달 닫기 */
  const closeModal = () => setModalType(null);

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#f0f0f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="bg-background-primary border-border-primary w-[240px] rounded-[12px] border-1 px-[20px] py-[24px]">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <p className="flex gap-1">
              <span className="text-color-primary lg-m">멤버</span>
              <span className="text-color-default lg-m">
                ({memberCount} 명)
              </span>
            </p>
            <button
              type="button"
              onClick={() => openModal("invite")}
              className="text-brand-primary text-md-sb"
            >
              초대하기 +
            </button>
          </div>
          {/* 멤버 리스트 */}
          <div className="mt-[24px]">
            <ul>
              {members.map((member) => (
                <MemberItem
                  key={member.userId}
                  member={member}
                  onProfileOpen={() => openModal("profile", member)}
                  onRemoveOpen={() => openModal("remove", member)}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* 초대 모달 */}
        <Modal isOpen={modalType === "invite"} onClose={closeModal}>
          <InviteModal onClose={closeModal} />
        </Modal>
        {/* 프로필 모달 */}
        <Modal isOpen={modalType === "profile"} onClose={closeModal}>
          <ProfileModal onClose={closeModal} selectedMember={selectedMember} />
        </Modal>
        {/* 팀 추방 모달 */}
        <Modal isOpen={modalType === "remove"} onClose={closeModal}>
          <RemoveMemberModal
            onClose={closeModal}
            selectedRemoveMember={selectedMember}
          />
        </Modal>
      </div>
    </>
  );
}

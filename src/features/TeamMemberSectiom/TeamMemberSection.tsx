import { useGroup } from "@/api/group";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import InviteModal from "@/components/common/Modal/Contents/InviteModal";
import ProfileModal from "./ProfileModal";
import Modal from "@/components/common/Modal/Modal";
import { useState } from "react";
import RemoveMemberModal from "./RemoveMemberModal";

type Member = {
  userId: number;
  userName: string;
  userEmail: string;
  userImage: string;
};

export default function TeamMemberSection() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [selectedRemoveMember, setSelectedRemoveMember] =
    useState<Member | null>(null);

  /** 현재 모달 열림 여부 */
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDangerOpen, setIsDangerOpen] = useState(false);

  /** 모달 열기, 닫기 */
  const handleModalOpen = () => setIsOpen(true);
  const handleModalClose = () => setIsOpen(false);
  const handleProfileModalOpen = (member: Member) => {
    setSelectedMember(member);
    setIsProfileOpen(true);
  };
  const handleProfileModalClose = () => setIsProfileOpen(false);

  const handleDangerModalOpen = (member: Member) => {
    setSelectedRemoveMember(member);
    setIsDangerOpen(true);
  };
  const handleDangerModalClose = () => setIsDangerOpen(false);

  const { data: groupData } = useGroup(3810);

  const members = groupData?.members || [];
  const memberCount = members.length;

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
              onClick={handleModalOpen}
              className="text-brand-primary text-md-sb"
            >
              초대하기 +
            </button>
          </div>
          {/* 컨텐츠 */}
          <div className="mt-[24px]">
            <ul>
              {members.map((member) => (
                <li key={member.userId} className="mt-[18px] first:mt-0">
                  <a
                    href="#;"
                    className="flex items-center justify-between gap-[12px]"
                    onClick={(e) => {
                      e.preventDefault();
                      handleProfileModalOpen(member);
                    }}
                  >
                    <div className="bg-brand-primary h-[32px] w-[32px] flex-shrink-0 overflow-hidden rounded-[8px]">
                      <img
                        src={member.userImage}
                        alt={member.userName + " 프로필 이미지"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-color-primary text-sm-sb truncate">
                        {member.userName}
                      </p>
                      <p className="text-xs-r text-color-secondary truncate">
                        {member.userEmail}
                      </p>
                    </div>
                    <div
                      className="flex flex-shrink-0 items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button type="button">
                        <Dropdown
                          listAlign="center"
                          trigger="kebab"
                          options={[
                            {
                              label: "멤버 내보내기",
                              value: "멤버 내보내기",
                              action: () => handleDangerModalOpen(member),
                            },
                          ]}
                        />
                      </button>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* 초대 모달 */}
        <Modal isOpen={isOpen} onClose={handleModalClose}>
          <InviteModal onClose={handleModalClose} />
        </Modal>
        {/* 프로필 모달 */}
        <Modal isOpen={isProfileOpen} onClose={handleProfileModalClose}>
          <ProfileModal
            onClose={handleProfileModalClose}
            selectedMember={selectedMember}
          />
        </Modal>
        {/* 팀 추방 모달 */}
        <Modal isOpen={isDangerOpen} onClose={handleDangerModalClose}>
          <RemoveMemberModal
            onClose={handleDangerModalClose}
            selectedRemoveMember={selectedRemoveMember}
          />
        </Modal>
      </div>
    </>
  );
}

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import Modal from "@/components/common/Modal/Modal";
import DangerModal from "@/components/common/Modal/Contents/DangerModal";

type TodayProgressSectionProps = {
  groupData: {
    name: string;
    id: number;
    members: {
      userId: number;
      userImage: string;
      userName: string;
      role: string;
    }[];
  };
  allTasks: {
    doneAt: string | null;
  }[];
  isAdmin?: boolean;
};

export default function TodayProgressSection({
  groupData,
  allTasks,
  isAdmin = false,
}: TodayProgressSectionProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = () => {
    navigate(`${location.pathname}/edit`);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const allTasksCount = allTasks.length;

  const doneCount = allTasks.filter((task) => task.doneAt).length;

  const progressPercentage = Math.round((doneCount / allTasksCount) * 100);

  return (
    <div className="md: bg-background-inverse relative rounded-[20px] shadow-[0_15px_50px_-12px_rgba(0,0,0,0.05)]">
      {/* header */}
      <div className="flex w-full items-center justify-between px-[26px] pt-[20px] pb-[34px] md:pt-[30px] lg:pt-[32px] lg:pr-[84px] lg:pb-[37px]">
        <div className="flex items-center gap-2">
          <h2 className="text-xl-b md:text-2xl-b">{groupData.name}</h2>
          <div className="border-border-primary align-center bg-background-inverse flex gap-[6px] rounded-[8px] border p-1 pr-[8px]">
            <div className="flex">
              {groupData.members.slice(0, 3).map((member, index) => (
                <div
                  className="border-color-inverse relative -ml-[7px] h-[20px] w-[20px] overflow-hidden rounded-[6px] border first:ml-0 md:h-[24px] md:w-[24px]"
                  style={{ zIndex: 3 - index }}
                  key={member.userId}
                >
                  <img
                    src={member.userImage}
                    alt={member.userName}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-sm-m text-color-default leading-[20px] md:leading-[24px]">
              {groupData.members.length}
            </div>
          </div>
        </div>
        {isAdmin && (
          <div>
            <button
              type="button"
              className="right-[38px] bottom-[36px] z-1 lg:absolute"
            >
              {/* <OptionIcon /> */}
              <Dropdown
                optionsKey="edit"
                listAlign="left"
                trigger="set"
                options={[
                  { label: "수정하기", value: "edit", action: handleEdit },
                  { label: "삭제하기", value: "delete", action: handleDelete },
                ]}
              />
            </button>
            <Modal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
            >
              <DangerModal onClose={() => setIsDeleteModalOpen(false)} />
            </Modal>
          </div>
        )}
      </div>

      {/* content */}
      <div className="flex items-center justify-between px-[26px] lg:pr-[84px]">
        <div>
          <h3 className="text-xs-m text-color-disabled md:text-md-m">
            오늘의 진행 상황
          </h3>
          <strong className="text-brand-primary text-3xl-b md:text-4xl-b">
            {progressPercentage}%
          </strong>
        </div>
        <div className="flex gap-[32px]">
          <div className="before:bg-border-primary relative text-center before:absolute before:top-0 before:right-[-16px] before:h-full before:w-px">
            <p className="text-xs-m text-color-disabled">오늘의 할 일</p>
            <p className="text-2xl-b text-color-default md:text-3xl-b mt-1">
              {allTasksCount}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs-m text-color-disabled">완료🙌</p>
            <p className="text-2xl-b text-brand-primary md:text-3xl-b mt-1">
              {doneCount}
            </p>
          </div>
        </div>
      </div>
      {/* progress bar */}
      <div className="relative mt-3 flex px-[26px] pb-[30px] md:mt-4 md:pb-[34px] lg:mt-4 lg:pr-[84px] lg:pb-[34px]">
        <div
          className="relative h-[20px] w-full overflow-hidden rounded-full"
          role="progressbar"
          aria-label="진행률"
        >
          <div className="animate-marqueeAnimation absolute left-0 flex h-full w-full rounded-full bg-[#F1F5F9]">
            <div className="animate-progress-stripes absolute left-full h-full w-full rounded-r-full bg-[repeating-linear-gradient(135deg,#EBEFF5_0px,#EBEFF5_12px,#F1F5F9_12px,#F1F5F9_24px)]"></div>
            <div className="animate-progress-stripes h-full w-full rounded-l-full bg-[repeating-linear-gradient(135deg,#EBEFF5_0px,#EBEFF5_12px,#F1F5F9_12px,#F1F5F9_24px)]"></div>
          </div>
          <div
            className="bg-brand-primary animate-progress-pulse absolute left-0 h-full rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

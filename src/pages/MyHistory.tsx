import MyTasks from "@/features/MyTasks/MyTasks";
import DatePagination from "./ListPage/components/DatePagination";
import { useState } from "react";
import CalendarPicker from "./ListPage/components/CalendarPicker";
import SettingsIcon from "@/assets/settings.svg";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "@/components/common/Modal/Modal";
import TeamDeleteModal from "@/components/common/Modal/Contents/TeamDeleteModal";

export default function MyHistory() {
  const { id: groupId } = useParams();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = () => {
    navigate(`/team/${groupId}/edit`);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="bg-background-secondary px-[16px] pt-[17px] pb-[40px] md:px-[26px] md:py-[70px] lg:px-[85px] lg:pt-[90px]">
        {/* 헤더 */}
        <header className="text-color-primary text-lg-b lg:border-border-primary lg:bg-background-primary mb-[25px] lg:mb-[48px] lg:flex lg:w-full lg:max-w-[1120px] lg:items-center lg:rounded-[20px] lg:border lg:px-8 lg:py-5 lg:shadow-sm">
          <div className="flex w-full items-center gap-2 lg:justify-between">
            <h2 className="text-color-primary text-lg-b md:text-2xl-b">
              경영관리팀
            </h2>
            <button type="button">
              <Dropdown
                optionsKey="edit"
                listAlign="center"
                trigger="set"
                icon={
                  <SettingsIcon className="h-[16px] w-[16px] md:h-[24px] md:w-[24px]" />
                }
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
              <TeamDeleteModal onClose={() => setIsDeleteModalOpen(false)} />
            </Modal>
          </div>
        </header>
        {/* 메인 */}
        <div className="flex gap-[40px]">
          {/* 목록 */}
          <div className="hidden w-[322px] lg:block">
            <h3 className="text-xl-b text-color-primary">내가 한 일</h3>
            <div className="mt-[40px] flex flex-col gap-[55px] overflow-y-auto pr-[52px]">
              <div>
                <h4 className="text-lg-m text-color-primary">2025년 5월</h4>
                <ul className="mt-[17px] flex flex-col gap-1">
                  <li>
                    <button
                      type="button"
                      className="hover:border-brand-primary bg-background-primary border-border-primary flex h-[54px] w-[270px] items-center justify-between rounded-[12px] border-1 px-[20px]"
                    >
                      <span className="text-md-sb text-color-primary">
                        법인 설립
                      </span>
                      <span className="text-md-b text-brand-primary">3개</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="hover:border-brand-primary bg-background-primary border-border-primary flex h-[54px] w-[270px] items-center justify-between rounded-[12px] border-1 px-[20px]"
                    >
                      <span className="text-md-sb text-color-primary">
                        법인 설립
                      </span>
                      <span className="text-md-b text-brand-primary">3개</span>
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg-m text-color-primary">2025년 6월</h4>
                <ul className="mt-[17px] flex flex-col gap-1">
                  <li>
                    <button
                      type="button"
                      className="hover:border-brand-primary bg-background-primary border-border-primary flex h-[54px] w-[270px] items-center justify-between rounded-[12px] border-1 px-[20px]"
                    >
                      <span className="text-md-sb text-color-primary">
                        법인 설립
                      </span>
                      <span className="text-md-b text-brand-primary">3개</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="hover:border-brand-primary bg-background-primary border-border-primary flex h-[54px] w-[270px] items-center justify-between rounded-[12px] border-1 px-[20px]"
                    >
                      <span className="text-md-sb text-color-primary">
                        법인 설립
                      </span>
                      <span className="text-md-b text-brand-primary">3개</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 완료한 task */}
          <div className="bg-background-primary w-full rounded-[20px] px-[22px] pt-[33px] pb-[52px] md:px-[30px] md:pt-[46px] lg:w-[758px]">
            <div className="relative flex items-center justify-center md:justify-start">
              <DatePagination
                variant="myhistory"
                selectedDate={selectedDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
              <div className="absolute right-0">
                <CalendarPicker
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  showCalendar={showCalendar}
                  setShowCalendar={setShowCalendar}
                />
              </div>
            </div>
            <div>
              <ul className="mt-[27px] flex gap-1 md:mt-[40px]">
                <li>
                  <button
                    type="button"
                    className="group bg-background-primary border-border-primary hover:bg-brand-primary hover:border-brand-primary flex h-[33px] items-center gap-1 rounded-[33px] border-1 px-[12px] md:h-[43px] md:rounded-[43px] md:px-[16px]"
                  >
                    <span className="group-hover:text-color-inverse text-color-primary text-sm-m md:text-lg-m">
                      법인 등기
                    </span>
                    <span className="group-hover:text-color-inverse text-color-primary text-md-b md:text-lg-b">
                      3
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="group bg-background-primary border-border-primary hover:bg-brand-primary hover:border-brand-primary flex h-[33px] items-center gap-1 rounded-[33px] border-1 px-[12px] md:h-[43px] md:rounded-[43px] md:px-[16px]"
                  >
                    <span className="group-hover:text-color-inverse text-color-primary text-sm-m md:text-lg-m">
                      법인 등기
                    </span>
                    <span className="group-hover:text-color-inverse text-color-primary text-md-b md:text-lg-b">
                      3
                    </span>
                  </button>
                </li>
              </ul>
            </div>
            <div className="mt-[26px] md:mt-[28px]">
              <MyTasks />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

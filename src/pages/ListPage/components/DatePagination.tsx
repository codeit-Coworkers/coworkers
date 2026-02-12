import React from "react";
import ChevronLeftIcon from "@/assets/arrow-left.svg";
import ChevronRightIcon from "@/assets/arrow-right.svg";

interface DatePaginationProps {
  selectedDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const DatePagination = ({
  selectedDate,
  onPrevMonth,
  onNextMonth,
}: DatePaginationProps) => {
  return (
    <div className="flex items-center gap-1 px-1 py-1 sm:gap-2 sm:px-3 sm:py-1.5">
      <span className="text-sm-sb text-color-primary sm:text-md-sb min-w-[80px] text-center sm:min-w-21.25">
        {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
      </span>

      <div className="ml-1 flex gap-0.5 sm:gap-1">
        <button
          type="button"
          onClick={onPrevMonth}
          className="hover:bg-background-tertiary border-border-primary rounded-4xl border p-0.5 transition-colors sm:p-1"
        >
          <ChevronLeftIcon className="text-icon-primary h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
        <button
          type="button"
          onClick={onNextMonth}
          className="hover:bg-background-tertiary border-border-primary rounded-4xl border p-0.5 transition-colors sm:p-1"
        >
          <ChevronRightIcon className="text-icon-primary h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
};

export default DatePagination;

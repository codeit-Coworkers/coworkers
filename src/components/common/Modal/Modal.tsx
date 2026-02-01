import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import Close from "@/assets/close.svg";
import Alert from "@/assets/alert.svg";

/**
 * Modal 컴포넌트 Props
 *
 * @property {boolean} isOpen - 모달을 화면에 표시할지 여부
 * @property {() => void} onClose - 모달을 닫을 때 호출되는 콜백 함수
 *
 * @property {boolean} [invite=false] - 멤버 초대 모달 표시 여부
 * @property {boolean} [listModal=false] - 할 일 목록 생성 모달 표시 여부
 * @property {boolean} [passwordReset=false] - 비밀번호 재설정 모달 표시 여부
 * @property {boolean} [passwordUpdate=false] - 비밀번호 변경 모달 표시 여부
 * @property {boolean} [danger=false] - 회원 탈퇴(위험) 모달 표시 여부
 * @property {boolean} [logout=false] - 로그아웃 모달 표시 여부
 *
 * ⚠️ 위 플래그들은 **한 번에 하나만 true**가 되도록 사용하는 것을 전제로 합니다.
 */

type ModalProps = {
  isOpen: boolean;
  children?: React.ReactNode;
  onClose: () => void;
  invite?: boolean;
  listModal?: boolean;
  passwordReset?: boolean;
  passwordUpdate?: boolean;
  danger?: boolean;
  logout?: boolean;
};

/**
 * 공용 Modal 컴포넌트 (React + Portal 기반)
 *
 * ## 역할
 * - 화면 최상단에 모달을 표시하기 위한 공용 컴포넌트
 * - `createPortal`을 사용해 DOM 트리 외부(`modalRoot`)에 렌더링됩니다.
 *
 * ## 동작 방식
 * - `isOpen`이 `true`일 때만 렌더링됩니다.
 * - 배경(overlay)을 클릭하면 `onClose`가 호출됩니다.
 * - 모달 내부 클릭 시 `stopPropagation()`으로 닫힘을 방지합니다.
 * - 모달이 열리면 `document.body.style.overflow = "hidden"`으로
 *   **페이지 스크롤을 잠급니다.**
 * - 닫히거나 언마운트되면 스크롤 상태를 복원합니다.
 *
 * ## Portal 구조
 * - 이 컴포넌트는 DOM에 아래와 같은 엘리먼트가 존재해야 정상 동작합니다.
 *
 * @example
 * // index.html
 * <div id="root"></div>
 * <div id="modalRoot"></div>
 *
 * ## 사용 예시
 * @example
 * import { useState } from "react";
 * import Modal from "components/common/Modal";
 *
 * function Example() {
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsOpen(true)}>모달 열기</button>
 *
 *       <Modal
 *         isOpen={isOpen}
 *         onClose={() => setIsOpen(false)}
 *         listModal
 *       />
 *     </>
 *   );
 * }
 *
 * ## 주의사항
 * - 이 컴포넌트는 `document`, `window`에 접근하므로
 *   **브라우저 환경에서만 사용**해야 합니다.
 * - `modalRoot`가 존재하지 않으면 아무 것도 렌더링되지 않습니다.
 * - 여러 플래그가 동시에 `true`가 되지 않도록 상위 로직에서 제어해야 합니다.
 */

export default function Modal({
  isOpen,
  onClose,
  invite = false,
  listModal = false,
  passwordReset = false,
  passwordUpdate = false,
  danger = false,
  logout = false,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      // 모달 오픈 시 스크롤 방지
      document.body.style.overflow = "hidden";
    } else {
      // 모달 닫을 시 스크롤 복원
      document.body.style.overflow = "unset";
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  /** Portal이 마운트될 DOM 노드 */
  const modalRoot = document.getElementById("modalRoot");

  if (!modalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background-primary flex flex-col items-end rounded-t-[24px] p-5 md:items-center md:rounded-[24px]"
      >
        {/* 멤버 초대 / 할 일 목록 모달에서만 닫기 버튼 표시 */}
        {invite || listModal ? (
          <div className="-mb-2 flex w-full justify-end">
            <Close onClick={onClose} className="cursor-pointer" />
          </div>
        ) : null}

        <div className="flex flex-col gap-2 text-center">
          <div className="px-5 py-3">
            {/* 멤버 초대 모달 */}
            {invite ? (
              <>
                <div className="flex flex-col gap-3">
                  <h2 className="text-lg-m text-color-primary">멤버 초대</h2>
                  <p className="text-md-m text-color-disabled md:text-color-primary mb-10">
                    그룹에 참여할 수 있는 링크를 복사합니다.
                  </p>
                </div>
                <button className="bg-brand-primary text-lg-b text-color-inverse h-[48px] w-[280px] rounded-[12px] text-center">
                  링크 복사하기
                </button>
              </>
            ) : null}

            {/* 할 일 목록 모달 */}
            {listModal ? (
              <>
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg-m text-color-primary">할 일 목록</h2>
                  <input
                    type="text"
                    className="placeholder-color-default mb-6 h-[48px] w-full rounded-[12px] border-[1px] border-solid border-[#e2e8f0] p-4"
                    placeholder="목록 명을 입력해주세요."
                  />
                </div>
                <button className="bg-brand-primary text-lg-b text-color-inverse h-[48px] w-[280px] rounded-[12px] text-center">
                  만들기
                </button>
              </>
            ) : null}

            {/* 비밀번호 재설정 모달 */}
            {passwordReset ? (
              <>
                <div className="mt-2 mb-4 flex flex-col gap-2">
                  <h2 className="text-lg-m text-color-primary">
                    비밀번호 재설정
                  </h2>
                  <p className="text-md-m text-color-disabled">
                    비밀번호 재설정 링크를 보내드립니다.
                  </p>
                </div>
                <input
                  type="text"
                  className="placeholder-color-default mt-2 mb-6 h-[48px] w-full rounded-[12px] border-[1px] border-solid border-[#e2e8f0] p-4"
                  placeholder="이메일을 입력하세요."
                />
                <div className="flex flex-row justify-center gap-2">
                  <button
                    onClick={onClose}
                    className="border-brand-primary text-lg-b text-brand-primary h-[48px] w-[135px] rounded-[12px] border-[1px] border-solid text-center"
                  >
                    닫기
                  </button>
                  <button className="bg-brand-primary text-lg-b text-color-inverse h-[48px] w-[135px] rounded-[12px] text-center">
                    링크 보내기
                  </button>
                </div>
              </>
            ) : null}

            {/* 비밀번호 변경하기 모달 */}
            {passwordUpdate ? (
              <>
                <div className="mt-2 flex flex-col">
                  <h2 className="text-lg-m text-color-primary mb-5">
                    비밀번호 변경하기
                  </h2>
                  <div className="mb-5 flex flex-col gap-2 text-left">
                    <label htmlFor="newPassword">새 비밀번호</label>
                    <input
                      id="newPassword"
                      type="text"
                      className="placeholder-color-default h-[48px] w-[280px] rounded-[12px] border-[1px] border-solid border-[#e2e8f0] p-4"
                      placeholder="새 비밀번호를 입력해주세요."
                    />
                  </div>
                  <div className="flex flex-col gap-2 text-left">
                    <label htmlFor="newPassword">새 비밀번호 확인</label>
                    <input
                      id="newPassword"
                      type="text"
                      className="placeholder-color-default mb-6 h-[48px] w-[280px] rounded-[12px] border-[1px] border-solid border-[#e2e8f0] p-4"
                      placeholder="새 비밀번호를 다시 한 번 입력해주세요."
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-center gap-2">
                  <button
                    onClick={onClose}
                    className="border-brand-primary text-lg-b text-brand-primary h-[48px] w-[135px] rounded-[12px] border-[1px] border-solid text-center"
                  >
                    닫기
                  </button>
                  <button className="bg-brand-primary text-lg-b text-color-inverse h-[48px] w-[135px] rounded-[12px] text-center">
                    변경하기
                  </button>
                </div>
              </>
            ) : null}

            {/* 회원 탈퇴 모달 */}
            {danger ? (
              <>
                <div className="mt-2 mb-5 flex w-full justify-center">
                  <Alert />
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  <h2 className="text-lg-m text-color-primary">
                    회원 탈퇴를 진행하시겠어요?
                  </h2>
                  <p className="text-md-r text-color-primary mb-7">
                    그룹장으로 있는 그룹은 자동으로 삭제되고,
                    <br /> 모든 그룹에서 나가집니다.
                  </p>
                </div>
                <div className="flex flex-row justify-center gap-2">
                  <button
                    onClick={onClose}
                    className="text-lg-b text-color-default h-[48px] w-[135px] rounded-[12px] border-[1px] border-solid border-[#cbd5e1] text-center"
                  >
                    닫기
                  </button>
                  <button className="bg-status-danger text-lg-b text-color-inverse h-[48px] w-[135px] rounded-[12px] text-center">
                    회원 탈퇴
                  </button>
                </div>
              </>
            ) : null}

            {/* 로그아웃 모달 */}
            {logout ? (
              <>
                <div className="mt-4 flex flex-col">
                  <h2 className="text-lg-m text-color-primary mb-6">
                    로그아웃 하시겠어요?
                  </h2>
                </div>
                <div className="flex flex-row justify-center gap-2">
                  <button
                    onClick={onClose}
                    className="text-lg-b text-color-default h-[48px] w-[135px] rounded-[12px] border-[1px] border-solid border-[#cbd5e1] text-center"
                  >
                    닫기
                  </button>
                  <button className="bg-status-danger text-lg-b text-color-inverse h-[48px] w-[135px] rounded-[12px] text-center">
                    로그아웃
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    modalRoot,
  );
}

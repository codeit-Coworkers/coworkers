import Modal from "@/components/common/Modal/Modal";
import ModalButton from "@/components/common/Modal/ModalButton";
import { useState } from "react";

/**
 * Modal 컴포넌트 동작을 테스트하기 위한 페이지 컴포넌트
 *
 * ## 목적
 * - 공용 `Modal` 컴포넌트의 UI 및 동작을 로컬에서 빠르게 확인하기 위한 테스트 페이지입니다.
 * - 각 모달 타입(`invite`, `listModal`, `passwordReset` 등)을
 *   boolean props로 전환하며 렌더링 결과를 검증합니다.
 *
 * ## 사용 방법
 * - 아래 Modal props 중 **하나만 `true`**로 설정하여 해당 모달 UI를 확인합니다.
 * - `ModalButton`을 클릭해 모달을 열고,
 *   배경 클릭 또는 닫기 버튼을 통해 정상적으로 닫히는지 확인합니다.
 *
 * @example
 * // 비밀번호 재설정 모달 테스트
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleModalClose}
 *   passwordReset
 * />
 */

export default function TestModal() {
  /** 현재 모달 열림 여부 */
  const [isOpen, setIsOpen] = useState(false);

  /** 모달 열기, 닫기 */
  const handleModalOpen = () => setIsOpen(true);
  const handleModalClose = () => setIsOpen(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4">Modal Test Page</h1>

      {/* 모달을 여는 테스트 버튼 */}
      <ModalButton buttonText="모달 열기" onClick={handleModalOpen} />

      {/*
        공용 Modal 컴포넌트
        - isOpen: 모달 표시 여부
        - onClose: 모달 닫기 콜백
        - 아래 boolean props는 테스트할 모달 타입을 의미함
      */}
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        invite={false}
        listModal={false}
        passwordReset={true}
        passwordUpdate={false}
        danger={false}
        logout={false}
      />
    </div>
  );
}

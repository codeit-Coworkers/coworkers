"use client";

import React, { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";

import {
  useGLTF,
  useProgress,
  Html,
  ContactShadows,
  Environment,
} from "@react-three/drei";

/**
 * 1. GLB 모델 렌더링 컴포넌트
 */
function Model({ url, onOpen }: { url: string; onOpen: () => void }) {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);
  const [active, setActive] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();

      if (!active) {
        // 1. 대기 상태: 뱅글뱅글 회전 + 둥실둥실
        meshRef.current.scale.setScalar(0.1);
        meshRef.current.rotation.y = t * 0.5;
        meshRef.current.position.y = Math.sin(t * 1.5) * 0.3;
      } else {
        // 2. 클릭 후: 확대 및 정면 고정 (기존 확대 로직 유지)
        const currentRotation = meshRef.current.rotation.y;
        const rounds = Math.round(currentRotation / (Math.PI * 2));
        const targetRotation = rounds * (Math.PI * 2) - 0.6;

        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          currentRotation,
          targetRotation,
          0.05,
        );

        // 💡 본(Bone) 직접 제어 애니메이션
        // 1) 앞면 뼈 (앞으로 젖히기)
        const frontBone = meshRef.current.getObjectByName("FolderFront_04");
        if (frontBone) {
          frontBone.rotation.x = THREE.MathUtils.lerp(
            frontBone.rotation.x,
            Math.PI / 40 / 2,
            0.05,
          );
        }

        // 2) 뒷면 뼈 (뒤로 젖히기)
        const backBone = meshRef.current.getObjectByName("FolderBack_05");
        if (backBone) {
          backBone.rotation.x = THREE.MathUtils.lerp(
            backBone.rotation.x,
            -Math.PI,
            0.05,
          );
        }
        const p1 = meshRef.current?.getObjectByName("Paper1_01");
        const p2 = meshRef.current?.getObjectByName("Paper2_02");
        const p3 = meshRef.current?.getObjectByName("Paper3_03");

        const speed = 0.05;

        // 1. Paper1 (부모): 왼쪽으로 -0.5도
        if (p1) {
          p1.rotation.x = THREE.MathUtils.lerp(p1.rotation.x, -3, speed);
        }

        // 2. Paper2 (자식): 부모가 -0.5 갔으므로, 얘는 +0.5를 더해줘야 제자리(0)가 됨
        if (p2) {
          p2.rotation.x = THREE.MathUtils.lerp(p2.rotation.x, -0.3, speed);
        }

        // 3. Paper3 (손자): 부모-자식 관계에 따라 값을 또 보정
        if (p3) {
          p3.rotation.x = THREE.MathUtils.lerp(p3.rotation.x, -2.8, speed);
        }
      }
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!active) {
          setActive(true);
          setTimeout(onOpen, 1000);
        }
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    />
  );
}

/**
 * 2. 로딩 중 표시 UI
 */
function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex w-64 flex-col items-center">
        <div className="text-brand-primary mb-2 text-2xl font-bold">
          {Math.round(progress)}%
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="bg-brand-primary h-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Html>
  );
}

/**
 * 3. 메인 LoadingModel 컴포넌트
 */
export const LoadingModel = ({ onFinish }: { onFinish: () => void }) => {
  return (
    <div className="relative h-full w-full bg-white">
      <Canvas
        shadows
        camera={{ position: [30, 20, 20], fov: 40 }} // 카메라 거리를 조금 조절했습니다.
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <spotLight position={[-10, 10, 10]} intensity={1} />

        <Suspense fallback={<CanvasLoader />}>
          <Environment preset="city" />
          <Model url="/models/icon_folder.glb" onOpen={onFinish} />
          <ContactShadows
            position={[0, -2, 0]} // 그림자 위치 수정
            opacity={0.4}
            scale={20}
            blur={2}
          />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute bottom-24 w-full text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-brand-primary animate-bounce text-lg font-bold"
        >
          폴더를 클릭하여 Coworkers를 시작하세요
        </motion.p>
      </div>
    </div>
  );
};

useGLTF.preload("/models/icon_folder.glb");

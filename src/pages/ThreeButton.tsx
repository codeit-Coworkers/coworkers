"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useState, useRef } from "react";
import { RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";

function Scene() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
      // 0.5는 너무 빠를 수 있어 0.01~0.05 정도로 추천드립니다.
      meshRef.current.rotation.x = scrollY * 0.01;
      meshRef.current.rotation.y = scrollY * 0.01; // 대각선 회전이 더 입체적입니다.
    }
  });

  return (
    <>
      <ambientLight intensity={2} />
      <pointLight position={[100, 100, 100]} intensity={1} />
      <RoundedBox
        ref={meshRef}
        args={[160, 48, 20]}
        radius={8}
        smoothness={4}
        scale={clicked ? 0.95 : hovered ? 1.05 : 1}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
      >
        <meshStandardMaterial
          color={hovered ? "#4F46E5" : "#6366F1"}
          roughness={0.3}
          metalness={0.8}
        />
        <Text position={[0, 0, 11]} fontSize={16} color="white">
          시작하기
        </Text>
      </RoundedBox>
    </>
  );
}

export const ThreeButton = () => {
  return (
    // ✅ 외부 컨테이너를 원하는 픽셀 크기로 고정
    <div className="h-[48px] w-[160px]">
      <Canvas
        orthographic // ✅ 원근감 제거 (중요!)
        camera={{
          left: -80, // 가로 160의 절반 (왼쪽)
          right: 80, // 가로 160의 절반 (오른쪽)
          top: 24, // 세로 48의 절반 (위)
          bottom: -24, // 세로 48의 절반 (아래)
          near: 0.1,
          far: 100,
          position: [0, 0, 100],
        }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

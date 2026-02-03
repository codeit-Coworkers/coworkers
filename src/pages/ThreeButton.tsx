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
      meshRef.current.rotation.x = scrollY * 0.01;
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
        {/* 폰트가 깨진다면 기본 폰트를 사용하거나 폰트 경로를 지정하세요 */}
        <Text position={[0, 0, 11]} fontSize={16} color="white">
          시작하기
        </Text>
      </RoundedBox>
    </>
  );
}

/**
 * 3D 시작하기 버튼 컴포넌트
 */
export const ThreeButton = () => {
  return (
    <div className="h-[48px] w-[160px]">
      <Canvas
        orthographic
        camera={{
          left: -80,
          right: 80,
          top: 24,
          bottom: -24,
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

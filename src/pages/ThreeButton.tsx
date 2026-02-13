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
      const width = typeof window !== "undefined" ? window.innerWidth : 1024;

      let speedFactor = 0.01;

      if (width < 768) {
        speedFactor = 0.009;
      } else if (width < 1024) {
        speedFactor = 0.2;
      } else {
        speedFactor = 0.0086;
      }

      meshRef.current.rotation.x = scrollY * speedFactor;
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

/**
 * 3D 시작하기 버튼 컴포넌트
 */
export const ThreeButton = () => {
  return (
    //h-[48px] w-[160px]
    <div className="relative mx-auto h-[80px] w-[200px]">
      <Canvas
        orthographic
        camera={{
          // 💡 2. 카메라가 보는 범위를 버튼 크기(160x48)보다 넓게 잡습니다.
          left: -100,
          right: 100,
          top: 40,
          bottom: -40,
          near: 0.1,
          far: 1000, // 여유 있게 1000
          position: [0, 0, 100],
        }}
        gl={{ alpha: true, antialias: true }}
        // 💡 3. 스타일로 캔버스가 부모를 꽉 채우게 강제합니다.
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

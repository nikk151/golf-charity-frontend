// src/components/3d/HeroScene.jsx
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshDistortMaterial, Float } from '@react-three/drei';

// This is the actual 3D object we animate
const AbstractShape = () => {
  const meshRef = useRef();

  useFrame((state) => {
    // Slowly rotate the object over time
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} scale={1.8}>
        {/* An abstract sphere format */}
        <icosahedronGeometry args={[1, 1]} />
        {/* A premium glass/distorted material */}
        <MeshDistortMaterial
          color="#d6b052" // Our champagne gold
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
};

const HeroScene = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#0f3d30" />
        
        <AbstractShape />
        
        {/* Provides realistic reflections for a polished look */}
        <Environment preset="city" /> 
      </Canvas>
    </div>
  );
};

export default HeroScene;

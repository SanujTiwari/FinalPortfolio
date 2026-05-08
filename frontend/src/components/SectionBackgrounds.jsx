import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Box } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Morphing Blob ───────────────────────────────────────── */
function MorphBlob({ position = [0, 0, 0], color = '#e58c56', size = 1 }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.2;
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
      <Sphere ref={ref} args={[size, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          roughness={0.3}
          metalness={0.8}
          wireframe
          transparent
          opacity={0.15}
          distort={0.4}
          speed={3}
        />
      </Sphere>
    </Float>
  );
}

/* ─── Rotating Cube Grid ──────────────────────────────────── */
function CubeGrid({ color = '#e58c56' }) {
  const group = useRef();
  
  const cubes = useMemo(() => {
    const items = [];
    for (let x = -2; x <= 2; x++) {
      for (let y = -2; y <= 2; y++) {
        if (Math.random() > 0.4) {
          items.push({
            position: [x * 1.5, y * 1.5, -3 + Math.random() * 2],
            scale: 0.1 + Math.random() * 0.25,
            speed: 0.2 + Math.random() * 0.5,
            offset: Math.random() * Math.PI * 2,
          });
        }
      }
    }
    return items;
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <group ref={group}>
      {cubes.map((cube, i) => (
        <FloatingCube key={i} {...cube} color={color} />
      ))}
    </group>
  );
}

function FloatingCube({ position, scale, speed, offset, color }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + offset;
      ref.current.rotation.x = t;
      ref.current.rotation.y = t * 0.7;
      ref.current.position.y = position[1] + Math.sin(t) * 0.3;
    }
  });

  return (
    <Box ref={ref} args={[scale, scale, scale]} position={position}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        wireframe
        transparent
        opacity={0.2}
      />
    </Box>
  );
}

/* ─── Clean Geometric Shape ─────────────────────────────────── */
function SimpleGeometry({ color = '#e58c56' }) {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
      ref.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={ref} scale={1.5}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

/* ─── Exported Section 3D Backgrounds ─────────────────────── */
export function SkillsBackground({ color = '#e58c56' }) {
  return (
    <div className="section-3d-bg">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color={color} />
        <CubeGrid color={color} />
      </Canvas>
    </div>
  );
}

export function ProjectsBackground({ color = '#e58c56' }) {
  return (
    <div className="section-3d-bg">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color={color} />
        <MorphBlob position={[-3, 2, -2]} color={color} size={1.5} />
        <MorphBlob position={[4, -1, -3]} color={color} size={1.2} />
      </Canvas>
    </div>
  );
}

export function AboutBackground({ color = '#e58c56' }) {
  return (
    <div className="section-3d-bg">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color={color} />
        <SimpleGeometry color={color} />
      </Canvas>
    </div>
  );
}

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere, Torus, Icosahedron, Octahedron, TorusKnot } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Floating Icosahedron (Main centerpiece) ──────────────── */
function CrystalShape({ color = '#e58c56' }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <Icosahedron ref={meshRef} args={[2.2, 1]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.2}
          metalness={0.9}
          wireframe
          distort={0.25}
          speed={3}
          transparent
          opacity={0.6}
        />
      </Icosahedron>
    </Float>
  );
}

/* ─── Orbiting Rings ──────────────────────────────────────── */
function OrbitRing({ radius = 3.5, color = '#e58c56', speed = 1, tilt = 0 }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed * 0.3;
      ref.current.rotation.x = tilt + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Torus ref={ref} args={[radius, 0.02, 16, 100]} rotation={[tilt, 0, 0]}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </Torus>
  );
}

/* ─── Orbiting Spheres (Mini planets) ─────────────────────── */
function OrbitingSphere({ radius = 3.5, size = 0.12, color = '#e58c56', speed = 1, offset = 0 }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + offset;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.y = Math.sin(t) * radius * 0.4;
      ref.current.position.z = Math.sin(t) * radius * 0.6;
    }
  });

  return (
    <Sphere ref={ref} args={[size, 16, 16]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        roughness={0.1}
        metalness={0.8}
      />
    </Sphere>
  );
}

/* ─── Floating Grid Dots ──────────────────────────────────── */
function GridDots({ color = '#e58c56' }) {
  const ref = useRef();
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.04}
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ─── Small Floating Decorations ──────────────────────────── */
function FloatingDecor({ color = '#e58c56' }) {
  const oct1 = useRef();
  const oct2 = useRef();
  const torus1 = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (oct1.current) {
      oct1.current.rotation.x = t * 0.4;
      oct1.current.rotation.y = t * 0.3;
      oct1.current.position.y = 3 + Math.sin(t) * 0.5;
    }
    if (oct2.current) {
      oct2.current.rotation.x = t * 0.3;
      oct2.current.rotation.z = t * 0.5;
      oct2.current.position.y = -2.5 + Math.cos(t * 0.8) * 0.4;
    }
    if (torus1.current) {
      torus1.current.rotation.x = t * 0.5;
      torus1.current.rotation.y = t * 0.2;
    }
  });

  return (
    <>
      <Octahedron ref={oct1} args={[0.3]} position={[-4, 3, -2]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          wireframe
          transparent
          opacity={0.5}
        />
      </Octahedron>

      <Octahedron ref={oct2} args={[0.25]} position={[4.5, -2.5, -1]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          wireframe
          transparent
          opacity={0.4}
        />
      </Octahedron>

      <TorusKnot ref={torus1} args={[0.4, 0.12, 64, 8]} position={[5, 2, -3]}>
        <MeshWobbleMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          wireframe
          transparent
          opacity={0.3}
          factor={0.5}
          speed={2}
        />
      </TorusKnot>
    </>
  );
}

/* ─── Main Hero 3D Scene ──────────────────────────────────── */
export default function HeroScene({ accentColor = '#e58c56' }) {
  return (
    <div className="hero-3d-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color={accentColor} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ffffff" />
        <spotLight
          position={[0, 5, 5]}
          angle={0.3}
          penumbra={0.8}
          intensity={0.5}
          color={accentColor}
        />

        <CrystalShape color={accentColor} />
        <OrbitRing radius={3.5} color={accentColor} speed={0.8} tilt={Math.PI * 0.15} />
        <OrbitRing radius={4.2} color={accentColor} speed={-0.5} tilt={Math.PI * 0.35} />
        <OrbitRing radius={3} color={accentColor} speed={0.6} tilt={Math.PI * 0.55} />

        <OrbitingSphere radius={3.5} size={0.1} color={accentColor} speed={0.6} offset={0} />
        <OrbitingSphere radius={4.2} size={0.08} color={accentColor} speed={-0.4} offset={Math.PI} />
        <OrbitingSphere radius={3} size={0.12} color={accentColor} speed={0.8} offset={Math.PI / 2} />

        <GridDots color={accentColor} />
        <FloatingDecor color={accentColor} />
      </Canvas>
    </div>
  );
}

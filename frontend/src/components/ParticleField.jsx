import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 1500, color = '#e58c56' }) {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.002 + Math.random() / 500;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -30 + Math.random() * 60;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((data, i) => {
      data.t += data.speed;
      const { t, factor, xFactor, yFactor, zFactor } = data;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      
      dummy.position.set(
        xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      
      const s = Math.cos(t) * 0.3 + 0.1;
      dummy.scale.set(s, s, s);
      dummy.rotation.set(a * 2, b * 2, a * b);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.15, 6, 6]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.4}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

function FloatingLines({ count = 30, color = '#e58c56' }) {
  const lines = useRef([]);
  
  const lineData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const points = [];
      const startX = -60 + Math.random() * 120;
      const startY = -60 + Math.random() * 120;
      const startZ = -20 + Math.random() * 40;
      
      for (let j = 0; j < 8; j++) {
        points.push(new THREE.Vector3(
          startX + j * (Math.random() * 4 - 2),
          startY + j * (Math.random() * 4 - 2),
          startZ + j * (Math.random() * 2 - 1)
        ));
      }
      
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 20, 0.02, 4, false);
      data.push({
        geometry,
        speed: 0.001 + Math.random() * 0.003,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, [count]);

  useFrame((state) => {
    lines.current.forEach((line, i) => {
      if (line) {
        const d = lineData[i];
        line.rotation.x = Math.sin(state.clock.elapsedTime * d.speed + d.offset) * 0.1;
        line.rotation.y = Math.cos(state.clock.elapsedTime * d.speed + d.offset) * 0.1;
      }
    });
  });

  return (
    <group>
      {lineData.map((d, i) => (
        <mesh
          key={i}
          ref={(el) => (lines.current[i] = el)}
          geometry={d.geometry}
        >
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ParticleField({ accentColor = '#e58c56' }) {
  return (
    <div className="particle-field-container">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: false, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <Particles count={1200} color={accentColor} />
        <FloatingLines count={20} color={accentColor} />
      </Canvas>
    </div>
  );
}

"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  ContactShadows,
  MeshReflectorMaterial,
} from "@react-three/drei";
import * as THREE from "three";

// ─── Helpers ────────────────────────────────────────────────────────

/** Mirror a 2D shape along X to make symmetric halves, extruded along Z */
function createExtrudedBody(
  points: [number, number][],
  depth: number,
  bevelRadius = 0.06,
) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevelRadius,
    bevelSize: bevelRadius,
    bevelSegments: 4,
    curveSegments: 12,
  });
}

function createSmoothBody(depth: number, bevelRadius = 0.08) {
  const shape = new THREE.Shape();

  // -- Side-profile of a modern sedan (x = length, y = height) --
  // Origin is roughly the rear-bottom of the car.
  // We draw clockwise starting from rear-bottom.

  // Bottom edge (flat underside with wheel-arch cutouts)
  shape.moveTo(0.0, 0.15); // rear-bottom
  shape.lineTo(0.15, 0.0); // small rear undercut
  // rear wheel arch
  shape.lineTo(0.5, 0.0);
  shape.quadraticCurveTo(0.7, 0.35, 0.9, 0.35);
  shape.quadraticCurveTo(1.1, 0.35, 1.3, 0.0);
  // flat bottom between arches
  shape.lineTo(2.9, 0.0);
  // front wheel arch
  shape.quadraticCurveTo(3.1, 0.35, 3.3, 0.35);
  shape.quadraticCurveTo(3.5, 0.35, 3.7, 0.0);
  shape.lineTo(4.05, 0.0);
  shape.lineTo(4.2, 0.15); // front undercut

  // Front face going up
  shape.quadraticCurveTo(4.25, 0.3, 4.25, 0.45); // front bumper curve
  shape.lineTo(4.22, 0.55); // nose

  // Hood — slight slope upward to base of windshield
  shape.quadraticCurveTo(4.0, 0.62, 3.5, 0.68);
  shape.lineTo(2.95, 0.72);

  // A-pillar / windshield
  shape.quadraticCurveTo(2.75, 0.85, 2.6, 1.15);

  // Roof
  shape.quadraticCurveTo(2.4, 1.28, 2.1, 1.32);
  shape.lineTo(1.4, 1.32);
  shape.quadraticCurveTo(1.1, 1.3, 0.95, 1.18);

  // C-pillar / rear window
  shape.quadraticCurveTo(0.75, 0.95, 0.65, 0.78);

  // Trunk deck
  shape.lineTo(0.3, 0.72);
  shape.quadraticCurveTo(0.12, 0.7, 0.05, 0.6);

  // Rear face going down
  shape.quadraticCurveTo(0.0, 0.45, 0.0, 0.15);

  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevelRadius,
    bevelSize: bevelRadius,
    bevelSegments: 5,
    curveSegments: 16,
  });
}

function createGlassShape() {
  // Greenhouse (windows) side-profile
  const shape = new THREE.Shape();

  // Windshield base
  shape.moveTo(2.9, 0.74);
  // Up the windshield
  shape.quadraticCurveTo(2.72, 0.87, 2.58, 1.12);
  // Forward along roof edge
  shape.quadraticCurveTo(2.4, 1.24, 2.1, 1.27);
  shape.lineTo(1.42, 1.27);
  // Rear roof curve into C-pillar
  shape.quadraticCurveTo(1.15, 1.25, 1.0, 1.15);
  // Down C-pillar / rear window
  shape.quadraticCurveTo(0.82, 0.97, 0.72, 0.8);
  // Trunk top
  shape.lineTo(0.72, 0.76);
  // Along beltline back to start
  shape.lineTo(2.9, 0.74);

  return shape;
}

// ─── Car body component ─────────────────────────────────────────────

function CarBody({ color }: { color: string }) {
  const carWidth = 1.7;

  const bodyGeo = useMemo(() => {
    const geo = createSmoothBody(carWidth, 0.08);
    // Center the extrusion along Z
    geo.translate(0, 0, -carWidth / 2);
    // Center along X
    geo.translate(-2.1, 0, 0);
    return geo;
  }, []);

  // Glass side panels
  const glassShape = useMemo(() => createGlassShape(), []);
  const glassGeo = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(glassShape, {
      depth: carWidth + 0.04, // slightly wider than body
      bevelEnabled: false,
      curveSegments: 16,
    });
    geo.translate(-2.1, 0, -(carWidth + 0.04) / 2);
    return geo;
  }, [glassShape]);

  // Windshield (front glass)
  const windshieldGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.78, 0.74);
    shape.lineTo(0.78, 0.74);
    shape.lineTo(0.65, 1.12);
    shape.quadraticCurveTo(0, 1.18, -0.65, 1.12);
    shape.closePath();
    const geo = new THREE.ShapeGeometry(shape, 12);
    return geo;
  }, []);

  // Rear window
  const rearWindowGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.72, 0.78);
    shape.lineTo(0.72, 0.78);
    shape.lineTo(0.62, 1.1);
    shape.quadraticCurveTo(0, 1.16, -0.62, 1.1);
    shape.closePath();
    const geo = new THREE.ShapeGeometry(shape, 12);
    return geo;
  }, []);

  const paintMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.75,
        roughness: 0.18,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        envMapIntensity: 1.2,
      }),
    [color],
  );

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#88bbee",
        metalness: 0.05,
        roughness: 0.05,
        transmission: 0.85,
        transparent: true,
        opacity: 0.35,
        ior: 1.5,
        thickness: 0.05,
      }),
    [],
  );

  const chromeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#dddddd",
        metalness: 0.98,
        roughness: 0.05,
      }),
    [],
  );

  const darkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#111111",
        metalness: 0.4,
        roughness: 0.6,
      }),
    [],
  );

  return (
    <group>
      {/* ── Main body shell ── */}
      <mesh geometry={bodyGeo} material={paintMat} castShadow receiveShadow />

      {/* ── Glass greenhouse (side windows) ── */}
      <mesh geometry={glassGeo} material={glassMat} />

      {/* ── Windshield ── */}
      <group position={[2.9 - 2.1, 0, 0]} rotation={[0, 0, 0]}>
        <mesh
          geometry={windshieldGeo}
          material={glassMat}
          position={[0, 0, 0]}
          rotation={[0.35, Math.PI / 2, 0]}
        />
      </group>

      {/* ── Rear window ── */}
      <group position={[0.72 - 2.1, 0, 0]}>
        <mesh
          geometry={rearWindowGeo}
          material={glassMat}
          rotation={[-0.3, Math.PI / 2, 0]}
        />
      </group>

      {/* ── Headlights ── */}
      <mesh position={[2.1, 0.48, 0.72]} castShadow>
        <boxGeometry args={[0.22, 0.1, 0.28]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffdd"
          emissiveIntensity={2}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[2.1, 0.48, -0.72]} castShadow>
        <boxGeometry args={[0.22, 0.1, 0.28]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffdd"
          emissiveIntensity={2}
          roughness={0.1}
        />
      </mesh>
      {/* Headlight chrome bezels */}
      <mesh position={[2.16, 0.48, 0.72]}>
        <boxGeometry args={[0.02, 0.14, 0.32]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>
      <mesh position={[2.16, 0.48, -0.72]}>
        <boxGeometry args={[0.02, 0.14, 0.32]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>

      {/* ── DRL strips ── */}
      <mesh position={[2.14, 0.38, 0.72]}>
        <boxGeometry args={[0.04, 0.02, 0.26]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ccddff"
          emissiveIntensity={3}
        />
      </mesh>
      <mesh position={[2.14, 0.38, -0.72]}>
        <boxGeometry args={[0.04, 0.02, 0.26]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ccddff"
          emissiveIntensity={3}
        />
      </mesh>

      {/* ── Taillights ── */}
      <mesh position={[-2.08, 0.52, 0.72]}>
        <boxGeometry args={[0.08, 0.12, 0.3]} />
        <meshStandardMaterial
          color="#cc0000"
          emissive="#ff0000"
          emissiveIntensity={1.5}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-2.08, 0.52, -0.72]}>
        <boxGeometry args={[0.08, 0.12, 0.3]} />
        <meshStandardMaterial
          color="#cc0000"
          emissive="#ff0000"
          emissiveIntensity={1.5}
          roughness={0.2}
        />
      </mesh>
      {/* Taillight connecting strip */}
      <mesh position={[-2.09, 0.52, 0]}>
        <boxGeometry args={[0.04, 0.03, 1.1]} />
        <meshStandardMaterial
          color="#cc0000"
          emissive="#ff0000"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* ── Front grille ── */}
      <mesh position={[2.14, 0.32, 0]}>
        <boxGeometry args={[0.06, 0.18, 1.0]} />
        <primitive object={darkMat} attach="material" />
      </mesh>
      {/* Grille chrome surround */}
      <mesh position={[2.15, 0.32, 0]}>
        <boxGeometry args={[0.02, 0.22, 1.08]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>
      {/* Grille horizontal slats */}
      {[-0.04, 0, 0.04].map((yOff, i) => (
        <mesh key={i} position={[2.16, 0.32 + yOff, 0]}>
          <boxGeometry args={[0.01, 0.015, 0.9]} />
          <primitive object={chromeMat} attach="material" />
        </mesh>
      ))}

      {/* ── Front bumper lower intake ── */}
      <mesh position={[2.12, 0.12, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.7]} />
        <primitive object={darkMat} attach="material" />
      </mesh>

      {/* ── Fog lights ── */}
      <mesh position={[2.12, 0.14, 0.5]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color="#ffff88"
          emissive="#ffff44"
          emissiveIntensity={1}
        />
      </mesh>
      <mesh position={[2.12, 0.14, -0.5]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color="#ffff88"
          emissive="#ffff44"
          emissiveIntensity={1}
        />
      </mesh>

      {/* ── Side mirrors ── */}
      <group position={[0.75, 0.75, 0.92]}>
        {/* Mirror arm */}
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.06, 0.04, 0.1]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.7}
            roughness={0.2}
            clearcoat={1}
          />
        </mesh>
        {/* Mirror housing */}
        <mesh position={[0, 0, 0.14]}>
          <boxGeometry args={[0.12, 0.08, 0.06]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.7}
            roughness={0.2}
            clearcoat={1}
          />
        </mesh>
        {/* Mirror glass */}
        <mesh position={[0.01, 0, 0.175]}>
          <planeGeometry args={[0.09, 0.06]} />
          <meshStandardMaterial
            color="#aaccee"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      </group>
      <group position={[0.75, 0.75, -0.92]} scale={[1, 1, -1]}>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.06, 0.04, 0.1]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.7}
            roughness={0.2}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[0, 0, 0.14]}>
          <boxGeometry args={[0.12, 0.08, 0.06]} />
          <meshPhysicalMaterial
            color={color}
            metalness={0.7}
            roughness={0.2}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[0.01, 0, 0.175]}>
          <planeGeometry args={[0.09, 0.06]} />
          <meshStandardMaterial
            color="#aaccee"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      </group>

      {/* ── Door handles (chrome) ── */}
      <mesh position={[0.15, 0.6, 0.92]}>
        <boxGeometry args={[0.12, 0.025, 0.02]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>
      <mesh position={[-0.65, 0.6, 0.92]}>
        <boxGeometry args={[0.12, 0.025, 0.02]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>
      <mesh position={[0.15, 0.6, -0.92]}>
        <boxGeometry args={[0.12, 0.025, 0.02]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>
      <mesh position={[-0.65, 0.6, -0.92]}>
        <boxGeometry args={[0.12, 0.025, 0.02]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>

      {/* ── Beltline chrome trim ── */}
      <mesh position={[0.0, 0.73, 0.9]}>
        <boxGeometry args={[3.0, 0.015, 0.01]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>
      <mesh position={[0.0, 0.73, -0.9]}>
        <boxGeometry args={[3.0, 0.015, 0.01]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>

      {/* ── License plate (rear) ── */}
      <mesh position={[-2.1, 0.32, 0]}>
        <boxGeometry args={[0.02, 0.1, 0.3]} />
        <meshStandardMaterial color="#eeeeee" roughness={0.4} />
      </mesh>
      {/* ── License plate (front) ── */}
      <mesh position={[2.16, 0.22, 0]}>
        <boxGeometry args={[0.02, 0.08, 0.25]} />
        <meshStandardMaterial color="#eeeeee" roughness={0.4} />
      </mesh>

      {/* ── Exhaust tips ── */}
      <mesh position={[-2.08, 0.06, 0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.1, 16]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>
      <mesh position={[-2.08, 0.06, -0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.1, 16]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>

      {/* ── Roof antenna (shark fin) ── */}
      <mesh position={[-0.6, 1.38, 0]} castShadow>
        <coneGeometry args={[0.04, 0.12, 8]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.5}
          roughness={0.3}
          clearcoat={1}
        />
      </mesh>
    </group>
  );
}

// ─── Wheel assembly ─────────────────────────────────────────────────

function Wheel({ position }: { position: [number, number, number] }) {
  const tireGeo = useMemo(() => new THREE.TorusGeometry(0.3, 0.13, 20, 40), []);
  const tireMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a1a1a",
        roughness: 0.92,
        metalness: 0.05,
      }),
    [],
  );

  // Outer rim ring
  const rimGeo = useMemo(() => new THREE.TorusGeometry(0.25, 0.03, 12, 40), []);
  const rimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d0d0d0",
        metalness: 0.97,
        roughness: 0.05,
      }),
    [],
  );

  // Hub cap
  const hubGeo = useMemo(
    () => new THREE.CylinderGeometry(0.07, 0.07, 0.22, 20),
    [],
  );

  // Disc face
  const discGeo = useMemo(
    () => new THREE.CylinderGeometry(0.24, 0.24, 0.02, 32),
    [],
  );
  const discMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#888888",
        metalness: 0.9,
        roughness: 0.15,
      }),
    [],
  );

  // Brake disc visible behind spokes
  const brakeGeo = useMemo(
    () => new THREE.CylinderGeometry(0.2, 0.2, 0.03, 32),
    [],
  );
  const brakeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#555555",
        metalness: 0.8,
        roughness: 0.3,
      }),
    [],
  );

  // Brake caliper
  const caliperMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#cc0000",
        metalness: 0.6,
        roughness: 0.3,
      }),
    [],
  );

  const spokeCount = 7;

  return (
    <group position={position}>
      {/* Tire */}
      <mesh
        geometry={tireGeo}
        material={tireMat}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      />
      {/* Tire sidewall detail — inner ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.02, 8, 40]} />
        <meshStandardMaterial color="#222222" roughness={0.95} />
      </mesh>

      {/* Outer rim ring */}
      <mesh
        geometry={rimGeo}
        material={rimMat}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* Brake disc */}
      <mesh
        geometry={brakeGeo}
        material={brakeMat}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* Brake caliper */}
      <mesh position={[0.15, -0.08, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.06, 0.04, 0.08]} />
        <primitive object={caliperMat} attach="material" />
      </mesh>

      {/* Rim face */}
      <mesh
        geometry={discGeo}
        material={discMat}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0.01]}
      />

      {/* Hub center */}
      <mesh
        geometry={hubGeo}
        material={rimMat}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* Hub logo circle */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
        <meshStandardMaterial
          color="#cccccc"
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>

      {/* Multi-spoke rim */}
      {Array.from({ length: spokeCount }).map((_, i) => {
        const angle = (i * Math.PI * 2) / spokeCount;
        return (
          <group key={i} rotation={[Math.PI / 2, angle, 0]}>
            {/* Main spoke */}
            <mesh position={[0, 0.02, 0.14]}>
              <boxGeometry args={[0.025, 0.04, 0.2]} />
              <primitive object={rimMat} attach="material" />
            </mesh>
            {/* Spoke accent */}
            <mesh position={[0, 0.04, 0.14]}>
              <boxGeometry args={[0.015, 0.005, 0.18]} />
              <meshStandardMaterial
                color="#eeeeee"
                metalness={0.98}
                roughness={0.02}
              />
            </mesh>
          </group>
        );
      })}

      {/* Lug nuts */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 5;
        const x = Math.cos(angle) * 0.05;
        const y = Math.sin(angle) * 0.05;
        return (
          <mesh
            key={`lug-${i}`}
            position={[x, 0.12, y]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.008, 0.008, 0.02, 8]} />
            <meshStandardMaterial
              color="#aaaaaa"
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Scene helpers ──────────────────────────────────────────────────

function AutoRotate({
  groupRef,
  autoRotate,
}: {
  groupRef: React.RefObject<THREE.Group | null>;
  autoRotate: boolean;
}) {
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });
  return null;
}

function CarScene({
  color,
  autoRotate,
}: {
  color: string;
  autoRotate: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[8, 10, 6]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-6, 6, -4]} intensity={0.4} />
      <spotLight
        position={[0, 12, 0]}
        angle={0.25}
        penumbra={1}
        intensity={0.6}
      />
      {/* Rim light from behind for highlights */}
      <pointLight position={[-4, 2, 0]} intensity={0.3} color="#aaccff" />

      <group ref={groupRef} position={[0, -0.45, 0]}>
        <CarBody color={color} />
        <Wheel position={[1.2, 0.35, 0.92]} />
        <Wheel position={[1.2, 0.35, -0.92]} />
        <Wheel position={[-1.0, 0.35, 0.92]} />
        <Wheel position={[-1.0, 0.35, -0.92]} />
      </group>

      <AutoRotate groupRef={groupRef} autoRotate={autoRotate} />

      <ContactShadows
        position={[0, -0.88, 0]}
        opacity={0.6}
        scale={14}
        blur={2.5}
        far={4}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.88, 0]}>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          mirror={0.5}
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          color="#0a0a0a"
          metalness={0.7}
          roughness={1}
        />
      </mesh>

      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={3}
        maxDistance={10}
        autoRotate={false}
        dampingFactor={0.08}
        enableDamping
      />
    </>
  );
}

// ─── Paint colors ───────────────────────────────────────────────────

const paintColors = [
  { name: "Super White", hex: "#f5f5f5" },
  { name: "Attitude Black", hex: "#1a1a1a" },
  { name: "Silver Metallic", hex: "#c0c0c0" },
  { name: "Toyota Red", hex: "#cc0000" },
  { name: "Alumina Jade", hex: "#6b8e6b" },
  { name: "Celestite Gray", hex: "#8a9aaa" },
  { name: "Blueprint", hex: "#1a3a5c" },
  { name: "Oxide Bronze", hex: "#8b6914" },
  { name: "Wind Chill Pearl", hex: "#e8e4df" },
  { name: "Midnight Purple", hex: "#3d1f56" },
  { name: "Inferno Orange", hex: "#c44200" },
  { name: "Lunar Rock", hex: "#a0a090" },
];

const wheelFinishes = [
  { name: "Silver", hex: "#cccccc" },
  { name: "Gunmetal", hex: "#444444" },
  { name: "Black", hex: "#1a1a1a" },
  { name: "Gold", hex: "#c4a240" },
];

// ─── Exported viewer component ──────────────────────────────────────

interface CarModel3DProps {
  initialColor?: string;
  carName?: string;
  onClose?: () => void;
}

export function CarModel3D({
  initialColor = "#cc0000",
  carName = "Car",
  onClose,
}: CarModel3DProps) {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showCustomize, setShowCustomize] = useState(false);

  const currentPaint = paintColors.find((p) => p.hex === selectedColor) ?? null;

  return (
    <div className="flex h-full flex-col bg-black/95">
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-2">
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
          >
            &larr; Back
          </button>
        )}
        <h2 className="text-sm font-bold text-white">{carName}</h2>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            autoRotate ? "bg-white/20 text-white" : "bg-white/10 text-white/60"
          }`}
        >
          {autoRotate ? "Auto-spin ON" : "Auto-spin OFF"}
        </button>
      </div>

      {/* 3D Canvas */}
      <div className="relative flex-1">
        <Canvas
          shadows
          camera={{ position: [5, 2.5, 5], fov: 40 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
        >
          <CarScene color={selectedColor} autoRotate={autoRotate} />
        </Canvas>

        <div className="pointer-events-none absolute right-0 bottom-3 left-0 text-center text-[11px] text-white/40">
          Drag to rotate &bull; Pinch to zoom
        </div>
      </div>

      {/* Bottom customization panel */}
      <div className="shrink-0 bg-black/80 px-4 pt-3 pb-4 backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full border border-white/20"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="text-xs font-medium text-white/80">
              {currentPaint?.name ?? "Custom Color"}
            </span>
          </div>
          <button
            onClick={() => setShowCustomize(!showCustomize)}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
          >
            {showCustomize ? "Hide Options" : "Customize"}
          </button>
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {paintColors.map((p) => (
            <button
              key={p.hex}
              onClick={() => setSelectedColor(p.hex)}
              title={p.name}
              className={`h-8 w-8 shrink-0 rounded-full border-2 transition-all ${
                selectedColor === p.hex
                  ? "scale-110 border-white"
                  : "border-white/20 hover:border-white/50"
              }`}
              style={{ backgroundColor: p.hex }}
            />
          ))}
        </div>

        {showCustomize && (
          <div className="mt-3 space-y-3 border-t border-white/10 pt-3">
            <div>
              <p className="mb-1.5 text-[11px] font-medium text-white/50">
                Paint Finish
              </p>
              <div className="flex gap-2">
                {["Metallic", "Matte", "Gloss", "Pearl"].map((finish) => (
                  <button
                    key={finish}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/80 transition-colors hover:bg-white/20"
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-medium text-white/50">
                Wheel Finish
              </p>
              <div className="flex gap-2">
                {wheelFinishes.map((w) => (
                  <button
                    key={w.hex}
                    className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/80 transition-colors hover:bg-white/20"
                  >
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: w.hex }}
                    />
                    {w.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-medium text-white/50">
                Window Tint
              </p>
              <div className="flex gap-2">
                {["None", "Light", "Medium", "Dark", "Limo"].map((tint) => (
                  <button
                    key={tint}
                    className="rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/80 transition-colors hover:bg-white/20"
                  >
                    {tint}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

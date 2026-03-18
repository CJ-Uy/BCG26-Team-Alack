"use client";

import React, { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// ─── Error boundary ─────────────────────────────────────────────────

class Canvas3DErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ─── Shape helpers ──────────────────────────────────────────────────
// Side-profile shape for a cute chubby sedan.
// X = length direction, Y = height. Extruded along Z for width.
// Origin at center-bottom of the car.

function makeBodyProfile() {
  const s = new THREE.Shape();

  // Start at rear-bottom, go clockwise
  // Rear underside
  s.moveTo(-1.55, 0.12);
  s.quadraticCurveTo(-1.65, 0.06, -1.6, 0.0);
  // Flat bottom (with wheel-arch cutouts)
  // rear arch — peaks at 0.34 to clear the tire tops
  s.lineTo(-1.25, 0.0);
  s.quadraticCurveTo(-1.05, 0.34, -0.85, 0.34);
  s.quadraticCurveTo(-0.65, 0.34, -0.45, 0.0);
  // mid bottom
  s.lineTo(0.45, 0.0);
  // front arch
  s.quadraticCurveTo(0.65, 0.34, 0.85, 0.34);
  s.quadraticCurveTo(1.05, 0.34, 1.25, 0.0);
  // front underside
  s.lineTo(1.6, 0.0);
  s.quadraticCurveTo(1.65, 0.06, 1.55, 0.12);

  // Front face — rounded nose
  s.quadraticCurveTo(1.72, 0.2, 1.72, 0.35);

  // Hood — gentle upward slope
  s.quadraticCurveTo(1.65, 0.46, 1.3, 0.52);
  s.lineTo(0.9, 0.56);

  // Windshield — steep but rounded
  s.quadraticCurveTo(0.75, 0.65, 0.6, 0.9);

  // Roof — nice dome
  s.quadraticCurveTo(0.45, 1.04, 0.15, 1.08);
  s.lineTo(-0.35, 1.08);
  s.quadraticCurveTo(-0.6, 1.06, -0.75, 0.95);

  // Rear window — smooth slope
  s.quadraticCurveTo(-0.9, 0.8, -1.05, 0.65);

  // Trunk
  s.lineTo(-1.3, 0.58);
  s.quadraticCurveTo(-1.45, 0.55, -1.55, 0.48);

  // Rear face down
  s.quadraticCurveTo(-1.68, 0.38, -1.68, 0.25);
  s.quadraticCurveTo(-1.65, 0.15, -1.55, 0.12);

  return s;
}

function makeGreenhouseProfile() {
  // The window area — matches the cabin section of the body profile
  // Slightly inset from body so it doesn't z-fight
  const s = new THREE.Shape();

  // Beltline (bottom of windows)
  s.moveTo(0.85, 0.58);

  // Windshield
  s.quadraticCurveTo(0.72, 0.67, 0.58, 0.88);

  // Roof inner edge
  s.quadraticCurveTo(0.43, 1.01, 0.15, 1.04);
  s.lineTo(-0.35, 1.04);
  s.quadraticCurveTo(-0.58, 1.02, -0.72, 0.92);

  // Rear window
  s.quadraticCurveTo(-0.87, 0.78, -1.0, 0.63);

  // Beltline back
  s.lineTo(-1.0, 0.58);
  s.lineTo(0.85, 0.58);

  return s;
}

// ─── Cute car body ──────────────────────────────────────────────────

function CuteCarBody({ color }: { color: string }) {
  const carWidth = 1.5;
  const halfW = carWidth / 2;

  const bodyGeo = useMemo(() => {
    const profile = makeBodyProfile();
    const geo = new THREE.ExtrudeGeometry(profile, {
      depth: carWidth,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 4,
      curveSegments: 20,
    });
    geo.translate(0, 0, -halfW);
    return geo;
  }, []);

  // Greenhouse (windows) — narrower than body so it sits recessed
  const glassWidth = carWidth - 0.04;
  const glassGeo = useMemo(() => {
    const profile = makeGreenhouseProfile();
    const geo = new THREE.ExtrudeGeometry(profile, {
      depth: glassWidth,
      bevelEnabled: false,
      curveSegments: 20,
    });
    geo.translate(0, 0, -glassWidth / 2);
    return geo;
  }, []);

  const paintMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.45,
        roughness: 0.25,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        envMapIntensity: 0.9,
      }),
    [color],
  );

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#88bbdd",
        metalness: 0.1,
        roughness: 0.05,
        transparent: true,
        opacity: 0.35,
        envMapIntensity: 0.8,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  );

  const darkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a1a1a",
        roughness: 0.85,
      }),
    [],
  );

  const chromeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e0e0e0",
        metalness: 0.95,
        roughness: 0.05,
      }),
    [],
  );

  return (
    <group>
      {/* ── Main body shell ── */}
      <mesh geometry={bodyGeo} material={paintMat} castShadow receiveShadow />

      {/* ── Glass greenhouse — recessed into body, front/back faces = windshield & rear window ── */}
      <mesh geometry={glassGeo} material={glassMat} renderOrder={1} />

      {/* ── Big cute round headlights (bug eyes!) ── */}
      {[0.45, -0.45].map((z) => (
        <group key={`hl-${z}`} position={[1.62, 0.4, z]}>
          {/* White eyeball */}
          <mesh>
            <sphereGeometry args={[0.16, 20, 20]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffee"
              emissiveIntensity={0.4}
              roughness={0.1}
            />
          </mesh>
          {/* Pupil */}
          <mesh position={[0.1, 0.02, 0]}>
            <sphereGeometry args={[0.08, 14, 14]} />
            <meshStandardMaterial
              color="#223344"
              emissive="#aaddff"
              emissiveIntensity={0.6}
              roughness={0.05}
              metalness={0.2}
            />
          </mesh>
          {/* Tiny highlight dot */}
          <mesh position={[0.14, 0.06, 0.04]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={2}
            />
          </mesh>
          {/* Chrome bezel */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.16, 0.02, 8, 24]} />
            <primitive object={chromeMat} attach="material" />
          </mesh>
        </group>
      ))}

      {/* ── Cute grille (little smile) ── */}
      <mesh position={[1.7, 0.2, 0]}>
        <boxGeometry args={[0.04, 0.1, 0.5]} />
        <primitive object={darkMat} attach="material" />
      </mesh>
      {/* Grille chrome frame */}
      <mesh position={[1.71, 0.2, 0]}>
        <boxGeometry args={[0.02, 0.14, 0.56]} />
        <primitive object={chromeMat} attach="material" />
      </mesh>

      {/* ── DRL strips (cute eyebrow accents) ── */}
      {[0.45, -0.45].map((z) => (
        <mesh key={`drl-${z}`} position={[1.68, 0.54, z]}>
          <boxGeometry args={[0.03, 0.02, 0.18]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ddeeff"
            emissiveIntensity={2}
          />
        </mesh>
      ))}

      {/* ── Round taillights ── */}
      {[0.45, -0.45].map((z) => (
        <group key={`tl-${z}`} position={[-1.6, 0.42, z]}>
          <mesh>
            <sphereGeometry args={[0.1, 14, 14]} />
            <meshStandardMaterial
              color="#dd2222"
              emissive="#ff0000"
              emissiveIntensity={1.0}
              roughness={0.2}
            />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.1, 0.015, 8, 20]} />
            <primitive object={chromeMat} attach="material" />
          </mesh>
        </group>
      ))}

      {/* ── Taillight connecting strip ── */}
      <mesh position={[-1.62, 0.42, 0]}>
        <boxGeometry args={[0.025, 0.03, 0.65]} />
        <meshStandardMaterial
          color="#dd2222"
          emissive="#ff0000"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* ── Bumpers ── */}
      <mesh position={[1.66, 0.1, 0]}>
        <boxGeometry args={[0.08, 0.14, 1.35]} />
        <primitive object={darkMat} attach="material" />
      </mesh>
      <mesh position={[-1.62, 0.1, 0]}>
        <boxGeometry args={[0.08, 0.14, 1.35]} />
        <primitive object={darkMat} attach="material" />
      </mesh>

      {/* ── Side skirts ── */}
      {[halfW + 0.02, -(halfW + 0.02)].map((z) => (
        <mesh key={`skirt-${z}`} position={[0, 0.06, z]}>
          <boxGeometry args={[3.0, 0.04, 0.03]} />
          <primitive object={darkMat} attach="material" />
        </mesh>
      ))}

      {/* ── Side mirrors (cute round nubs) ── */}
      {[1, -1].map((side) => (
        <group
          key={`mirror-${side}`}
          position={[0.6, 0.65, side * (halfW + 0.08)]}
        >
          <mesh position={[0, 0, side * 0.04]}>
            <boxGeometry args={[0.04, 0.03, 0.08]} />
            <meshPhysicalMaterial
              color={color}
              metalness={0.4}
              roughness={0.3}
              clearcoat={1}
            />
          </mesh>
          <mesh position={[0, 0, side * 0.1]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshPhysicalMaterial
              color={color}
              metalness={0.4}
              roughness={0.3}
              clearcoat={1}
            />
          </mesh>
        </group>
      ))}

      {/* ── Door handles ── */}
      {[0.2, -0.45].map((x) =>
        [halfW + 0.02, -(halfW + 0.02)].map((z) => (
          <mesh key={`h-${x}-${z}`} position={[x, 0.45, z]}>
            <boxGeometry args={[0.08, 0.02, 0.015]} />
            <primitive object={chromeMat} attach="material" />
          </mesh>
        )),
      )}

      {/* ── Door crease lines ── */}
      {[halfW + 0.015, -(halfW + 0.015)].map((z) => (
        <mesh key={`door-${z}`} position={[-0.12, 0.38, z]}>
          <boxGeometry args={[0.01, 0.45, 0.003]} />
          <meshStandardMaterial color="#000" transparent opacity={0.12} />
        </mesh>
      ))}

      {/* ── Beltline chrome trim ── */}
      {[halfW + 0.02, -(halfW + 0.02)].map((z) => (
        <mesh key={`belt-${z}`} position={[0, 0.58, z]}>
          <boxGeometry args={[2.6, 0.012, 0.008]} />
          <primitive object={chromeMat} attach="material" />
        </mesh>
      ))}

      {/* ── License plates ── */}
      <mesh position={[1.72, 0.15, 0]}>
        <boxGeometry args={[0.015, 0.06, 0.2]} />
        <meshStandardMaterial color="#eee" roughness={0.4} />
      </mesh>
      <mesh position={[-1.66, 0.25, 0]}>
        <boxGeometry args={[0.015, 0.06, 0.2]} />
        <meshStandardMaterial color="#eee" roughness={0.4} />
      </mesh>

      {/* ── Exhaust tips ── */}
      {[0.25, -0.25].map((z) => (
        <mesh
          key={`exh-${z}`}
          position={[-1.66, 0.06, z]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.025, 0.025, 0.06, 10]} />
          <primitive object={chromeMat} attach="material" />
        </mesh>
      ))}

      {/* ── Cute shark fin antenna ── */}
      <mesh position={[-0.35, 1.14, 0]} castShadow>
        <coneGeometry args={[0.03, 0.08, 8]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.4}
          roughness={0.3}
          clearcoat={1}
        />
      </mesh>

      {/* ── Fog lights (tiny round) ── */}
      {[0.5, -0.5].map((z) => (
        <mesh key={`fog-${z}`} position={[1.68, 0.1, z]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial
            color="#ffff88"
            emissive="#ffff44"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Wheel ──────────────────────────────────────────────────────────

function Wheel({
  position,
  flip,
}: {
  position: [number, number, number];
  flip?: boolean;
}) {
  const tireMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a1a1a",
        roughness: 0.92,
        metalness: 0.05,
      }),
    [],
  );
  const rimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d0d0d0",
        metalness: 0.95,
        roughness: 0.05,
      }),
    [],
  );

  const spokeCount = 5;

  return (
    <group position={position} scale={flip ? [1, 1, -1] : [1, 1, 1]}>
      {/* Tire — torus upright in XY plane (no rotation!) */}
      <mesh castShadow>
        <torusGeometry args={[0.22, 0.1, 14, 28]} />
        <primitive object={tireMat} attach="material" />
      </mesh>

      {/* Rim ring */}
      <mesh>
        <torusGeometry args={[0.17, 0.02, 8, 28]} />
        <primitive object={rimMat} attach="material" />
      </mesh>

      {/* Disc face — cylinder rotated to face outward (Z) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 20]} />
        <meshStandardMaterial color="#999" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 12]} />
        <primitive object={rimMat} attach="material" />
      </mesh>

      {/* Hub cap */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.07]}>
        <cylinderGeometry args={[0.03, 0.03, 0.01, 10]} />
        <meshStandardMaterial color="#ccc" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Spokes — rotate around Z in XY plane */}
      {Array.from({ length: spokeCount }).map((_, i) => {
        const angle = (i * Math.PI * 2) / spokeCount;
        return (
          <group key={i} rotation={[0, 0, angle]}>
            <mesh position={[0, 0.1, 0.015]}>
              <boxGeometry args={[0.025, 0.13, 0.025]} />
              <primitive object={rimMat} attach="material" />
            </mesh>
          </group>
        );
      })}

      {/* Lug nuts */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 5;
        return (
          <mesh
            key={`lug-${i}`}
            position={[Math.cos(a) * 0.04, Math.sin(a) * 0.04, 0.07]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.006, 0.006, 0.012, 6]} />
            <meshStandardMaterial
              color="#aaa"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ─── Scene ──────────────────────────────────────────────────────────

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
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[6, 8, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-4, 5, -3]} intensity={0.3} />
      <pointLight position={[0, 6, 0]} intensity={0.2} />

      <group ref={groupRef} position={[0, -0.15, 0]}>
        <CuteCarBody color={color} />
        {/* Wheels — outside body surface, flip -Z side so details face outward */}
        <Wheel position={[0.85, 0.22, 0.84]} />
        <Wheel position={[0.85, 0.22, -0.84]} flip />
        <Wheel position={[-0.85, 0.22, 0.84]} />
        <Wheel position={[-0.85, 0.22, -0.84]} flip />
      </group>

      <AutoRotate groupRef={groupRef} autoRotate={autoRotate} />

      <ContactShadows
        position={[0, -0.55, 0]}
        opacity={0.5}
        scale={12}
        blur={2.5}
        far={4}
      />

      {/* Simple dark floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.56, 0]}
        receiveShadow
      >
        <circleGeometry args={[20, 64]} />
        <meshStandardMaterial
          color="#111115"
          roughness={0.95}
          metalness={0.1}
        />
      </mesh>

      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={3}
        maxDistance={10}
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
  { name: "Sakura Pink", hex: "#e8a0b0" },
  { name: "Sky Blue", hex: "#5b9bd5" },
  { name: "Mint Green", hex: "#7bc8a4" },
];

const wheelFinishes = [
  { name: "Silver", hex: "#cccccc" },
  { name: "Gunmetal", hex: "#444444" },
  { name: "Black", hex: "#1a1a1a" },
  { name: "Gold", hex: "#c4a240" },
];

// ─── Exported component ─────────────────────────────────────────────

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
  const [sceneReady, setSceneReady] = useState(false);

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
        <Canvas3DErrorBoundary
          fallback={
            <div className="flex h-full items-center justify-center bg-black">
              <div className="text-center">
                <p className="mb-2 text-sm text-white/60">
                  3D viewer failed to load
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="rounded-lg bg-white/10 px-4 py-2 text-xs text-white hover:bg-white/20"
                >
                  Reload
                </button>
              </div>
            </div>
          }
        >
          <Canvas
            shadows
            camera={{ position: [4, 2, 4], fov: 38 }}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.0,
            }}
            onCreated={() => setSceneReady(true)}
          >
            <Suspense fallback={null}>
              <CarScene color={selectedColor} autoRotate={autoRotate} />
            </Suspense>
          </Canvas>
          {!sceneReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
                <p className="text-sm text-white/60">Loading 3D viewer...</p>
              </div>
            </div>
          )}
        </Canvas3DErrorBoundary>

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

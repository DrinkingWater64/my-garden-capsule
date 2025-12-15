'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Sphere, useGLTF } from '@react-three/drei';
import { Suspense, useState, useMemo, useRef } from 'react';
import * as THREE from 'three';

const NUM_TREES = 20;
const PLANET_RADIUS = 2;

function Tree({ position, visible }: { position: THREE.Vector3; visible: boolean }) {
    const { scene } = useGLTF('/glb/tree1.glb');
    const clone = useMemo(() => scene.clone(), [scene]);

    // Align tree to surface normal
    useMemo(() => {
        // Up vector is (0,1,0) by default for the model usually.
        // We want local Y to point along the position vector (normal of sphere at that point)
        const target = position.clone().normalize().add(position); // Look at a point "outside" along the normal
        clone.lookAt(target);

        // Fix rotation if model is not Y-up or if lookAt behavior needs adjustment.
        // Usually lookAt points the +Z axis at target. 
        // If tree model is Y-up, we might need to rotate geometry or adjust.
        // Let's assume standard behavior first. If tree lies flat, we fix it.
        // Actually, lookAt points +Z. If we want +Y to point out, we need to rotate X by 90 deg?
        // Let's rely on standard practice: usually better to use a dummy object or quaternion math.

        const up = new THREE.Vector3(0, 1, 0);
        const normal = position.clone().normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);
        clone.setRotationFromQuaternion(quaternion);

    }, [clone, position]);

    if (!visible) return null;

    return <primitive object={clone} position={position} scale={[0.1, 0.1, 0.1]} />;
}

function PlanetMesh({ isGreen, onClick }: { isGreen: boolean; onClick: () => void }) {
    return (
        <Sphere args={[PLANET_RADIUS, 64, 64]} onClick={(e) => { e.stopPropagation(); onClick(); }} position={[0, 0, 0]}>
            <meshStandardMaterial
                color={isGreen ? "#4ade80" : "#e6c288"}
                roughness={0.8}
                metalness={0.1}
            />
        </Sphere>
    );
}

export default function Planet() {
    const [clickCount, setClickCount] = useState(0);

    // Logic: 
    // <= 10 clicks: show 'clickCount' trees.
    // > 10 clicks: show ALL 20 trees.
    const isGreen = clickCount > 10;
    const visibleTreeCount = isGreen ? NUM_TREES : clickCount;

    // Generate fixed positions on mount
    const treePositions = useMemo(() => {
        const pos: THREE.Vector3[] = [];
        const minD = 0.8; // Minimum distance between trees to avoid overlap

        // Simple rejection sampling
        let attempts = 0;
        while (pos.length < NUM_TREES && attempts < 1000) {
            attempts++;
            const v = new THREE.Vector3().randomDirection().multiplyScalar(PLANET_RADIUS);

            // Filter for "Face" of planet. 
            // Camera is at [0, 2, 5]. 
            // We want points roughly facing the camera.
            // Let's prioritize y > -0.5 and z > -0.5
            if (v.y < -0.5 || v.z < -0.5) continue;

            // Check distance against existing
            let tooClose = false;
            for (const p of pos) {
                if (v.distanceTo(p) < minD) {
                    tooClose = true;
                    break;
                }
            }
            if (!tooClose) pos.push(v);
        }
        return pos;
    }, []);

    const handleClick = () => {
        setClickCount(prev => prev + 1);
    };

    return (
        <div className="w-full h-[500px] relative">
            <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
                <Suspense fallback={null}>
                    <PlanetMesh isGreen={isGreen} onClick={handleClick} />
                    {treePositions.map((pos, i) => (
                        <Tree key={i} position={pos} visible={i < visibleTreeCount} />
                    ))}
                    <Environment preset="sunset" />
                </Suspense>
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.5}
                />
            </Canvas>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-zinc-800 dark:text-zinc-200 text-sm font-medium z-10 pointer-events-none select-none">
                {isGreen ? "The planet is thriving!" : "Click to plant trees..."} ({visibleTreeCount}/{NUM_TREES})
            </div>
        </div>
    );
}

useGLTF.preload('/glb/tree1.glb');

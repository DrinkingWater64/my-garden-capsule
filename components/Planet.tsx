'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useState, useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';

const NUM_TREES = 20;

function PlanetModel({ onLoad }: { onLoad: (trees: THREE.Object3D[], water: THREE.Object3D, terrain: THREE.Object3D) => void }) {
    const { scene } = useGLTF('/glb/Planet.glb');

    useEffect(() => {
        const trees: THREE.Object3D[] = [];
        let waterSphere: THREE.Object3D | null = null;
        let planetTerrain: THREE.Object3D | null = null;

        // Traverse the scene to find trees, water, and terrain
        scene.traverse((child) => {
            // Find trees by name pattern (Tree_001, Tree_002, etc.)
            if (child.name.startsWith('Tree_')) {
                trees.push(child);
                child.visible = false; // Hide all trees initially
            }

            // Find water sphere
            if (child.name === 'planet_water') {
                waterSphere = child;
                child.visible = false; // Hide water initially
            }

            // Find planet terrain
            if (child.name === 'planet_terrain') {
                planetTerrain = child;

                // Apply desert material
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: '#e6c288', // Desert color
                        roughness: 0.8,
                        metalness: 0.1,
                    });
                }
            }
        });

        // Sort trees by name to ensure consistent order
        trees.sort((a, b) => a.name.localeCompare(b.name));

        if (trees.length > 0 && waterSphere && planetTerrain) {
            onLoad(trees, waterSphere, planetTerrain);
        } else {
            console.warn('Could not find all required objects:', {
                treesFound: trees.length,
                waterFound: !!waterSphere,
                terrainFound: !!planetTerrain
            });
        }
    }, [scene, onLoad]);

    return <primitive object={scene} />;
}

function InteractivePlanet() {
    const [clickCount, setClickCount] = useState(0);
    const [trees, setTrees] = useState<THREE.Object3D[]>([]);
    const [waterSphere, setWaterSphere] = useState<THREE.Object3D | null>(null);
    const [planetTerrain, setPlanetTerrain] = useState<THREE.Object3D | null>(null);

    const isGreen = clickCount > 10;
    const visibleTreeCount = isGreen ? NUM_TREES : clickCount;

    const handleModelLoad = useMemo(() => {
        return (treeObjects: THREE.Object3D[], water: THREE.Object3D, terrain: THREE.Object3D) => {
            setTrees(treeObjects);
            setWaterSphere(water);
            setPlanetTerrain(terrain);
        };
    }, []);

    useEffect(() => {
        if (trees.length === 0) return;

        // Update tree visibility
        trees.forEach((tree, index) => {
            tree.visible = index < visibleTreeCount;
        });

        // Update water visibility and planet color
        if (waterSphere) {
            waterSphere.visible = isGreen;
        }

        if (planetTerrain && planetTerrain instanceof THREE.Mesh) {
            const material = planetTerrain.material as THREE.MeshStandardMaterial;
            material.color.set(isGreen ? '#4ade80' : '#e6c288');
        }
    }, [visibleTreeCount, isGreen, trees, waterSphere, planetTerrain]);

    const handleClick = (e: any) => {
        e.stopPropagation();
        setClickCount(prev => prev + 1);
    };

    return (
        <>
            <group onClick={handleClick}>
                <PlanetModel onLoad={handleModelLoad} />
            </group>
        </>
    );
}

export default function Planet() {
    const [clickCount, setClickCount] = useState(0);
    const [trees, setTrees] = useState<THREE.Object3D[]>([]);
    const [waterSphere, setWaterSphere] = useState<THREE.Object3D | null>(null);
    const [planetTerrain, setPlanetTerrain] = useState<THREE.Object3D | null>(null);

    const isGreen = clickCount > 10;
    const visibleTreeCount = isGreen ? trees.length : clickCount;

    const handleModelLoad = useMemo(() => {
        return (treeObjects: THREE.Object3D[], water: THREE.Object3D, terrain: THREE.Object3D) => {
            // Initialize all trees with scale 0
            treeObjects.forEach(tree => {
                tree.scale.set(0, 0, 0);
            });

            // Initialize water with scale 0
            water.scale.set(0, 0, 0);

            setTrees(treeObjects);
            setWaterSphere(water);
            setPlanetTerrain(terrain);
        };
    }, []);

    useEffect(() => {
        if (trees.length === 0) return;

        // Update tree visibility
        trees.forEach((tree, index) => {
            tree.visible = index < visibleTreeCount;
        });

        // Update water visibility
        if (waterSphere) {
            waterSphere.visible = isGreen;
        }
    }, [visibleTreeCount, isGreen, trees, waterSphere]);

    const handleClick = (e: any) => {
        e.stopPropagation();
        setClickCount(prev => prev + 1);
    };

    return (
        <div className="w-full h-[500px] relative">
            <Canvas shadows camera={{ position: [0, 20, 50], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
                <Suspense fallback={null}>
                    <group onClick={handleClick}>
                        <PlanetModel onLoad={handleModelLoad} />
                        <AnimationController
                            trees={trees}
                            waterSphere={waterSphere}
                            planetTerrain={planetTerrain}
                            visibleTreeCount={visibleTreeCount}
                            isGreen={isGreen}
                        />
                    </group>
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
                {isGreen ? "The planet is thriving!" : "Click to plant trees..."} ({visibleTreeCount}/{trees.length || NUM_TREES})
            </div>
        </div>
    );
}

// Animation controller component
function AnimationController({
    trees,
    waterSphere,
    planetTerrain,
    visibleTreeCount,
    isGreen
}: {
    trees: THREE.Object3D[];
    waterSphere: THREE.Object3D | null;
    planetTerrain: THREE.Object3D | null;
    visibleTreeCount: number;
    isGreen: boolean;
}) {
    const treeAnimations = useRef<Map<number, { startTime: number; duration: number }>>(new Map());
    const waterAnimationStart = useRef<number | null>(null);
    const currentTerrainColor = useRef(new THREE.Color('#e6c288'));
    const targetTerrainColor = useRef(new THREE.Color('#e6c288'));
    const colorTransitionStart = useRef<number | null>(null);
    const colorTransitionDuration = 1.0; // 1 second for color transition

    useEffect(() => {
        // Start animations for newly visible trees
        trees.forEach((tree, index) => {
            if (index < visibleTreeCount && !treeAnimations.current.has(index)) {
                treeAnimations.current.set(index, {
                    startTime: Date.now(),
                    duration: 300 // 0.3 seconds in milliseconds
                });
            }
        });

        // Start water animation when it becomes visible
        if (isGreen && waterSphere?.visible && waterAnimationStart.current === null) {
            waterAnimationStart.current = Date.now();
        }

        // Start color transition
        const newTargetColor = isGreen ? '#4ade80' : '#e6c288';
        if (targetTerrainColor.current.getHexString() !== new THREE.Color(newTargetColor).getHexString()) {
            targetTerrainColor.current.set(newTargetColor);
            colorTransitionStart.current = Date.now();
        }
    }, [visibleTreeCount, isGreen, trees, waterSphere]);

    useFrame(() => {
        const now = Date.now();

        // Animate trees
        trees.forEach((tree, index) => {
            const animation = treeAnimations.current.get(index);
            if (animation && tree.visible) {
                const elapsed = now - animation.startTime;
                const progress = Math.min(elapsed / animation.duration, 1);

                // Ease out cubic for smooth animation
                const eased = 1 - Math.pow(1 - progress, 3);
                tree.scale.set(eased, eased, eased);
            }
        });

        // Animate water sphere (slow continuous scaling)
        if (waterSphere && waterSphere.visible) {
            if (waterAnimationStart.current !== null) {
                const elapsed = (now - waterAnimationStart.current) / 1000; // in seconds
                // Slow pulsing animation
                const scale = 0.95 + Math.sin(elapsed * 0.5) * 0.02;
                waterSphere.scale.set(scale, scale, scale);
            }
        } else if (waterSphere && !waterSphere.visible) {
            // Reset water animation when hidden
            waterAnimationStart.current = null;
            waterSphere.scale.set(0, 0, 0);
        }

        // Animate terrain color transition
        if (planetTerrain && colorTransitionStart.current !== null) {
            const elapsed = (now - colorTransitionStart.current) / 1000; // in seconds
            const progress = Math.min(elapsed / colorTransitionDuration, 1);

            // Ease in-out for smooth color transition
            const eased = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            currentTerrainColor.current.lerp(targetTerrainColor.current, eased);

            planetTerrain.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    const material = child.material as THREE.MeshStandardMaterial;
                    material.color.copy(currentTerrainColor.current);
                }
            });

            // Stop transition when complete
            if (progress >= 1) {
                colorTransitionStart.current = null;
            }
        }
    });

    return null;
}

useGLTF.preload('/glb/planet.glb');
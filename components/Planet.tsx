'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense, useState, useMemo, useEffect } from 'react';
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

        // Update planet color
        if (planetTerrain) {
            planetTerrain.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    const material = child.material as THREE.MeshStandardMaterial;
                    material.color.set(isGreen ? '#4ade80' : '#e6c288');
                }
            });
        }
    }, [visibleTreeCount, isGreen, trees, waterSphere, planetTerrain]);

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

useGLTF.preload('/glb/planet.glb');
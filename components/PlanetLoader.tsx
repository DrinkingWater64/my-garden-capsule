'use client';

import dynamic from 'next/dynamic';

const Planet = dynamic(() => import('./Planet'), { ssr: false });

export default function PlanetLoader() {
    return <Planet />;
}

import { useEffect, useState } from 'react';
import Trashousel from './Trashousel';
import type { Image } from './types';

const IMAGES: Image[] = [
  { url: '/top-carousel/splist-app.png', alt: 'Splist App' },
  { url: '/top-carousel/cozy.png', alt: 'Cozy Coders Homepage' },
  { url: '/top-carousel/music.png', alt: 'Music Homepage' },
  { url: '/top-carousel/chessheat.png', alt: 'Chess Heat Homepage' },
  { url: '/top-carousel/resto.png', alt: 'Resto homepage' },
  { url: '/top-carousel/typehero.png', alt: 'TypeHero homepage' },
  { url: '/top-carousel/maxdemaio-home.jpeg', alt: 'Max DeMaio Homepage' },
  { url: '/top-carousel/WikiHop.jpg', alt: 'WikiHop Homepage' },
  { url: '/top-carousel/overlayed.png', alt: 'Overlayed Homepage' },
];

function calculateDimensions(width: number) {
  if (width < 480) return { width: 320, height: 180 };
  if (width < 640) return { width: 420, height: 220 };
  if (width < 800) return { width: 560, height: 280 };
  return { width: 720, height: 340 };
}

const DEFAULT_DIMENSIONS = calculateDimensions(800);

const TrashouselWrapper = () => {
  const [dimensions, setDimensions] = useState(DEFAULT_DIMENSIONS);

  useEffect(() => {
    const handleResize = () => {
      setDimensions(calculateDimensions(window.innerWidth));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <Trashousel images={IMAGES} width={dimensions.width} height={dimensions.height} />;
};

export default TrashouselWrapper;

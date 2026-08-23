import { useState, useEffect, useRef } from 'react';
import type { CoverflowProps } from './types';

const ROTATE = 25;
const OPACITY_ORDER = [1, 0.6, 0.4, 0.0];
const SCALE_ORDER = [1, 0.8, 0.6, 0.4];

function getImageWidth(image: HTMLImageElement, coverflowHeight: number) {
  return image ? image.width * (coverflowHeight / image.height) : 1;
}

function clamp(value: number, lowBound: number, highBound: number) {
  return Math.max(lowBound, Math.min(highBound, value));
}

const fetchImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
  });
};

const fetchImages = (urls: string[]): Promise<HTMLImageElement[]> => {
  const promises = urls.map(fetchImage);
  return Promise.all(promises);
};

function Trashousel({ images, height, width }: CoverflowProps) {
  const coverflowRef = useRef<HTMLDivElement>(null);
  const [leftEdgeList, setLeftEdgeList] = useState<number[]>([]);
  const [imageList, setImageList] = useState<HTMLImageElement[]>([]);
  const [imageWidthList, setImageWidthList] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  function leftArrowClick() {
    setCurrentIndex((currentIndex) => (currentIndex > 0 ? currentIndex - 1 : imageList.length - 1));
  }

  function rightArrowClick() {
    setCurrentIndex((currentIndex) => (currentIndex < imageList.length - 1 ? currentIndex + 1 : 0));
  }

  useEffect(() => {
    const imageUrls = images.map((image) => image.url);
    const fetchData = async () => {
      const imgs = await fetchImages(imageUrls);
      setImageList(imgs);
      setCurrentIndex(Math.floor(imgs.length / 2));
    };

    fetchData();
  }, [images]);

  useEffect(() => {
    const coverflowHeight = coverflowRef.current ? coverflowRef.current.getBoundingClientRect().height : 0;

    const leftEdgeList: number[] = [];
    const imageWidthList: number[] = [];
    let edge = 0;

    imageList.forEach((image, index) => {
      const distanceFromMiddle = index - currentIndex;
      const scale = SCALE_ORDER[clamp(Math.abs(distanceFromMiddle), 0, SCALE_ORDER.length - 1)];

      leftEdgeList.push(edge);
      const imageWidth = getImageWidth(image, coverflowHeight);
      imageWidthList.push(imageWidth);
      const scaledWidth = imageWidth * scale;

      if (distanceFromMiddle < 0) {
        edge += scaledWidth * 0.5;
      } else {
        const nextImage = imageList[index + 1];
        if (nextImage) {
          const nextImageDistanceFromCenter = index + 1 - currentIndex;
          const nextScale = SCALE_ORDER[clamp(Math.abs(nextImageDistanceFromCenter), 0, SCALE_ORDER.length - 1)];
          const nextScaledWidth = getImageWidth(nextImage, coverflowHeight) * nextScale;
          edge += scaledWidth - nextScaledWidth + nextScaledWidth * 0.5;
        } else {
          edge += scaledWidth;
        }
      }
    });
    setLeftEdgeList(leftEdgeList);
    setImageWidthList(imageWidthList);
  }, [currentIndex, imageList, height]);

  if (!imageList.length) {
    return (
      <div className="flex justify-center">
        <div style={{ width: `${width}px`, height: `${height}px` }} className="relative" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div style={{ width: `${width}px`, height: `${height}px` }} className="relative">
        <button
          aria-label="Previous"
          className="transition-opacity duration-300 hover:opacity-90 opacity-60 z-10 absolute top-[50%] left-[15%] xs:left-[10%] bg-neutral-100 grid items-center justify-center w-10 h-10 rounded-full"
          onClick={leftArrowClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
            <path fill="black" d="M10 16L20 6l1.4 1.4l-8.6 8.6l8.6 8.6L20 26z"></path>
          </svg>
        </button>

        <button
          aria-label="Next"
          className="transition-opacity duration-300 hover:opacity-90 opacity-60 z-10 absolute top-[50%] right-[15%] xs:right-[10%] bg-neutral-100 grid items-center justify-center w-10 h-10 rounded-full"
          onClick={rightArrowClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
            <path fill="black" d="M22 16L12 26l-1.4-1.4l8.6-8.6l-8.6-8.6L12 6z"></path>
          </svg>
        </button>
        <div
          ref={coverflowRef}
          className="mb-8 relative flex items-center left-1/2 h-full"
          style={{
            transform: `translateX(-${leftEdgeList[currentIndex] + imageWidthList[currentIndex] / 2}px)`,
            width: `1024px`,
            height: `100%`,
            transition: 'transform 500ms cubic-bezier(0.215, 0.61, 0.355, 1), width 500ms cubic-bezier(0.215, 0.61, 0.355, 1)',
          }}
        >
          {images.map((image, index) => {
            const imageWidth = imageWidthList[index];
            const isCurrentImage = currentIndex === index;
            const distanceFromMiddle = Math.abs(currentIndex - index);
            const leftPosition = leftEdgeList[index];
            const rotate = index > currentIndex ? -ROTATE : index === currentIndex ? 0 : ROTATE;
            const zIndex = 100 - distanceFromMiddle;
            const opacity = OPACITY_ORDER[clamp(Math.abs(distanceFromMiddle), 0, OPACITY_ORDER.length - 1)];
            const scale = SCALE_ORDER[clamp(Math.abs(distanceFromMiddle), 0, SCALE_ORDER.length - 1)];
            const scaledWidth = imageWidth * scale;
            return (
              <div
                key={`image-${index}`}
                className="absolute"
                style={{
                  zIndex: `${zIndex}`,
                  position: `absolute`,
                  left: `${leftPosition}px`,
                  perspective: `100vw`,
                  transition: `left 500ms cubic-bezier(0.215, 0.61, 0.355, 1)`,
                  pointerEvents: `none`,
                  userSelect: `none`,
                  width: `${scaledWidth}px`,
                }}
              >
                <div
                  tabIndex={index}
                  onClick={() => setCurrentIndex(index)}
                  className="focus:outline-none"
                  style={{
                    transform: `scale(${scale}) rotateY(${rotate}deg)`,
                    transition: `transform 500ms cubic-bezier(0.215, 0.61, 0.355, 1), opacity 500ms cubic-bezier(0.215, 0.61, 0.355, 1)`,
                    pointerEvents: `all`,
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    style={{
                      display: `block`,
                      transform: `translateZ(0)`,
                      width: `${imageWidth}px`,
                      opacity: `${opacity}`,
                      transition: `transform 500ms cubic-bezier(0.215, 0.61, 0.355, 1), opacity 500ms cubic-bezier(0.215, 0.61, 0.355, 1)`,
                      borderRadius: `.125rem`,
                      boxShadow: isCurrentImage ? `0 1px 20px 10px hsla(0,0%,100%,.1)` : ``,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Trashousel;

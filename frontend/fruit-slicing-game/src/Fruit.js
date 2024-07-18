import React, { useState, useEffect } from 'react';
import { Image as KonvaImage, Group } from 'react-konva';
import useImage from 'use-image';

const Fruit = ({ x, y, icon, onSlice, isBomb, isHour, gameOver, speed, containerHeight, onRemove, size }) => {
    const [position, setPosition] = useState({ x, y });
    const [rotation, setRotation] = useState(0);
    const [sliced, setSliced] = useState(false);
    const [exploded, setExploded] = useState(false);
    const [sliceEffect, setSliceEffect] = useState(false);
    const [sliceParts, setSliceParts] = useState([]);
    const [sliceOpacity, setSliceOpacity] = useState(1);
    const [fullImage] = useImage(`/images/${icon}.png`);
    const [sliceImage1] = useImage(`/images/${icon}-1.png`);
    const [sliceImage2] = useImage(`/images/${icon}-2.png`);
    const [explosionImage] = useImage('/images/explosion.png'); // Patlama resmi
    const [addedTimeImage] = useImage('/images/added_time.png'); // Added time image

    useEffect(() => {
        if (gameOver) return;

        const interval = setInterval(() => {
            setPosition((pos) => {
                const newY = pos.y + speed;
                if (newY > containerHeight) {
                    onRemove();
                    return pos;
                }
                return { ...pos, y: newY };
            });
            setRotation((rot) => (rot + 0.15)); // Meyve döndürme
        }, 12);

        return () => clearInterval(interval);
    }, [gameOver, speed, containerHeight, onRemove]);

    useEffect(() => {
        if (sliced && sliceOpacity > 0) {
            const fadeOutInterval = setInterval(() => {
                setSliceOpacity((prevOpacity) => {
                    if (prevOpacity === 0.05) {
                        clearInterval(fadeOutInterval);
                        setSliced(false); // Efekt tamamen kaybolacak
                        return 0;
                    }
                    return prevOpacity - 0.1;
                });
            }, 75);
            return () => clearInterval(fadeOutInterval);
        }
    }, [sliced, sliceOpacity]);

    const handleSlice = (e) => {
        if (!sliced) {
            setSliced(true);
            onSlice(isBomb, isHour, position.x, position.y);
            if (isBomb) {
                setExploded(true);
                setTimeout(() => {
                    setExploded(false);
                }, 500);
            } else {
                setSliceEffect(true);
                setSliceParts([
                    { image: sliceImage1, rotation: -20, xMove: -size / 4, yMove: -size / 4 },
                    { image: sliceImage2, rotation: 20, xMove: size / 4, yMove: size / 4 }
                ]);
                setTimeout(() => {
                    setSliceEffect(false);
                }, 300);
            }
        }
    };

    return (
        <Group>
            {!sliced ? (
                <KonvaImage
                    image={fullImage}
                    x={position.x}
                    y={position.y}
                    width={size}
                    height={size}
                    rotation={rotation}
                    onMouseDown={handleSlice}
                    onMouseUp={handleSlice}
                    onMouseMove={handleSlice}
                    onTouchMove={handleSlice} // Mobil cihazlar için
                />
            ) : exploded && sliceOpacity > 0 ? (
                <KonvaImage
                    image={explosionImage}
                    x={position.x}
                    y={position.y}
                    width={size + 50}
                    height={size + 50}
                    opacity={sliceOpacity}
                />
            ) : isHour && sliceOpacity > 0 ? (
                <KonvaImage
                    image={addedTimeImage}
                    x={position.x}
                    y={position.y}
                    width={size - 20}
                    height={size - 20}
                    opacity={sliceOpacity}
                />
            ) : sliced && sliceOpacity > 0 ? (
                sliceParts.map((part, index) => (
                    <KonvaImage
                        key={index}
                        image={part.image}
                        x={position.x + part.xMove}
                        y={position.y + part.yMove}
                        width={size / 0.85} // Kesilmiş hali biraz daha büyük
                        height={size / 0.85}
                        rotation={part.rotation}
                        opacity={sliceOpacity}
                    />
                ))
            ) : null}
        </Group>
    );
};

export default Fruit;

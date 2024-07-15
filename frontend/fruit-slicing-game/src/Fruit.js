import React, { useState, useEffect } from 'react';
import { Image as KonvaImage, Group } from 'react-konva';
import useImage from 'use-image';

const Fruit = ({ x, y, icon, onSlice, isBomb, gameOver, speed, containerHeight, onRemove, size }) => {
    const [position, setPosition] = useState({ x, y });
    const [rotation, setRotation] = useState(0);
    const [sliced, setSliced] = useState(false);
    const [exploded, setExploded] = useState(false);
    const [sliceEffect, setSliceEffect] = useState(false);
    const [sliceParts, setSliceParts] = useState([]);
    const [fullImage] = useImage(`/images/${icon}.png`);
    const [sliceImage1] = useImage(`/images/${icon}-1.png`);
    const [sliceImage2] = useImage(`/images/${icon}-2.png`);

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

    const handleMouseMove = (e) => {
        if (!sliced) {
            setSliced(true);
            onSlice(isBomb, position.x, position.y);
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
                    onMouseMove={handleMouseMove}
                />
            ) : exploded ? (
                <KonvaImage
                    image={fullImage}
                    x={position.x}
                    y={position.y}
                    width={size}
                    height={size}
                />
            ) : (
                sliceParts.map((part, index) => (
                    <KonvaImage
                        key={index}
                        image={part.image}
                        x={position.x + part.xMove}
                        y={position.y + part.yMove}
                        width={size / 1.5} // Kesilmiş hali biraz daha büyük
                        height={size / 1.5}
                        rotation={part.rotation}
                    />
                ))
            )}
        </Group>
    );
};

export default Fruit;

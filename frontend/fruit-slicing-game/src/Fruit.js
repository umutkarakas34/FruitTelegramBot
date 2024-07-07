import React, { useState, useEffect } from 'react';
import { Image as KonvaImage, Group } from 'react-konva';
import useImage from 'use-image';
import ''

const Fruit = ({ x, y, image, onSlice, isBomb, gameOver, speed, containerHeight, onRemove, size }) => {
    const [img] = useImage(image);
    const [explosion] = useImage(process.env.PUBLIC_URL + '/images/explosion.png');
    const [slice] = useImage(process.env.PUBLIC_URL + '/images/slice.png');
    const [position, setPosition] = useState({ x, y });
    const [rotation, setRotation] = useState(0);
    const [sliced, setSliced] = useState(false);
    const [exploded, setExploded] = useState(false);
    const [sliceEffect, setSliceEffect] = useState(false);

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
                    image={img}
                    x={position.x}
                    y={position.y}
                    width={size}
                    height={size}
                    rotation={rotation}
                    onMouseMove={handleMouseMove}
                />
            ) : exploded ? (
                <KonvaImage
                    image={explosion}
                    x={position.x}
                    y={position.y}
                    width={size}
                    height={size}
                />
            ) : (
                <>
                    <KonvaImage
                        image={img}
                        x={position.x - size / 4}
                        y={position.y - size / 4}
                        width={size}
                        height={size / 2}
                        rotation={-45}
                    />
                    <KonvaImage
                        image={img}
                        x={position.x + size / 4}
                        y={position.y + size / 4}
                        width={size}
                        height={size / 2}
                        rotation={45}
                    />
                    {sliceEffect && (
                        <KonvaImage
                            image={slice}
                            x={position.x}
                            y={position.y}
                            width={size}
                            height={size}
                            rotation={45}
                        />
                    )}
                </>
            )}
        </Group>
    );
};

export default Fruit;

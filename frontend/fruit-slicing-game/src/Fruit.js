import React, { useState, useEffect } from 'react';
import { Text as KonvaText, Group } from 'react-konva';

const Fruit = ({ x, y, icon, onSlice, isBomb, gameOver, speed, containerHeight, onRemove, size }) => {
    const [position, setPosition] = useState({ x, y });
    const [rotation, setRotation] = useState(0);
    const [sliced, setSliced] = useState(false);
    const [exploded, setExploded] = useState(false);
    const [sliceEffect, setSliceEffect] = useState(false);
    const [sliceParts, setSliceParts] = useState([]);

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
                    { ...position, rotation: -45, xMove: -size / 2, yMove: -size / 2 },
                    { ...position, rotation: 45, xMove: size / 2, yMove: size / 2 }
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
                <KonvaText
                    text={icon}
                    x={position.x}
                    y={position.y}
                    fontSize={size}
                    rotation={rotation}
                    onMouseMove={handleMouseMove}
                />
            ) : exploded ? (
                <KonvaText
                    text="💥"
                    x={position.x}
                    y={position.y}
                    fontSize={size}
                />
            ) : (
                sliceParts.map((part, index) => (
                    <KonvaText
                        key={index}
                        text={icon}
                        x={part.x + part.xMove}
                        y={part.y + part.yMove}
                        fontSize={size / 2}
                        rotation={part.rotation}
                    />
                ))
            )}
        </Group>
    );
};

export default Fruit;

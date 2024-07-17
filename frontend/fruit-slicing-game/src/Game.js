import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stage, Layer, Circle, Image as KonvaImage, Text as KonvaText } from 'react-konva';
import useImage from 'use-image';
import Fruit from './Fruit';
import { Container, Button } from '@mui/material';

const Game = () => {
    const navigate = useNavigate();
    const [fruits, setFruits] = useState([]);
    const [score, setScore] = useState(0);
    const [bombsClicked, setBombsClicked] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [speed, setSpeed] = useState(2);
    const [timeLeft, setTimeLeft] = useState(30);
    const [timeUp, setTimeUp] = useState(false);
    const [splashes, setSplashes] = useState([]);
    const [backgroundImage] = useImage('/images/background.jpg'); // Resim dosyasını yükleyin

    const fruitIcons = useMemo(() => [
        'apple', // Apple
        'banana', // Banana
        'peach', // Peach
        'sandia', // Watermelon
        'basaha' // Strawberry
    ], []);
    const bombIcon = 'boom';
    const bombFull = '💣';

    const [stageSize, setStageSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setStageSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (gameOver || timeUp) return;

        const interval = setInterval(() => {
            const isBomb = Math.random() < 0.2;
            const randomIcon = isBomb
                ? bombIcon
                : fruitIcons[Math.floor(Math.random() * fruitIcons.length)];
            setFruits((fruits) => [
                ...fruits,
                { id: Date.now(), x: Math.random() * (stageSize.width - 50) + 25, y: -25, icon: randomIcon, isBomb },
            ]);
        }, 400);

        return () => clearInterval(interval);
    }, [gameOver, timeUp, fruitIcons, bombIcon, stageSize]);

    useEffect(() => {
        if (bombsClicked >= 3) {
            setGameOver(true);
            setFruits([]);
        }
    }, [bombsClicked]);

    useEffect(() => {
        if (score > 0 && score % 10 === 0) {
            setSpeed((prevSpeed) => prevSpeed + 1);
        }
    }, [score]);

    useEffect(() => {
        if (timeLeft > 0 && !gameOver) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !gameOver) {
            setTimeUp(true);
            setFruits([]);
        }
    }, [timeLeft, gameOver]);

    useEffect(() => {
        if (window.innerWidth < 600) {
            setSpeed((prevSpeed) => prevSpeed * 1.5);
        }
    }, []);

    useEffect(() => {
        if (gameOver || timeUp) {
            navigate('/reward', { state: { score } });
        }
    }, [gameOver, timeUp, score, navigate]);

    const handleSlice = (id, isBomb, x, y) => {
        setFruits((fruits) => fruits.filter((fruit) => fruit.id !== id));
        if (isBomb) {
            setScore(0);
            setBombsClicked((count) => {
                const newCount = count + 1;
                if (newCount >= 3) {
                    setGameOver(true);
                    setFruits([]);
                }
                return newCount;
            });
        } else {
            setScore((score) => score + 1);
        }
    };

    const handleRemove = (id) => {
        setFruits((fruits) => fruits.filter((fruit) => fruit.id !== id));
    };

    const handleRestart = () => {
        setFruits([]);
        setSplashes([]);
        setScore(0);
        setBombsClicked(0);
        setSpeed(window.innerWidth < 600 ? 9 : 6);
        setTimeLeft(30);
        setGameOver(false);
        setTimeUp(false);
    };

    const renderBombs = () => {
        const bombs = [];
        for (let i = 0; i < 3 - bombsClicked; i++) {
            bombs.push(
                <span key={i} className="bomb-icon">
                    {bombFull}
                </span>
            );
        }
        return bombs;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <Container style={{ padding: 0, margin: 0, width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
            <div className="game-container">
                <Stage width={stageSize.width} height={stageSize.height}>
                    <Layer>
                        <KonvaImage
                            image={backgroundImage}
                            x={0}
                            y={0}
                            width={stageSize.width}
                            height={stageSize.height}
                        />
                        {splashes.map((splash) => (
                            <Circle
                                key={splash.id}
                                x={splash.x}
                                y={splash.y}
                                radius={200}
                                fill={splash.color}
                                opacity={0.6}
                            />
                        ))}
                        {fruits.map((fruit) => (
                            <Fruit
                                key={fruit.id}
                                x={fruit.x}
                                y={fruit.y}
                                icon={fruit.icon}
                                isBomb={fruit.isBomb}
                                onSlice={(isBomb, id, x, y) => handleSlice(id, isBomb, x, y)}
                                onRemove={() => handleRemove(fruit.id)}
                                gameOver={gameOver}
                                speed={speed}
                                containerHeight={stageSize.height}
                                size={70} // Meyve boyutunu biraz daha büyüttük
                            />
                        ))}
                        <KonvaText
                            text={`Score: ${score}`}
                            x={10}
                            y={10}
                            fontSize={18}
                            fill="white"
                        />
                        <KonvaText
                            text={formatTime(timeLeft)}
                            x={stageSize.width - 100}
                            y={10}
                            fontSize={18}
                            fill="white"
                        />
                        {!timeUp && (
                            <KonvaText
                                text={`Bombs: ${3 - bombsClicked}`}
                                x={stageSize.width - 100}
                                y={stageSize.height - 30}
                                fontSize={18}
                                fill="white"
                            />
                        )}
                    </Layer>
                </Stage>
                {gameOver && (
                    <div className="game-over">
                        <h1>Game Over</h1>
                        <h2>Score: {score}</h2>
                        <Button variant="contained" color="primary" onClick={handleRestart}>
                            Restart
                        </Button>
                    </div>
                )}
                {timeUp && (
                    <div className="time-up">
                        <h1>Time's Up!</h1>
                        <h2>Score: {score}</h2>
                        <Button variant="contained" color="primary" onClick={handleRestart}>
                            Restart
                        </Button>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default Game;

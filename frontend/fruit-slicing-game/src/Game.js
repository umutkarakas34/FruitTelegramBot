import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stage, Layer, Text as KonvaText, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import Fruit from './Fruit';
import { Container } from '@mui/material';
import './Game.css';

const Game = () => {
    const navigate = useNavigate();
    const [fruits, setFruits] = useState([]);
    const [score, setScore] = useState(0);
    const [bombsClicked, setBombsClicked] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [speed, setSpeed] = useState(2);
    const [timeLeft, setTimeLeft] = useState(30);
    const [timeUp, setTimeUp] = useState(false);
    const [sliceNumbers, setSliceNumbers] = useState(0);
    const [hourglassClicks, setHourglassClicks] = useState(0);
    const [backgroundImage] = useImage('/images/background.jpg');
    const [addedTimeImage] = useImage('/images/added_time.png');
    const [addedTimeEffect, setAddedTimeEffect] = useState({ visible: false, x: 0, y: 0, opacity: 1 });
    const startTime = useMemo(() => Date.now(), []);

    const fruitIcons = useMemo(() => [
        'apple',
        'banana',
        'peach',
        'sandia',
        'basaha'
    ], []);

    const bombIcon = 'boom';
    const hourIcon = 'hour';
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
            const isHour = !isBomb && Math.random() < 0.1;
            const randomIcon = isBomb
                ? bombIcon
                : isHour
                    ? hourIcon
                    : fruitIcons[Math.floor(Math.random() * fruitIcons.length)];

            setFruits((fruits) => [
                ...fruits,
                { id: Date.now(), x: Math.random() * (stageSize.width - 50) + 25, y: -25, icon: randomIcon, isBomb, isHour },
            ]);
        }, 400);

        return () => clearInterval(interval);
    }, [gameOver, timeUp, fruitIcons, bombIcon, hourIcon, stageSize]);

    useEffect(() => {
        if (bombsClicked >= 3) {
            setGameOver(true);
            setFruits([]);
            setSpeed(2);
        }
    }, [bombsClicked]);

    useEffect(() => {
        if (score > 0 && score % 10 === 0) {
            setSpeed((prevSpeed) => prevSpeed + 0.2);
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
            setSpeed(2);
        }
    }, [timeLeft, gameOver]);

    useEffect(() => {
        if (window.innerWidth < 600) {
            setSpeed((prevSpeed) => prevSpeed + 0.2);
        }
    }, []);

    useEffect(() => {
        if (gameOver || timeUp) {
            const gameTime = Math.floor((Date.now() - startTime) / 1000);
            console.log({
                game_time: gameTime,
                game_score: score,
                game_bomb_clicked: bombsClicked,
                game_slice_numbers: sliceNumbers,
                hourglass_clicks: hourglassClicks
            });
            navigate('/reward', { state: { score } });
        }
    }, [gameOver, timeUp, score, navigate, bombsClicked, sliceNumbers, hourglassClicks, startTime]);

    const handleSlice = (isBomb, isHour, x, y) => {
        setSliceNumbers((count) => count + 1);
        if (isBomb) {
            setBombsClicked((count) => {
                let newScore = score;
                if (count === 0) {
                    newScore -= 10;
                } else if (count === 1) {
                    newScore -= 10;
                } else if (count >= 2) {
                    newScore -= 50;
                    setGameOver(true);
                    setFruits([]);
                    setSpeed(2);
                }
                setScore(newScore < 0 ? 0 : newScore);
                return count + 1;
            });
        } else if (isHour) {
            setHourglassClicks((count) => count + 1);
            setTimeLeft((prevTime) => prevTime + 2);
            // Show and animate the added time effect
            setAddedTimeEffect({ visible: true, x, y, opacity: 1 });
            setTimeout(() => {
                setAddedTimeEffect((effect) => ({ ...effect, opacity: 0 }));
            }, 100);
            setTimeout(() => {
                setAddedTimeEffect({ visible: false, x: 0, y: 0, opacity: 1 });
            }, 150);
        } else {
            // setScore((score) => score + 100);
        }
    };

    const handleRemove = (id) => {
        setFruits((fruits) => fruits.filter((fruit) => fruit.id !== id));
    };

    const handleRestart = () => {
        setSpeed(2);
        setFruits([]);
        setScore(0);
        setBombsClicked(0);
        setSliceNumbers(0);
        setHourglassClicks(0);
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
        <Container className="game-page">
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
                        {fruits.map((fruit) => (
                            <Fruit
                                key={fruit.id}
                                x={fruit.x}
                                y={fruit.y}
                                icon={fruit.icon}
                                isBomb={fruit.isBomb}
                                isHour={fruit.isHour}
                                onSlice={() => handleSlice(fruit.isBomb, fruit.isHour, fruit.x, fruit.y)}
                                onRemove={() => handleRemove(fruit.id)}
                                gameOver={gameOver}
                                speed={speed}
                                containerHeight={stageSize.height}
                                size={70}
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
                            x={stageSize.width - 50}
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
            </div>
        </Container>
    );
};

export default Game;

import React, { useState, useEffect, useMemo } from 'react';
import { Stage, Layer, Rect, Line, Text, Circle } from 'react-konva';
import Fruit from './Fruit';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
<<<<<<< HEAD
=======
import './Game.css';
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609

const Game = () => {
    const [fruits, setFruits] = useState([]);
    const [score, setScore] = useState(0);
    const [bombsClicked, setBombsClicked] = useState(0);
    const [gameOver, setGameOver] = useState(false);
<<<<<<< HEAD
    const [speed, setSpeed] = useState(6); 
    const [timeLeft, setTimeLeft] = useState(30); 
    const [timeUp, setTimeUp] = useState(false); 
    const [splashes, setSplashes] = useState([]); 
=======
    const [speed, setSpeed] = useState(6);
    const [timeLeft, setTimeLeft] = useState(30);
    const [timeUp, setTimeUp] = useState(false);
    const [splashes, setSplashes] = useState([]);
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609

    const fruitImages = useMemo(() => [
        process.env.PUBLIC_URL + '/images/banana.png',
        process.env.PUBLIC_URL + '/images/apple.png',
        process.env.PUBLIC_URL + '/images/carrot.png',
    ], []);
    const bombImage = process.env.PUBLIC_URL + '/images/bomb.png';
    const bombFull = process.env.PUBLIC_URL + '/images/bomb_full.png';

<<<<<<< HEAD
    const stageWidth = window.innerWidth < 600 ? window.innerWidth : 600; 
    const stageHeight = window.innerHeight < 1000 ? window.innerHeight : 1000; 

    useEffect(() => {
        if (gameOver || timeUp) return; 

        const interval = setInterval(() => {
            const isBomb = Math.random() < 0.2; 
=======
    const stageWidth = window.innerWidth < 600 ? window.innerWidth : 600;
    const stageHeight = window.innerHeight < 1000 ? window.innerHeight : 1000;

    useEffect(() => {
        if (gameOver || timeUp) return;

        const interval = setInterval(() => {
            const isBomb = Math.random() < 0.2;
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609
            const randomImage = isBomb
                ? bombImage
                : fruitImages[Math.floor(Math.random() * fruitImages.length)];
            setFruits((fruits) => [
                ...fruits,
                { id: Date.now(), x: Math.random() * (stageWidth - 50) + 25, y: -25, image: randomImage, isBomb },
            ]);
<<<<<<< HEAD
        }, 400); 
=======
        }, 400);
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609

        return () => clearInterval(interval);
    }, [gameOver, timeUp, fruitImages, bombImage, stageWidth]);

    useEffect(() => {
        if (bombsClicked >= 3) {
            setGameOver(true);
<<<<<<< HEAD
            setFruits([]); 
=======
            setFruits([]);
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609
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
<<<<<<< HEAD
            setTimeUp(true); 
=======
            setTimeUp(true);
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609
            setFruits([]);
        }
    }, [timeLeft, gameOver]);

    const handleSlice = (id, isBomb, x, y) => {
        setFruits((fruits) => fruits.filter((fruit) => fruit.id !== id));
        if (isBomb) {
<<<<<<< HEAD
            setScore(0); 
=======
            setScore(0);
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609
            setBombsClicked((count) => {
                const newCount = count + 1;
                if (newCount >= 3) {
                    setGameOver(true);
<<<<<<< HEAD
                    setFruits([]); 
=======
                    setFruits([]);
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609
                }
                return newCount;
            });
        } else {
            setScore((score) => score + 1);
<<<<<<< HEAD
            setSplashes((splashes) => [
                ...splashes,
                { id: Date.now(), x, y, color: 'red' } 
            ]);
=======
            // setSplashes((splashes) => [
            //     ...splashes,
            //     { id: Date.now(), x, y, color: 'red' }
            // ]);
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609
        }
    };

    const handleRemove = (id) => {
        setFruits((fruits) => fruits.filter((fruit) => fruit.id !== id));
    };

    const handleRestart = () => {
        setFruits([]);
<<<<<<< HEAD
        setSplashes([]); 
        setScore(0);
        setBombsClicked(0);
        setSpeed(6); 
        setTimeLeft(30); 
        setGameOver(false);
        setTimeUp(false); 
=======
        setSplashes([]);
        setScore(0);
        setBombsClicked(0);
        setSpeed(6);
        setTimeLeft(30);
        setGameOver(false);
        setTimeUp(false);
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609
    };

    const renderBombs = () => {
        const bombs = [];
        for (let i = 0; i < 3 - bombsClicked; i++) {
            bombs.push(
                <img
                    key={i}
                    src={bombFull}
                    alt="bomb"
                    className="bomb-icon"
                />
            );
        }
        return bombs;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

<<<<<<< HEAD
    const gridSize = 50; 
=======
    const gridSize = 50;
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609
    const verticalLines = [];
    for (let i = 0; i <= stageWidth / gridSize; i++) {
        verticalLines.push(
            <Line
                key={`v${i}`}
                points={[i * gridSize, 0, i * gridSize, stageHeight]}
                stroke="#0f0"
<<<<<<< HEAD
                strokeWidth={0.5} 
=======
                strokeWidth={0.5}
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609
            />
        );
    }

    const horizontalLines = [];
    for (let i = 0; i <= stageHeight / gridSize; i++) {
        horizontalLines.push(
            <Line
                key={`h${i}`}
                points={[0, i * gridSize, stageWidth, i * gridSize]}
                stroke="#0f0"
<<<<<<< HEAD
                strokeWidth={0.5} 
=======
                strokeWidth={0.5}
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609
            />
        );
    }

    return (
        <Container>
<<<<<<< HEAD
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        Fruit Slice Game
                    </Typography>
                </Toolbar>
            </AppBar>
=======
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609
            <div className="game-container">
                {!gameOver && !timeUp && (
                    <>
                        <div className="score">
                            Score: {score}
                        </div>
                        <div className="timer">
                            {formatTime(timeLeft)}
                        </div>
                    </>
                )}
                {!timeUp && (
                    <div className="bombs-left">
                        {renderBombs()}
                    </div>
                )}
                <Stage width={stageWidth} height={stageHeight}>
                    <Layer>
                        <Rect
                            x={0}
                            y={0}
                            width={stageWidth}
                            height={stageHeight}
<<<<<<< HEAD
                            fill="#000" 
=======
                            fill="#000"
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609
                        />
                        {verticalLines}
                        {horizontalLines}
                        {splashes.map((splash) => (
                            <Circle
                                key={splash.id}
                                x={splash.x}
                                y={splash.y}
                                radius={20}
                                fill={splash.color}
                                opacity={0.6}
                            />
                        ))}
                        <Text text={`Score: ${score}`} fontSize={24} fill="white" x={10} y={10} />
                        <Text text={`Time Left: ${formatTime(timeLeft)}`} fontSize={24} fill="white" x={10} y={40} />
                        {fruits.map((fruit) => (
                            <Fruit
                                key={fruit.id}
                                x={fruit.x}
                                y={fruit.y}
                                image={fruit.image}
                                isBomb={fruit.isBomb}
                                onSlice={(isBomb, id, x, y) => handleSlice(id, isBomb, x, y)}
                                onRemove={() => handleRemove(fruit.id)}
                                gameOver={gameOver}
<<<<<<< HEAD
                                speed={speed} 
                                containerHeight={stageHeight} 
                                size={50} 
=======
                                speed={speed}
                                containerHeight={stageHeight}
                                size={50}
>>>>>>> 4db233e1be6293f31ee671442502833ba444f609
                            />
                        ))}
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

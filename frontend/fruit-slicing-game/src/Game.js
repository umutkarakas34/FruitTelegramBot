import React, { useState, useEffect, useMemo } from 'react';
import { Stage, Layer, Rect, Line, Text, Circle } from 'react-konva';
import Fruit from './Fruit';

const Game = () => {
    const [fruits, setFruits] = useState([]);
    const [score, setScore] = useState(0);
    const [bombsClicked, setBombsClicked] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [speed, setSpeed] = useState(6); // Oyun hızı için başlangıç değeri
    const [timeLeft, setTimeLeft] = useState(30); // Başlangıç süresi 30 saniye
    const [timeUp, setTimeUp] = useState(false); // Süre dolduğunda gösterilecek mesaj için durum değişkeni
    const [splashes, setSplashes] = useState([]); // Meyve lekeleri için state

    const fruitImages = useMemo(() => [
        process.env.PUBLIC_URL + '/images/banana.png',
        process.env.PUBLIC_URL + '/images/apple.png',
        process.env.PUBLIC_URL + '/images/carrot.png',
    ], []);
    const bombImage = process.env.PUBLIC_URL + '/images/bomb.png';
    const bombFull = process.env.PUBLIC_URL + '/images/bomb_full.png';

    const stageWidth = window.innerWidth < 600 ? window.innerWidth : 600; // Maksimum genişlik 600px
    const stageHeight = window.innerHeight < 1000 ? window.innerHeight : 1000; // Maksimum yükseklik 1000px

    useEffect(() => {
        if (gameOver || timeUp) return; // Oyun bittiğinde veya süre dolduğunda meyve üretimini durdur

        const interval = setInterval(() => {
            const isBomb = Math.random() < 0.2; // %20 olasılıkla bomba
            const randomImage = isBomb
                ? bombImage
                : fruitImages[Math.floor(Math.random() * fruitImages.length)];
            setFruits((fruits) => [
                ...fruits,
                { id: Date.now(), x: Math.random() * (stageWidth - 50) + 25, y: -25, image: randomImage, isBomb },
            ]);
        }, 400); // Meyve gelme sıklığını arttırdık (600ms'den 400ms'ye düşürdük)

        return () => clearInterval(interval);
    }, [gameOver, timeUp, fruitImages, bombImage, stageWidth]);

    useEffect(() => {
        if (bombsClicked >= 3) {
            setGameOver(true);
            setFruits([]); // Game Over durumunda meyveleri temizle
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
            setTimeUp(true); // Süre dolduğunda timeUp durumunu true yap
            setFruits([]);
        }
    }, [timeLeft, gameOver]);

    const handleSlice = (id, isBomb, x, y) => {
        setFruits((fruits) => fruits.filter((fruit) => fruit.id !== id));
        if (isBomb) {
            setScore(0); // Skoru sıfırla
            setBombsClicked((count) => {
                const newCount = count + 1;
                if (newCount >= 3) {
                    setGameOver(true);
                    setFruits([]); // Game Over durumunda meyveleri temizle
                }
                return newCount;
            });
        } else {
            setScore((score) => score + 1);
            setSplashes((splashes) => [
                ...splashes,
                { id: Date.now(), x, y, color: 'red' } // Lekenin rengini ve pozisyonunu belirle
            ]);
        }
    };

    const handleRemove = (id) => {
        setFruits((fruits) => fruits.filter((fruit) => fruit.id !== id));
    };

    const handleRestart = () => {
        setFruits([]);
        setSplashes([]); // Lekeleri temizle
        setScore(0);
        setBombsClicked(0);
        setSpeed(6); // Oyunu yeniden başlatırken hızı başlangıç değerine sıfırla
        setTimeLeft(30); // Süreyi yeniden başlat
        setGameOver(false);
        setTimeUp(false); // timeUp durumunu false yap
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

    // Kareli deseni oluşturma
    const gridSize = 50; // Karelerin boyutunu artırdık
    const verticalLines = [];
    for (let i = 0; i <= stageWidth / gridSize; i++) {
        verticalLines.push(
            <Line
                key={`v${i}`}
                points={[i * gridSize, 0, i * gridSize, stageHeight]}
                stroke="#0f0"
                strokeWidth={0.5} // Çizgileri incelttik
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
                strokeWidth={0.5} // Çizgileri incelttik
            />
        );
    }

    return (
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
                        fill="#000" // Tamamen siyah zemin
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
                            speed={speed} // Hızı buraya geçiriyoruz
                            containerHeight={stageHeight} // Container yüksekliğini buraya geçiriyoruz
                            size={50} // Meyvelerin boyutunu küçülttük
                        />
                    ))}
                </Layer>
            </Stage>
            {gameOver && (
                <div className="game-over">
                    <h1>Game Over</h1>
                    <h2>Score: {score}</h2>
                    <button onClick={handleRestart}>Restart</button>
                </div>
            )}
            {timeUp && (
                <div className="time-up">
                    <h1>Süre Doldu!</h1>
                    <h2>Score: {score} puan kazandınız</h2>
                    <button onClick={handleRestart}>Restart</button>
                </div>
            )}
        </div>
    );
};

export default Game;

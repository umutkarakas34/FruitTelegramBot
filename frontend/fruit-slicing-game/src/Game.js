import React, { useState, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import Fruit from './Fruit';

const Game = () => {
    const [fruits, setFruits] = useState([]);
    const [score, setScore] = useState(0);
    const [bombsClicked, setBombsClicked] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [speed, setSpeed] = useState(6); // Oyun hızı için başlangıç değeri
    const [timeLeft, setTimeLeft] = useState(30); // Başlangıç süresi 30 saniye
    const [timeUp, setTimeUp] = useState(false); // Süre dolduğunda gösterilecek mesaj için durum değişkeni

    const fruitImages = [
        process.env.PUBLIC_URL + '/images/banana.png',
        process.env.PUBLIC_URL + '/images/apple.png',
        process.env.PUBLIC_URL + '/images/carrot.png',
    ];
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
                { id: Date.now(), x: Math.random() * (stageWidth - 100) + 50, y: -50, image: randomImage, isBomb },
            ]);
        }, 600);

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

    const handleSlice = (id, isBomb) => {
        setFruits((fruits) => fruits.filter((fruit) => fruit.id !== id));
        if (isBomb) {
            setBombsClicked((count) => {
                const newCount = count + 1;
                if (newCount >= 3) {
                    setScore((score) => score < 50 ? 0 : score - 50); // Skoru 50 azalt, ancak negatif olmasına izin verme
                } else {
                    setScore((score) => score < 10 ? 0 : score - 10); // Skoru 10 azalt, ancak negatif olmasına izin verme
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
                    {fruits.map((fruit) => (
                        <Fruit
                            key={fruit.id}
                            x={fruit.x}
                            y={fruit.y}
                            image={fruit.image}
                            isBomb={fruit.isBomb}
                            onSlice={() => handleSlice(fruit.id, fruit.isBomb)}
                            onRemove={() => handleRemove(fruit.id)}
                            gameOver={gameOver}
                            speed={speed} // Hızı buraya geçiriyoruz
                            containerHeight={stageHeight} // Container yüksekliğini buraya geçiriyoruz
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

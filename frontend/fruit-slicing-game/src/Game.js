import React, { useState, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import Fruit from './Fruit';

const Game = () => {
    const [fruits, setFruits] = useState([]);
    const [score, setScore] = useState(0);
    const [bombsClicked, setBombsClicked] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [speed, setSpeed] = useState(6); // Oyun hızı için başlangıç değeri

    const fruitImages = [
        process.env.PUBLIC_URL + '/images/banana.png',
        process.env.PUBLIC_URL + '/images/apple.png',
        process.env.PUBLIC_URL + '/images/carrot.png',
    ];
    const bombImage = process.env.PUBLIC_URL + '/images/bomb.png';

    useEffect(() => {
        if (gameOver) return;

        const interval = setInterval(() => {
            const isBomb = Math.random() < 0.2; // %20 olasılıkla bomba
            const randomImage = isBomb
                ? bombImage
                : fruitImages[Math.floor(Math.random() * fruitImages.length)];
            setFruits((fruits) => [
                ...fruits,
                { id: Date.now(), x: Math.random() * window.innerWidth, y: -50, image: randomImage, isBomb },
            ]);
        }, 1000);

        return () => clearInterval(interval);
    }, [gameOver, fruitImages, bombImage]);

    useEffect(() => {
        if (bombsClicked >= 3) {
            setGameOver(true);
            setScore(0);
            setFruits([]); // Game Over durumunda meyveleri temizle
        }
    }, [bombsClicked]);

    useEffect(() => {
        if (score > 0 && score % 10 === 0) {
            setSpeed((prevSpeed) => prevSpeed + 1);
        }
    }, [score]);

    const handleSlice = (id, isBomb) => {
        setFruits((fruits) => fruits.filter((fruit) => fruit.id !== id));
        if (isBomb) {
            setBombsClicked((count) => count + 1);
            setScore((score) => Math.max(0, score - 10)); // Skoru 10 azalt, negatif olmasına izin verme
        } else {
            setScore((score) => score + 1);
        }
    };

    const handleRestart = () => {
        setFruits([]);
        setScore(0);
        setBombsClicked(0);
        setSpeed(6); // Oyunu yeniden başlatırken hızı başlangıç değerine sıfırla
        setGameOver(false);
    };

    return (
        <div>
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    {fruits.map((fruit) => (
                        <Fruit
                            key={fruit.id}
                            x={fruit.x}
                            y={fruit.y}
                            image={fruit.image}
                            isBomb={fruit.isBomb}
                            onSlice={() => handleSlice(fruit.id, fruit.isBomb)}
                            gameOver={gameOver}
                            speed={speed} // Hızı buraya geçiriyoruz
                        />
                    ))}
                </Layer>
            </Stage>
            <div style={{ position: 'absolute', top: 10, left: 10, fontSize: 24, color: 'black' }}>
                Score: {score}
            </div>
            {gameOver && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: 'red'
                }}>
                    <h1>Game Over</h1>
                    <button onClick={handleRestart} style={{ fontSize: 24 }}>
                        Restart
                    </button>
                </div>
            )}
        </div>
    );
};

export default Game;

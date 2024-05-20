import React, { useState, useRef, useEffect } from 'react';

export const Counter = () => {
    const timer = useRef<NodeJS.Timer>();
    const [count, setCount] = useState(0);

    const onStart = () => {
        timer.current = setInterval(() => {
            setCount(count => count + 1);
        }, 1000);
    };

    const onStop = () => {
        clearInterval(timer.current);
        timer.current = undefined;
    };

    useEffect(() => {
        onStart();

        return onStop;
    }, [])

    return (
        <>
        <h2>
        Count: {count}
        </h2>
        </>
    );
};


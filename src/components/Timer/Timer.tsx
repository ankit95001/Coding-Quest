import React, { useEffect, useState } from "react";

type TimerProps = {};

const Timer: React.FC<TimerProps> = () => {
	const [time, setTime] = useState<number>(() => {
		// const savedTime = localStorage.getItem("timer");
		// return savedTime !== null ? parseInt(savedTime, 10) : 3600;
        return 3600;
	});

	const formatTime = (time: number): string => {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor((time % 3600) / 60);
		const seconds = time % 60;

		return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${
			seconds < 10 ? "0" + seconds : seconds
		}`;
	};

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime((time) => {
				const newTime = time - 1;
				// localStorage.setItem("timer", newTime.toString());
				return newTime;
			});
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		if (time === 0) {
			handleLogout();
		}
	}, [time]);

	const handleLogout = () => {
		alert("Your session has expired. Logging out...");
		// Perform logout logic here (e.g., clear user session, redirect to login page, etc.)
		localStorage.removeItem("timer"); // Clear the timer from localStorage upon logout
	};


	return (
		<div>
			<div className='flex items-center space-x-2 bg-dark-fill-3 p-1.5 cursor-pointer rounded hover:bg-dark-fill-2'>
				<div>{formatTime(time)}</div>
			</div>
		</div>
	);
};

export default Timer;

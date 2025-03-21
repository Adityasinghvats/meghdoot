import React from 'react';

const Rainfall = () => {
  const raindrops = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 1 + 0.5}s`,
    animationDelay: `${Math.random() * 2}s`
  }));

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">
      {raindrops.map(drop => (
        <div
          key={drop.id}
          className="absolute bg-blue-800/30 w-[2px] h-[15px]"
          style={{
            left: drop.left,
            animation: `rainfall ${drop.animationDuration} linear ${drop.animationDelay} infinite`
          }}
        />
      ))}
    </div>
  );
};

export default Rainfall;
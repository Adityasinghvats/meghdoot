import React from 'react';

const Rainfall = () => {
  const raindrops = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 1 + 0.5}s`,
    animationDelay: `${Math.random() * 2}s`
  }));

  const clouds = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 40 + 5}%`,
    scale: Math.random() * 0.5 + 0.7,
    opacity: Math.random() * 0.4 + 0.3,
    animationDuration: `${Math.random() * 15 + 20}s`, // Faster animation (was 30+40s)
    animationDelay: `${Math.random() * 10}s` // Reduced delay (was 15s)
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
      
      {clouds.map(cloud => (
        <div
          key={`cloud-${cloud.id}`}
          className="absolute"
          style={{
            top: cloud.top,
            left: '-150px',
            opacity: cloud.opacity,
            transform: `scale(${cloud.scale})`,
            animation: `cloudMove ${cloud.animationDuration} linear ${cloud.animationDelay} infinite`
          }}
        >
          <div className="w-32 h-12 bg-blue-400 rounded-full shadow-lg"></div>
          <div className="w-16 h-16 bg-blue-400 rounded-full absolute -top-6 -left-2"></div>
          <div className="w-20 h-16 bg-blue-400 rounded-full absolute -top-4 left-8"></div>
          <div className="w-16 h-12 bg-blue-400 rounded-full absolute -top-2 left-20"></div>
        </div>
      ))}
    </div>
  );
};

export default Rainfall;
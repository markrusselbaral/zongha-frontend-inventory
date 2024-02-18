import React, { useState } from 'react';
import {motion} from 'framer-motion'

interface AnimatedWordProps {
  name: string;
  animation: any;
  isHover: boolean
}

interface AnimatedLinkProps {
    name: string;
  }

const nameAnimation = {
    rest: {
        transition: {
            staggerChildren: 0.02,
        },
    },
    hover: {
        transition: {
            staggerChildren: 0.02,
        },
    },
}

const letterAnimation ={
    rest: {
        y: 0,
    },
    hover: {
        y: -25,
        transition: {
            duration: 0.3,
            ease: [0.6, 0.01, 0.05, 0.95],
            type: "tween"
        },
    },
};
const letterAnimationTwo ={
    rest: {
        y: 25,
    },
    hover: {
        y: 0,
        transition: {
            duration: 0.3,
            ease: [0.6, 0.01, 0.05, 0.95],
            type: "tween"
        },
    },
};

const AnimatedWord: React.FC<AnimatedWordProps> = ({ name, animation, isHover }) => {
  return (
    <motion.span variants={nameAnimation} initial='rest'  animate={isHover ? 'hover' : 'rest'} className='relative whitespace-nowrap'>
      {name.split('').map((character, i) =>
        character === ' ' ? (
          <span key={i}>&nbsp;</span>
        ) : (
          <motion.span variants={animation} className='relative inline-block whitespace-nowrap' key={i}>
            {character}
          </motion.span>
        )
      )}
    </motion.span>
  );
};

const AnimatedText: React.FC<AnimatedLinkProps> = ({ name }) => {
    const [isHover, setIsHover] = useState(false)
  return (
    <motion.div onMouseEnter={() => setIsHover(true)} onMouseLeave={()=> setIsHover(false)} className='relative cursor-pointer overflow-hidden'>
      <AnimatedWord animation={letterAnimation} name={name} isHover={isHover}/>
      <div className='absolute top-0 text-blue-600'>
        <AnimatedWord animation={letterAnimationTwo} name={name} isHover={isHover}/>
      </div>
    </motion.div>
  );
};

export default AnimatedText;
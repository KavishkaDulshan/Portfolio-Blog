import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SiGithub, SiJavascript, SiReact, 
  SiNodedotjs, SiTailwindcss, SiPython, SiGit,
  SiAndroidstudio, SiArduino, SiEspressif,
  SiFlutter, SiDocker, SiPostman, SiMongodb, SiRaspberrypi, SiLinux, SiGithubcopilot,
  SiTypescript, SiCplusplus, SiDart, SiPostgresql, SiExpress, SiFirebase, SiFigma, SiOpenai, SiTensorflow, SiSocketdotio, SiPhp,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { VscAzure } from 'react-icons/vsc';

const icons = [
  { Icon: SiGithub,        label: 'GitHub' },
  { Icon: SiAndroidstudio, label: 'Android Studio' },
  { Icon: SiReact,         label: 'React' },
  { Icon: SiNodedotjs,     label: 'Node.js' },
  { Icon: SiTailwindcss,   label: 'Tailwind CSS' },
  { Icon: SiPython,        label: 'Python' },
  { Icon: SiArduino,       label: 'Arduino' },
  { Icon: SiEspressif,     label: 'ESP32' },
  { Icon: SiGit,           label: 'Git' },
  { Icon: SiFlutter,       label: 'Flutter' },
  { Icon: SiDocker,        label: 'Docker' },
  { Icon: SiPostman,       label: 'Postman' },
  { Icon: SiMongodb,       label: 'MongoDB' },
  { Icon: SiGithubcopilot, label: 'GitHub Copilot' },
  { Icon: SiRaspberrypi,   label: 'Raspberry Pi' },
  { Icon: SiLinux,         label: 'Linux' },
  { Icon: SiTypescript,    label: 'TypeScript' },
  { Icon: FaJava,          label: 'Java' },
  { Icon: SiCplusplus,     label: 'C / C++' },
  { Icon: SiDart,          label: 'Dart' },
  { Icon: SiPostgresql,    label: 'PostgreSQL' },
  { Icon: SiExpress,       label: 'Express' },
  { Icon: SiPhp,           label: 'PHP' },
  { Icon: SiFirebase,      label: 'Firebase' },
  { Icon: VscAzure,        label: 'Azure' },
  { Icon: SiFigma,         label: 'Figma' },
  { Icon: SiOpenai,        label: 'OpenAI' },
  { Icon: SiTensorflow,    label: 'TensorFlow' },
  { Icon: SiSocketdotio,   label: 'Socket.IO' },

];

export default function TechStack() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="pt-10 pb-2 relative z-20">
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-5">Technologies</p>

      {/* Stacked icon group */}
      <motion.div 
        className="flex items-center flex-wrap gap-y-4 pl-[14px]"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        {icons.map(({ Icon, label }, i) => (
          <motion.div
            key={label}
            style={{ marginLeft: -14, zIndex: hovered === i ? 100 : icons.length - i }}
            variants={{
              rest:  { x: 0 },
              hover: { x: i * 10 },
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 24, delay: i * 0.025 }}
            className="relative"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {hovered === i && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white
                             text-xs px-2.5 py-1 rounded-md whitespace-nowrap pointer-events-none z-50"
                >
                  {label}
                  {/* Arrow */}
                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4
                                   border-transparent border-t-gray-900" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Icon circle */}
            <motion.div
              whileHover={{ scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="w-10 h-10 rounded-full bg-white border-2 border-gray-200
                         flex items-center justify-center shadow-sm cursor-default"
            >
              <Icon className="w-5 h-5 text-gray-900" />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SiGithub, SiJavascript, SiReact, SiHtml5, SiCss,
  SiNodedotjs, SiTailwindcss, SiPython, SiGit,
  SiAndroidstudio, SiArduino, SiEspressif,
  SiFlutter, SiDocker, SiPostman, SiMongodb, SiIntellijidea, SiSwagger, SiRaspberrypi, 
} from 'react-icons/si';

const icons = [
  { Icon: SiGithub,        label: 'GitHub' },
  { Icon: SiJavascript,    label: 'JavaScript' },
  { Icon: SiAndroidstudio, label: 'Android Studio' },
  { Icon: SiReact,         label: 'React' },
  { Icon: SiNodedotjs,     label: 'Node.js' },
  { Icon: SiTailwindcss,   label: 'Tailwind CSS' },
  { Icon: SiPython,        label: 'Python' },
  { Icon: SiArduino,       label: 'Arduino' },
  { Icon: SiEspressif,     label: 'ESP32' },
  { Icon: SiHtml5,         label: 'HTML5' },
  { Icon: SiCss,           label: 'CSS3' },
  { Icon: SiGit,           label: 'Git' },
  { Icon: SiFlutter,       label: 'Flutter' },
  { Icon: SiDocker,        label: 'Docker' },
  { Icon: SiPostman,       label: 'Postman' },
  { Icon: SiMongodb,       label: 'MongoDB' },
  { Icon: SiIntellijidea,  label: 'IntelliJ IDEA' },
  { Icon: SiSwagger,       label: 'Swagger' },
  { Icon: SiRaspberrypi,   label: 'Raspberry Pi' },

];

export default function TechStack() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="pt-10 pb-2">
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-5">Technologies</p>

      {/* Stacked icon group */}
      <motion.div
        className="flex items-center flex-wrap gap-y-4"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        {icons.map(({ Icon, label }, i) => (
          <motion.div
            key={label}
            style={{ marginLeft: i === 0 ? 0 : -14, zIndex: icons.length - i }}
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
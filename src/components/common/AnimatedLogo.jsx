import { motion } from "framer-motion";

function AnimatedLogo() {
  return (
    <div className="pointer-events-none absolute right-6 top-20 z-20 hidden xl:block">
      <motion.div
        animate={{
          y: [0, -16, 0],
          rotate: [0, 4, -4, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex items-center justify-center"
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute h-40 w-40 rounded-full border border-dashed border-white/25"
        />

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            boxShadow: [
              "0 0 0 rgba(217, 4, 4, 0)",
              "0 0 55px rgba(217, 4, 4, 0.55)",
              "0 0 0 rgba(217, 4, 4, 0)",
            ],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-white/70 bg-black/60 p-4 backdrop-blur"
        >
          <motion.img
            src="/images/logos/nexacore-logo-light.png"
            alt="NexaCore logo"
            className="h-full w-full object-contain"
            animate={{
              rotateY: [0, 180, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.div
          animate={{
            opacity: [0.35, 1, 0.35],
            scaleX: [0.75, 1, 0.75],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="absolute top-[150px] h-px w-28 bg-gradient-to-r from-transparent via-[#D90404] to-transparent"
        />
      </motion.div>
    </div>
  );
}

export default AnimatedLogo;
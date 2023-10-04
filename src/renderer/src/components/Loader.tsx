import { motion } from 'framer-motion'

const Loader = () => {
  return (
    <div className="flex h-16 justify-center items-end space-x-2">
      <motion.div
        className="h-4 w-2 bg-green-500 rounded"
        animate={{
          scaleY: [1, 0.5, 1.2, 0.8, 1]
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1
        }}
        style={{ originY: 1 }}
      ></motion.div>
      <motion.div
        className="h-4 w-2 bg-yellow-500 rounded"
        animate={{
          scaleY: [1, 0.5, 1.2, 0.8, 1]
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1
        }}
        style={{ originY: 1 }}
      ></motion.div>
      <motion.div
        className="h-4 w-2 bg-red-500 rounded"
        animate={{
          scaleY: [1, 0.5, 1.2, 0.8, 1]
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 1
        }}
        style={{ originY: 1 }}
      ></motion.div>
    </div>
  )
}

export default Loader

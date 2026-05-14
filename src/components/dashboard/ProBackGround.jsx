// src/components/Background/ProBackground.jsx
import { motion } from "framer-motion";

export default function ProBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Gradient animé */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
    </div>
  );
}
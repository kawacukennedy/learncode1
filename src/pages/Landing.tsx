import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code, Share, Search, Zap, Sparkles, Rocket, Star } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";

export default function Landing() {
  return (
    <Layout>
      <div className="relative min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
            <div
              className={
                'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%234f46e5" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-50'
              }
            ></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
            <div className="text-center">
              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 mb-6 leading-tight">
                Master Code,
                <br />
                Share Knowledge
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                The ultimate platform for developers to store, share, and
                discover
                <span className="text-blue-400 font-semibold">
                  {" "}
                  code snippets
                </span>
                . Build your personal library and learn from the community.
              </p>

              {/* CTA Button */}
              <Link to="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  Get Started
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <motion.div
          className="relative bg-gray-900/50 py-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Everything you need to manage code
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Powerful tools designed for developers, by developers
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group relative overflow-hidden"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)",
                }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.div
                  className="bg-blue-500/10 rounded-lg p-3 w-fit mb-6 group-hover:bg-blue-500/20 transition-colors relative z-10"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Code className="h-8 w-8 text-blue-400" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-4 relative z-10">
                  Smart Code Storage
                </h3>
                <p className="text-gray-400 leading-relaxed relative z-10">
                  Organize your code snippets with syntax highlighting, tags,
                  and intelligent categorization. Never lose track of your best
                  solutions again.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group relative overflow-hidden"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(168, 85, 247, 0.2)",
                }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.div
                  className="bg-purple-500/10 rounded-lg p-3 w-fit mb-6 group-hover:bg-purple-500/20 transition-colors relative z-10"
                  whileHover={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  <Share className="h-8 w-8 text-purple-400" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-4 relative z-10">
                  Easy Sharing
                </h3>
                <p className="text-gray-400 leading-relaxed relative z-10">
                  Share your knowledge with the community. Export snippets,
                  collaborate with team members, and build your developer
                  reputation.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 group relative overflow-hidden"
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(6, 182, 212, 0.2)",
                }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.div
                  className="bg-cyan-500/10 rounded-lg p-3 w-fit mb-6 group-hover:bg-cyan-500/20 transition-colors relative z-10"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Search className="h-8 w-8 text-cyan-400" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-4 relative z-10">
                  Lightning Search
                </h3>
                <p className="text-gray-400 leading-relaxed relative z-10">
                  Find exactly what you need with powerful search capabilities.
                  Filter by language, tags, or content to discover the perfect
                  snippet.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
        {/* CTA Section */}
        <motion.div
          className="relative bg-gradient-to-r from-blue-600/10 to-purple-600/10 py-20 overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Animated Stars */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            >
              <Star className="h-4 w-4 fill-current" />
            </motion.div>
          ))}

          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Ready to level up your development workflow?
            </motion.h2>
            <motion.p
              className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join thousands of developers who are already using LearnCode to
              organize, share, and discover amazing code snippets.
            </motion.p>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link to="/login">
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 25px 50px rgba(147, 51, 234, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-xl relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 1,
                      }}
                    />
                    <span className="relative z-10">Start Your Journey</span>
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative z-10 ml-2"
                    >
                      <Rocket className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resetPassword } from "@/lib/auth";
import {
  KeyRound,
  ArrowLeft,
  Mail,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await resetPassword(email);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Password reset failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
          {/* Animated Background */}
          <motion.div
            className="absolute top-20 right-20 w-48 h-48 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="w-full max-w-md relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gray-900 border-gray-700 shadow-2xl backdrop-blur-sm">
                <CardHeader className="text-center">
                  <motion.div
                    className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4 relative"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 border-2 border-green-400/20 rounded-full border-t-green-400"
                    />
                    <CheckCircle className="h-8 w-8 text-green-400 z-10" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <CardTitle className="text-white text-xl mb-2">
                      Email Sent Successfully!
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Check your inbox for password reset instructions
                    </CardDescription>
                  </motion.div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <motion.div
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Mail className="h-5 w-5 text-blue-400" />
                      <span className="text-white font-medium">
                        Email Address
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      <strong className="text-blue-400">{email}</strong>
                    </p>
                  </motion.div>

                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                      <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        What happens next?
                      </h4>
                      <ul className="text-gray-400 text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>
                            Check your email inbox (including spam folder)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>
                            Click the password reset link in the email
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>Create a new secure password</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>Sign in with your new password</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                      <h4 className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Security Note
                      </h4>
                      <p className="text-gray-400 text-sm">
                        For security reasons, the reset link will expire in 24
                        hours. If you don't receive an email, please check your
                        spam folder or try again.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <Link to="/login">
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Sign In
                        </Link>
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => {
                          setSuccess(false);
                          setEmail("");
                          setError("");
                        }}
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send to Different Email
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <div className="w-full max-w-md relative z-10">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Reset Your Password
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block ml-2"
              >
                🔐
              </motion.span>
            </motion.h1>
            <motion.p
              className="text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Enter your email address and we'll send you a reset link
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gray-900 border-gray-700 shadow-2xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-blue-400" />
                  Forgot Password
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Don't worry, it happens to the best of us!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <motion.div
                      className="bg-red-900/50 border border-red-500 rounded-md p-3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-red-400 text-sm">{error}</p>
                    </motion.div>
                  )}

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Label htmlFor="email" className="text-gray-200">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 transition-all duration-300 hover:border-purple-500/50"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold relative overflow-hidden group"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.5 }}
                        />
                        {loading ? (
                          <div className="flex items-center gap-2 relative z-10">
                            <motion.div
                              className="rounded-full h-4 w-4 border-b-2 border-white"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            Sending Reset Link...
                          </div>
                        ) : (
                          <span className="relative z-10 flex items-center justify-center">
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reset Link
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="text-center">
                      <Link
                        to="/login"
                        className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Sign In
                      </Link>
                    </div>

                    <div className="text-center text-sm text-gray-400">
                      Remember your password?{" "}
                      <Link
                        to="/login"
                        className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                      >
                        Sign in instead
                      </Link>
                    </div>

                    <div className="text-center text-sm text-gray-400">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                      >
                        Create one now
                      </Link>
                    </div>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

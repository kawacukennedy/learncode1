import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CodeEditor } from "@/components/ui/code-editor";
import { createSnippet } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import {
  ArrowLeft,
  Upload,
  Code,
  Plus,
  X,
  Globe,
  Lock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";

const PROGRAMMING_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "HTML",
  "CSS",
  "SQL",
  "Bash",
  "PowerShell",
  "R",
  "MATLAB",
  "Scala",
  "Other",
];

export default function UploadPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    language: "",
    isPublic: true, // Default to public to encourage community sharing
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }

    if (!formData.title.trim() || !formData.code.trim() || !formData.language) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const result = await createSnippet(user.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        code: formData.code,
        language: formData.language,
        isPublic: formData.isPublic,
        tags: formData.tags,
      });

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Failed to create snippet");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLanguageChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      language: value,
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-950">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <motion.div
            className="absolute top-20 right-20 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Header */}
        <motion.div
          className="bg-gray-900 border-b border-gray-800 relative z-10"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <motion.h1
                  className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Upload Code Snippet
                </motion.h1>
                <motion.p
                  className="text-gray-400 mt-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Share your code with the community
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-400" />
                  Create New Snippet
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Fill in the details below to create your code snippet
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

                  {/* Title */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Label htmlFor="title" className="text-gray-200">
                      Title <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 transition-all duration-300 hover:border-purple-500/50"
                      placeholder="Enter a descriptive title for your snippet"
                    />
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Label htmlFor="description" className="text-gray-200">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 min-h-[100px] transition-all duration-300 hover:border-purple-500/50"
                      placeholder="Describe what this code does, how to use it, or any important notes..."
                    />
                  </motion.div>

                  {/* Programming Language */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Label className="text-gray-200">
                      Programming Language{" "}
                      <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={formData.language}
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-blue-500">
                        <SelectValue placeholder="Select a programming language" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {PROGRAMMING_LANGUAGES.map((lang) => (
                          <SelectItem
                            key={lang}
                            value={lang}
                            className="text-white focus:bg-gray-700 focus:text-white"
                          >
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* Tags */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Label className="text-gray-200">Tags</Label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Add a tag..."
                          className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500"
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <motion.div
                              key={index}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 flex items-center gap-2"
                            >
                              <span className="text-blue-400 text-sm">
                                {tag}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="text-blue-400 hover:text-red-400 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Public/Private Toggle */}
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <div className="flex items-center gap-2">
                      <Label className="text-gray-200">
                        Share with Community
                      </Label>
                      {formData.isPublic && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles className="h-4 w-4 text-blue-400" />
                        </motion.div>
                      )}
                    </div>

                    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            animate={
                              formData.isPublic ? { scale: [1, 1.1, 1] } : {}
                            }
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {formData.isPublic ? (
                              <Globe className="h-5 w-5 text-green-400" />
                            ) : (
                              <Lock className="h-5 w-5 text-yellow-400" />
                            )}
                          </motion.div>
                          <div>
                            <span className="text-white font-medium">
                              {formData.isPublic ? "Public" : "Private"}
                            </span>
                            <p className="text-gray-400 text-xs">
                              {formData.isPublic
                                ? "Other developers can discover and learn from your code"
                                : "Only you can see this snippet"}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={formData.isPublic}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              isPublic: checked,
                            }))
                          }
                        />
                      </div>

                      {formData.isPublic && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-blue-500/10 border border-blue-500/20 rounded-md p-3"
                        >
                          <div className="flex items-start gap-2">
                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <TrendingUp className="h-4 w-4 text-blue-400 mt-0.5" />
                            </motion.div>
                            <div>
                              <p className="text-blue-400 text-sm font-medium">
                                Sharing builds community! 🚀
                              </p>
                              <p className="text-blue-300 text-xs mt-1">
                                Your snippet will appear in the{" "}
                                <Link
                                  to="/explore"
                                  className="underline hover:text-blue-200"
                                >
                                  Explore page
                                </Link>{" "}
                                where others can discover and learn from it.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Code Editor */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Label className="text-gray-200">
                      Code <span className="text-red-400">*</span>
                    </Label>
                    <CodeEditor
                      value={formData.code}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          code: e.target.value,
                        }))
                      }
                      placeholder="Paste your code here..."
                      className="min-h-[300px] font-mono text-sm"
                      required
                    />
                  </motion.div>

                  {/* Preview */}
                  {formData.code && (
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Label className="text-gray-200">Preview</Label>
                      <div className="bg-gray-800 border border-gray-700 rounded-md p-4">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-600">
                          <Code className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium text-white">
                            {formData.title || "Untitled Snippet"}
                          </span>
                          {formData.language && (
                            <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                              {formData.language}
                            </span>
                          )}
                          {formData.isPublic ? (
                            <Globe className="h-3 w-3 text-green-400" />
                          ) : (
                            <Lock className="h-3 w-3 text-yellow-400" />
                          )}
                        </div>
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {formData.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                          <code>{formData.code}</code>
                        </pre>
                      </div>
                    </motion.div>
                  )}

                  {/* Actions */}
                  <motion.div
                    className="flex flex-col sm:flex-row gap-3 pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1"
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
                            Creating snippet...
                          </div>
                        ) : (
                          <span className="relative z-10 flex items-center">
                            <Upload className="h-4 w-4 mr-2" />
                            Create Snippet
                          </span>
                        )}
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        asChild
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 sm:w-auto"
                      >
                        <Link to="/dashboard">Cancel</Link>
                      </Button>
                    </motion.div>
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

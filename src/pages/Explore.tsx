import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPublicSnippets, searchAllPublicSnippets } from "@/lib/storage";
import { likeSnippet } from "@/lib/api";
import { Snippet } from "@/types";
import {
  Search,
  Code,
  Calendar,
  User,
  Heart,
  Filter,
  Sparkles,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";

const PROGRAMMING_LANGUAGES = [
  "All",
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
  "Other",
];

export default function Explore() {
  const [publicSnippets, setPublicSnippets] = useState<Snippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const snippets = getPublicSnippets();
    setPublicSnippets(snippets);
    setFilteredSnippets(snippets);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = searchQuery
      ? searchAllPublicSnippets(searchQuery)
      : publicSnippets;

    if (selectedLanguage !== "All") {
      filtered = filtered.filter(
        (snippet) => snippet.language === selectedLanguage,
      );
    }

    // Sort snippets
    if (sortBy === "popular") {
      filtered = filtered.sort((a, b) => b.likes - a.likes);
    } else {
      filtered = filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    setFilteredSnippets(filtered);
  }, [searchQuery, selectedLanguage, sortBy, publicSnippets]);

  const handleLike = async (snippetId: string) => {
    const result = await likeSnippet(snippetId);
    if (result.success && result.snippet) {
      setPublicSnippets((prev) =>
        prev.map((snippet) =>
          snippet.id === snippetId
            ? { ...snippet, likes: result.snippet!.likes }
            : snippet,
        ),
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-950">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <motion.div
            className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
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
          <motion.div
            className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4 mb-6">
              <Link
                to="/dashboard"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex-1">
                <motion.h1
                  className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-block mr-2"
                  >
                    <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
                  </motion.div>
                  Community Code Hub
                </motion.h1>
                <motion.div
                  className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <p className="text-gray-400 text-sm sm:text-base">
                    Discover code snippets shared by developers worldwide
                  </p>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex items-center gap-1 text-green-400 text-xs sm:text-sm"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>{filteredSnippets.length} snippets available</span>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Search and Filters */}
            <motion.div
              className="flex flex-col md:flex-row gap-4 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search snippets, languages, or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>

              {/* Language Filter */}
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <SelectItem
                      key={lang}
                      value={lang}
                      className="text-white focus:bg-gray-700"
                    >
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(value: "recent" | "popular") =>
                  setSortBy(value)
                }
              >
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem
                    value="recent"
                    className="text-white focus:bg-gray-700"
                  >
                    Recent
                  </SelectItem>
                  <SelectItem
                    value="popular"
                    className="text-white focus:bg-gray-700"
                  >
                    Popular
                  </SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Results Count */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-400">
              Found {filteredSnippets.length} snippet
              {filteredSnippets.length !== 1 ? "s" : ""}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </motion.div>

          {/* Snippets Grid */}
          {filteredSnippets.length > 0 ? (
            <motion.div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
              layout
            >
              <AnimatePresence>
                {filteredSnippets.map((snippet, index) => (
                  <motion.div
                    key={snippet.id}
                    layout
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="bg-gray-900 border-gray-700 hover:border-purple-500/50 transition-all duration-300 group h-full relative overflow-hidden">
                      <motion.div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <CardHeader className="pb-3 relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-white text-lg truncate group-hover:text-purple-300 transition-colors">
                              {snippet.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge
                                variant="secondary"
                                className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                              >
                                {snippet.language}
                              </Badge>
                              {snippet.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="border-gray-600 text-gray-400 text-xs hover:border-purple-500/50 transition-colors"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {snippet.userName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(snippet.createdAt)}
                              </span>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => handleLike(snippet.id)}
                            className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.1 }}
                          >
                            <motion.div
                              animate={
                                snippet.likes > 0 ? { scale: [1, 1.2, 1] } : {}
                              }
                              transition={{ duration: 0.3 }}
                            >
                              <Heart
                                className={`h-4 w-4 ${snippet.likes > 0 ? "fill-red-400 text-red-400" : ""}`}
                              />
                            </motion.div>
                            <span className="text-xs">{snippet.likes}</span>
                          </motion.button>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0 relative z-10">
                        {snippet.description && (
                          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                            {snippet.description}
                          </p>
                        )}

                        <motion.div
                          className="bg-gray-800 rounded-md p-3 overflow-hidden group-hover:bg-gray-750 transition-colors"
                          whileHover={{ scale: 1.02 }}
                        >
                          <pre className="text-xs text-gray-300 font-mono overflow-hidden">
                            <code className="line-clamp-4">{snippet.code}</code>
                          </pre>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Code className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                No snippets found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms or filters"
                  : "Be the first to share a public code snippet!"}
              </p>
              <Link to="/upload">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Code className="h-4 w-4 mr-2" />
                  Share Your First Snippet
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}

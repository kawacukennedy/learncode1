import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser, logout } from "@/lib/auth";
import {
  getRecentSnippets,
  searchSnippets,
  getUsers,
  getPublicSnippets,
  searchAllPublicSnippets,
} from "@/lib/storage";
import { Snippet, User } from "@/types";
import {
  Plus,
  Search,
  Code,
  Calendar,
  User as UserIcon,
  LogOut,
  Globe,
  Lock,
  Heart,
} from "lucide-react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [recentSnippets, setRecentSnippets] = useState<Snippet[]>([]);
  const [communitySnippets, setCommunitySnippets] = useState<Snippet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Snippet[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Helper function to get username by user ID
  const getUserName = (userId: string): string => {
    const users = getUsers();
    const snippetUser = users.find((u) => u.id === userId);
    return snippetUser ? snippetUser.name : "Unknown User";
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setRecentSnippets(getRecentSnippets(currentUser.id));

      // Get recent community snippets (excluding current user's snippets)
      const allPublicSnippets = getPublicSnippets();
      const otherUsersSnippets = allPublicSnippets
        .filter((snippet) => snippet.userId !== currentUser.id)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 4);
      setCommunitySnippets(otherUsersSnippets);
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim() && user) {
      setIsSearching(true);
      // Search both user's own snippets and community snippets
      const userResults = searchSnippets(user.id, searchQuery);
      const communityResults = searchAllPublicSnippets(searchQuery).filter(
        (snippet) => snippet.userId !== user.id,
      ); // Exclude user's own snippets from community results

      // Combine results with user's snippets first
      const combinedResults = [...userResults, ...communityResults];
      setSearchResults(combinedResults);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchQuery, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const displayedSnippets = isSearching ? searchResults : recentSnippets;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-950">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute top-10 right-10 sm:top-20 sm:right-20 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
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
            className="absolute bottom-10 left-10 sm:bottom-20 sm:left-20 w-24 h-24 sm:w-36 sm:h-36 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-2xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="min-w-0 flex-1"
              >
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 truncate">
                  Welcome back, {user?.name}!
                  <motion.span
                    animate={{ rotate: [0, 20, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                    className="inline-block ml-2"
                  >
                    👋
                  </motion.span>
                </h1>
                <p className="text-gray-400 mt-1 text-sm sm:text-base">
                  Manage your code snippets and discover new ones
                </p>
              </motion.div>

              <motion.div
                className="flex flex-wrap items-center gap-2 sm:gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs sm:text-sm relative"
                  >
                    <Link to="/upload">
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Share Code</span>
                      <span className="sm:hidden">Share</span>
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xs sm:text-sm"
                  >
                    <Link to="/explore">
                      <Globe className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Explore
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs sm:text-sm"
                  >
                    <Link to="/profile">
                      <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Profile</span>
                      <span className="sm:hidden">Me</span>
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-gray-800 p-2"
                  >
                    <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10">
          {/* Community Sharing Banner */}
          {recentSnippets.length > 0 && (
            <motion.div
              className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Globe className="h-5 w-5 text-blue-400" />
                </motion.div>
                <div className="flex-1">
                  <p className="text-blue-400 font-medium text-sm">
                    🌟 Your snippets are helping the developer community!
                  </p>
                  <p className="text-blue-300 text-xs mt-1">
                    Public snippets appear in{" "}
                    <Link
                      to="/explore"
                      className="underline hover:text-blue-200"
                    >
                      Community Hub
                    </Link>{" "}
                    where other developers can discover and learn from your
                    code.
                  </p>
                </div>
                <Link
                  to="/explore"
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  View Community →
                </Link>
              </div>
            </motion.div>
          )}

          {/* Search Bar */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="relative w-full sm:max-w-md">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </motion.div>
              <Input
                type="text"
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 transition-all duration-300 hover:border-purple-500/50 w-full"
              />
            </div>
            {isSearching && (
              <motion.p
                className="text-gray-400 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Found {searchResults.length} snippet
                {searchResults.length !== 1 ? "s" : ""} matching "{searchQuery}"
              </motion.p>
            )}
          </motion.div>

          {/* Snippets Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                {isSearching ? "Search Results" : "Your Recent Snippets"}
              </h2>
              {!isSearching && recentSnippets.length > 0 && (
                <Link
                  to="/profile"
                  className="text-blue-400 hover:text-blue-300 text-sm self-start sm:self-auto"
                >
                  View all snippets →
                </Link>
              )}
            </div>

            {displayedSnippets.length > 0 ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                {displayedSnippets.map((snippet) => (
                  <motion.div
                    key={snippet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-300 h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-white text-base sm:text-lg truncate">
                              {snippet.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-gray-400 text-xs mt-1 mb-2">
                              <UserIcon className="h-3 w-3" />
                              <span>
                                by{" "}
                                {snippet.userId === user?.id
                                  ? "You"
                                  : getUserName(snippet.userId)}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge
                                variant="secondary"
                                className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs"
                              >
                                {snippet.language}
                              </Badge>
                              {snippet.isPublic ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-500/10 text-green-400 border-green-500/20 text-xs"
                                >
                                  <Globe className="h-2 w-2 mr-1" />
                                  Public
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs"
                                >
                                  <Lock className="h-2 w-2 mr-1" />
                                  Private
                                </Badge>
                              )}
                              <span className="text-gray-500 text-xs flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(snippet.createdAt)}
                              </span>
                            </div>
                          </div>
                          <Code className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 ml-2 flex-shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                          {snippet.description}
                        </p>
                        <div className="bg-gray-800 rounded-md p-2 sm:p-3 overflow-hidden">
                          <pre className="text-xs text-gray-300 font-mono overflow-hidden">
                            <code className="line-clamp-3 break-all whitespace-pre-wrap">
                              {snippet.code}
                            </code>
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                className="text-center py-8 sm:py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Code className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-2">
                  {isSearching ? "No snippets found" : "No snippets yet"}
                </h3>
                <p className="text-gray-500 mb-4 text-sm sm:text-base px-4">
                  {isSearching
                    ? "Try adjusting your search terms"
                    : "Share your first code snippet with the developer community"}
                </p>
                {!isSearching && (
                  <div className="space-y-4">
                    <Button
                      asChild
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <Link to="/upload">
                        <Plus className="h-4 w-4 mr-2" />
                        Share Your First Snippet
                      </Link>
                    </Button>
                    <p className="text-gray-600 text-xs px-4">
                      💡 Snippets are{" "}
                      <span className="text-blue-400">public by default</span>{" "}
                      so other developers can discover and learn from your code!
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Community Snippets Section */}
          {!isSearching && communitySnippets.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Globe className="h-5 w-5 text-blue-400" />
                  </motion.div>
                  Community Highlights
                </h2>
                <Link
                  to="/explore"
                  className="text-blue-400 hover:text-blue-300 text-sm self-start sm:self-auto"
                >
                  Explore more →
                </Link>
              </div>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                {communitySnippets.map((snippet) => (
                  <motion.div
                    key={snippet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-300 h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-white text-base sm:text-lg truncate">
                              {snippet.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-gray-400 text-xs mt-1 mb-2">
                              <UserIcon className="h-3 w-3" />
                              <span>by {getUserName(snippet.userId)}</span>
                              {snippet.likes && snippet.likes > 0 && (
                                <div className="flex items-center gap-1 text-pink-400">
                                  <Heart className="h-3 w-3 fill-current" />
                                  <span>{snippet.likes}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge
                                variant="secondary"
                                className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs"
                              >
                                {snippet.language}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-green-500/10 text-green-400 border-green-500/20 text-xs"
                              >
                                <Globe className="h-2 w-2 mr-1" />
                                Public
                              </Badge>
                              <span className="text-gray-500 text-xs flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(snippet.createdAt)}
                              </span>
                            </div>
                          </div>
                          <Code className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 ml-2 flex-shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                          {snippet.description}
                        </p>
                        <div className="bg-gray-800 rounded-md p-2 sm:p-3 overflow-hidden">
                          <pre className="text-xs text-gray-300 font-mono overflow-hidden">
                            <code className="line-clamp-3 break-all whitespace-pre-wrap">
                              {snippet.code}
                            </code>
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          {!isSearching && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          Total Snippets
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-white">
                          {recentSnippets.length}
                        </p>
                      </div>
                      <Code className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          Languages Used
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-white">
                          {new Set(recentSnippets.map((s) => s.language)).size}
                        </p>
                      </div>
                      <Badge className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-purple-500/10 text-purple-400 border-purple-500/20 p-0 flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold">
                          {new Set(recentSnippets.map((s) => s.language)).size}
                        </span>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
                className="sm:col-span-2 lg:col-span-1"
              >
                <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          Member Since
                        </p>
                        <p className="text-lg sm:text-2xl font-bold text-white">
                          {user ? formatDate(user.createdAt) : "—"}
                        </p>
                      </div>
                      <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}

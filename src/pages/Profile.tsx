import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { getCurrentUser, logout, updateUserProfile } from "@/lib/auth";
import { getUserSnippets } from "@/lib/storage";
import { deleteSnippet, updateSnippet } from "@/lib/api";
import { Snippet, User, UpdateSnippetData } from "@/types";
import {
  User as UserIcon,
  Edit,
  Trash2,
  Code,
  Calendar,
  LogOut,
  ArrowLeft,
  Save,
  Plus,
  X,
  Globe,
  Lock,
  Sparkles,
} from "lucide-react";
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

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [userSnippets, setUserSnippets] = useState<Snippet[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit snippet state
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateSnippetData>({
    id: "",
    title: "",
    description: "",
    code: "",
    language: "",
    isPublic: true,
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setNewName(currentUser.name);
      loadUserSnippets(currentUser.id);
    }
  }, []);

  const loadUserSnippets = (userId: string) => {
    setUserSnippets(getUserSnippets(userId));
  };

  const handleUpdateProfile = async () => {
    if (!newName.trim() || !user) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateUserProfile(user.id, { name: newName.trim() });

      if (result.success) {
        setUser(result.user!);
        setEditingProfile(false);
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.error || "Failed to update profile");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSnippet = async (snippetId: string) => {
    if (!user) return;

    if (!confirm("Are you sure you want to delete this snippet?")) {
      return;
    }

    try {
      const result = await deleteSnippet(snippetId);
      if (result.success) {
        setUserSnippets((prev) => prev.filter((s) => s.id !== snippetId));
        setSuccess("Snippet deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.error || "Failed to delete snippet");
      }
    } catch (err) {
      setError("Failed to delete snippet");
    }
  };

  const handleEditSnippet = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setEditFormData({
      id: snippet.id,
      title: snippet.title,
      description: snippet.description,
      code: snippet.code,
      language: snippet.language,
      isPublic: snippet.isPublic,
      tags: snippet.tags || [],
    });
    setTagInput("");
    setEditError("");
    setHasUnsavedChanges(false);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    if (hasUnsavedChanges) {
      if (
        confirm("You have unsaved changes. Are you sure you want to close?")
      ) {
        setEditDialogOpen(false);
        setHasUnsavedChanges(false);
      }
    } else {
      setEditDialogOpen(false);
    }
  };

  const updateEditFormData = (updates: Partial<UpdateSnippetData>) => {
    setEditFormData((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const handleUpdateSnippet = async () => {
    if (!user || !editingSnippet) return;

    if (
      !editFormData.title.trim() ||
      !editFormData.code.trim() ||
      !editFormData.language
    ) {
      setEditError("Please fill in all required fields");
      return;
    }

    setEditLoading(true);
    setEditError("");

    try {
      const result = await updateSnippet(user.id, editFormData);

      if (result.success) {
        // Update the local state
        setUserSnippets((prev) =>
          prev.map((snippet) =>
            snippet.id === editingSnippet.id ? result.snippet! : snippet,
          ),
        );
        setEditDialogOpen(false);
        setEditingSnippet(null);
        setHasUnsavedChanges(false);
        setSuccess("Snippet updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setEditError(result.error || "Failed to update snippet");
      }
    } catch (err) {
      setEditError("An unexpected error occurred");
    } finally {
      setEditLoading(false);
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !editFormData.tags.includes(trimmedTag)) {
      updateEditFormData({ tags: [...editFormData.tags, trimmedTag] });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateEditFormData({
      tags: editFormData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

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

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-950">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4 mb-6">
              <Link
                to="/dashboard"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                  My Profile
                </h1>
                <p className="text-gray-400 mt-1">
                  Manage your account and code snippets
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Success/Error Messages */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 rounded-md p-3 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-900/50 border border-green-500 rounded-md p-3 mb-4">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            {/* User Profile Section */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-blue-400" />
                  User Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-200">Name</Label>
                      {editingProfile ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="Enter your name"
                          />
                          <Button
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {loading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingProfile(false);
                              setNewName(user.name);
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">{user.name}</p>
                          <Button
                            onClick={() => setEditingProfile(true)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-gray-200">Email</Label>
                    <p className="text-gray-400">{user.email}</p>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-gray-200">Member Since</Label>
                    <p className="text-gray-400">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* User Snippets Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">My Snippets</h2>
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                {userSnippets.length} snippet
                {userSnippets.length !== 1 ? "s" : ""}
              </Badge>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/upload">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Snippet
                </Link>
              </Button>
            </div>
          </div>

          {userSnippets.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {userSnippets.map((snippet) => (
                <Card
                  key={snippet.id}
                  className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-white text-lg truncate">
                          {snippet.title}
                        </CardTitle>
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
                        {snippet.tags && snippet.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {snippet.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs text-gray-400 border-gray-600"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          onClick={() => handleEditSnippet(snippet)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white hover:bg-gray-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteSnippet(snippet.id)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {snippet.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {snippet.description}
                      </p>
                    )}
                    <div className="bg-gray-900 rounded-md p-3 overflow-hidden">
                      <pre className="text-xs text-gray-300 font-mono overflow-hidden">
                        <code className="line-clamp-4 break-all whitespace-pre-wrap">
                          {snippet.code}
                        </code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Code className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                No snippets yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first code snippet to get started
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/upload">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Snippet
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Snippet Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white w-[95vw] max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-400" />
              Edit Code Snippet
              {hasUnsavedChanges && (
                <Badge
                  variant="outline"
                  className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs"
                >
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                  Unsaved
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Update your code snippet details and content
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {editError && (
              <div className="bg-red-900/50 border border-red-500 rounded-md p-3">
                <p className="text-red-400 text-sm">{editError}</p>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-gray-200">
                Title <span className="text-red-400">*</span>
              </Label>
              <Input
                id="edit-title"
                value={editFormData.title}
                onChange={(e) => updateEditFormData({ title: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
                placeholder="Enter snippet title"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-gray-200">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) =>
                  updateEditFormData({ description: e.target.value })
                }
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
                placeholder="Describe what this code does..."
                rows={3}
              />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label className="text-gray-200">
                Programming Language <span className="text-red-400">*</span>
              </Label>
              <Select
                value={editFormData.language}
                onValueChange={(value) =>
                  updateEditFormData({ language: value })
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang} className="text-white">
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-gray-200">Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
                  placeholder="Add a tag..."
                />
                <Button
                  onClick={addTag}
                  type="button"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {editFormData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editFormData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-blue-500/10 text-blue-400 border-blue-500/20"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Visibility */}
            <div className="space-y-3">
              <Label className="text-gray-200">Share with Community</Label>
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {editFormData.isPublic ? (
                      <Globe className="h-5 w-5 text-green-400" />
                    ) : (
                      <Lock className="h-5 w-5 text-yellow-400" />
                    )}
                    <div>
                      <span className="text-white font-medium">
                        {editFormData.isPublic ? "Public" : "Private"}
                      </span>
                      <p className="text-gray-400 text-xs">
                        {editFormData.isPublic
                          ? "Other developers can discover and learn from your code"
                          : "Only you can see this snippet"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={editFormData.isPublic}
                    onCheckedChange={(checked) =>
                      updateEditFormData({ isPublic: checked })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="edit-code" className="text-gray-200">
                Code <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="edit-code"
                value={editFormData.code}
                onChange={(e) => updateEditFormData({ code: e.target.value })}
                onKeyDown={(e) => {
                  // Handle Tab key for proper indentation
                  if (e.key === "Tab") {
                    e.preventDefault();
                    const textarea = e.target as HTMLTextAreaElement;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const value = textarea.value;
                    const newValue =
                      value.substring(0, start) + "  " + value.substring(end);
                    updateEditFormData({ code: newValue });
                    // Set cursor position after the inserted spaces
                    setTimeout(() => {
                      textarea.selectionStart = textarea.selectionEnd =
                        start + 2;
                    }, 0);
                  }
                  // Ctrl+S or Cmd+S to save
                  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                    e.preventDefault();
                    handleUpdateSnippet();
                  }
                }}
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 font-mono text-sm min-h-[300px] resize-y"
                placeholder="Paste your code here...&#10;&#10;💡 Tips:&#10;• Use Tab for indentation&#10;• Ctrl+S (Cmd+S) to save&#10;• The dialog will resize automatically"
              />
              <p className="text-gray-500 text-xs">
                💡 Pro tip: Use Tab for indentation and Ctrl+S (Cmd+S) to save
                quickly
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <Button
                onClick={handleCloseEditDialog}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateSnippet}
                disabled={editLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Updating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Update Snippet
                  </div>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

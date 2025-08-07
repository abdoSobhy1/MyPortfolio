import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Github, Plus, Edit, Trash2 } from "lucide-react";
import { ShimmerPost } from "@/components/ui/shimmer";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { RichTextDisplay } from "@/components/ui/rich-text-display";
import { ImageUpload } from "@/components/ui/image-upload";

interface Post {
  id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  image_url?: string | null;
  tech_stack?: string[] | null;
  github_url?: string | null;
  demo_url?: string | null;
  created_at: string;
  updated_at: string;
  slug: string;
}

export default function DashboardPosts() {
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    image_url: "",
    tech_stack: "",
    github_url: "",
    demo_url: "",
  });

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch posts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isSignedIn) {
      fetchPosts();
    }
  }, [isSignedIn, fetchPosts]);

  const cleanupOldImage = async (oldImageUrl: string) => {
    if (!oldImageUrl) return;

    try {
      const url = new URL(oldImageUrl);
      const pathParts = url.pathname.split("/");
      const bucketIndex = pathParts.findIndex(
        (part) => part === "project-images"
      );

      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        const filePath = pathParts.slice(bucketIndex + 1).join("/");

        if (filePath) {
          await supabase.storage.from("project-images").remove([filePath]);
        }
      }
    } catch (error) {
      console.warn("Failed to cleanup old image:", error);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      title: formData.title,
      description: formData.description || null,
      content: formData.content || null,
      image_url: formData.image_url || null,
      tech_stack: formData.tech_stack
        ? formData.tech_stack.split(",").map((tech) => tech.trim())
        : null,
      github_url: formData.github_url || null,
      demo_url: formData.demo_url || null,
      slug: generateSlug(formData.title),
    };

    try {
      if (editingPost) {
        // Clean up old image if it's being replaced
        if (
          editingPost.image_url &&
          postData.image_url !== editingPost.image_url
        ) {
          await cleanupOldImage(editingPost.image_url);
        }

        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", editingPost.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Post updated successfully!",
        });
      } else {
        const { error } = await supabase.from("posts").insert(postData);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Post created successfully!",
        });
      }

      resetForm();
      fetchPosts();
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: "Failed to save post.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      description: post.description || "",
      content: post.content || "",
      image_url: post.image_url || "",
      tech_stack: post.tech_stack?.join(", ") || "",
      github_url: post.github_url || "",
      demo_url: post.demo_url || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      // Find the post to get its image URL for cleanup
      const postToDelete = posts.find((post) => post.id === id);

      const { error } = await supabase.from("posts").delete().eq("id", id);

      if (error) throw error;

      // Clean up associated image if it exists
      if (postToDelete?.image_url) {
        await cleanupOldImage(postToDelete.image_url);
      }

      toast({
        title: "Success",
        description: "Post deleted successfully!",
      });
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      image_url: "",
      tech_stack: "",
      github_url: "",
      demo_url: "",
    });
    setEditingPost(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Posts</h2>
            <p className="text-muted-foreground">Manage your portfolio posts</p>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ShimmerPost key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Posts</h2>
              <p className="text-muted-foreground">
                Manage your portfolio posts
              </p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Post
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                {post.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  {post.description && (
                    <CardDescription className="line-clamp-2">
                      {post.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {post.content && (
                      <div className="max-h-20 overflow-hidden">
                        <RichTextDisplay
                          content={post.content}
                          className="text-sm"
                        />
                      </div>
                    )}

                    {post.tech_stack && post.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tech_stack.map((tech, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {post.github_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={post.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-3 w-3 mr-1" />
                            Code
                          </a>
                        </Button>
                      )}
                      {post.demo_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={post.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Demo
                          </a>
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(post)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(post.id)}
                        className="flex-1"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first post to get started
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Post
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{editingPost ? "Edit Post" : "Add New Post"}</CardTitle>
            <CardDescription>
              {editingPost
                ? "Update your post details"
                : "Create a new portfolio post"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Project title"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Project Image</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload an image to showcase your project
                </p>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) =>
                    setFormData({ ...formData, image_url: url })
                  }
                  onRemove={() => setFormData({ ...formData, image_url: "" })}
                  bucket="project-images"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of your project"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write detailed content about your project..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tech_stack">Tech Stack</Label>
                <Input
                  id="tech_stack"
                  value={formData.tech_stack}
                  onChange={(e) =>
                    setFormData({ ...formData, tech_stack: e.target.value })
                  }
                  placeholder="React, TypeScript, Node.js (comma separated)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) =>
                      setFormData({ ...formData, github_url: e.target.value })
                    }
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demo_url">Demo URL</Label>
                  <Input
                    id="demo_url"
                    value={formData.demo_url}
                    onChange={(e) =>
                      setFormData({ ...formData, demo_url: e.target.value })
                    }
                    placeholder="https://your-demo.com"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingPost ? "Update Post" : "Create Post"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

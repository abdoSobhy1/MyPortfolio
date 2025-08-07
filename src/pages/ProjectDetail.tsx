import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Github, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RichTextDisplay } from "@/components/ui/rich-text-display";
import PageTransition from "@/components/PageTransition";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  image_url?: string | null;
  tech_stack?: string[] | null;
  github_url?: string | null;
  demo_url?: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
}

const ProjectDetail = () => {
  const { slug } = useParams(); // Changed from id to slug
  const navigate = useNavigate();
  const [project, setProject] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!slug) {
      setError("No project slug provided");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
      setError("Project not found");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Loading...
            </h1>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error || !project) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error || "Project Not Found"}
            </h1>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 grid-bg opacity-40" />

        {/* Gradient Overlays */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="mb-4 hover:bg-primary/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>

            {/* Project Hero */}
            <div className="glass-card rounded-2xl overflow-hidden mb-8">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image Available
                  </div>
                )}
              </div>

              <div className="p-8">
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="text-4xl font-bold text-foreground mb-4">
                  {project.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  {project.description}
                </p>

                <div className="flex gap-4 mb-6">
                  {project.github_url && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        project.github_url &&
                        window.open(project.github_url, "_blank")
                      }
                    >
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </Button>
                  )}
                  {project.demo_url && (
                    <Button
                      onClick={() =>
                        project.demo_url &&
                        window.open(project.demo_url, "_blank")
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-medium text-foreground">
                        {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Last Updated
                      </p>
                      <p className="font-medium text-foreground">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="glass-card p-8 rounded-2xl">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Project Overview
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    {project.content ? (
                      <RichTextDisplay
                        content={project.content}
                        className="text-foreground/80 leading-relaxed"
                      />
                    ) : (
                      <p className="text-foreground/80 leading-relaxed">
                        No detailed description available.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-foreground mb-4">
                      Technology Stack
                    </h3>
                    <div className="space-y-3">
                      {project.tech_stack.map((tech, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-accent rounded-full" />
                          <span className="text-foreground">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProjectDetail;

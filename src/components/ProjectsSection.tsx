
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Post {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  tech_stack?: string[];
  github_url?: string;
  demo_url?: string;
  slug: string;
}

const ProjectsSection = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6); // Show only 6 most recent projects

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // No fallback data - show empty state instead
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="projects" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Featured Projects</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/project/${project.slug}`)}
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                {project.image_url ? (
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{project.description}</p>
                
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.map((tech) => (
                      <span 
                        key={tech}
                        className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  {project.github_url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.github_url, '_blank');
                      }}
                    >
                      <Github className="h-4 w-4 mr-1" />
                      Code
                    </Button>
                  )}
                  {project.demo_url && (
                    <Button 
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.demo_url, '_blank');
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Demo
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No projects available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;

"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/currency";

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  deliverables: string[];
  deliverableStatus: boolean[];
  completed: boolean;
  client: {
    name: string;
    email: string;
  };
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!userId || !id) return;
    
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          router.push('/projects');
        } else {
          setProject(data);
        }
      })
      .catch(() => router.push('/projects'))
      .finally(() => setLoading(false));
  }, [userId, id, router]);

  const updateDeliverableStatus = async (index: number, checked: boolean) => {
    if (!project) return;
    
    const newStatus = [...(project.deliverableStatus || [])];
    while (newStatus.length < project.deliverables.length) {
      newStatus.push(false);
    }
    newStatus[index] = checked;
    
    try {
      const response = await fetch(`/api/projects/${id}/deliverables`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index, checked })
      });
      
      if (response.ok) {
        setProject({ ...project, deliverableStatus: newStatus });
      } else {
        console.error('Failed to update deliverable status');
      }
    } catch (error) {
      console.error('Failed to update deliverable status:', error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!project) return <div className="p-8">Project not found</div>;

  const isActive = new Date(project.endDate) > new Date();
  const isCompleted = project.completed || new Date(project.endDate) <= new Date();
  const duration = Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24));

  const markAsComplete = async () => {
    try {
      const response = await fetch(`/api/projects/${id}/complete`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        setProject({ ...project, completed: true });
      }
    } catch (error) {
      console.error('Failed to mark project as complete:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">Project Details</p>
        </div>
        <div className="flex gap-2">
          {!project.completed && (
            <Button onClick={markAsComplete}>Mark as Complete</Button>
          )}
          <Link href="/projects">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Client</h3>
          <p className="text-lg font-medium mt-2">{project.client.name}</p>
          <p className="text-sm text-gray-600">{project.client.email}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget</h3>
          <p className="text-2xl font-bold mt-2">{formatCurrency(project.budget, project.currency)}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
          <span className={`inline-block text-sm px-3 py-1 rounded-full mt-2 ${
            isCompleted ? 'bg-green-100 text-green-800' :
            isActive ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {isCompleted ? 'Completed' : isActive ? 'Active' : 'Pending'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Project Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-sm">{project.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="text-sm">{new Date(project.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p className="text-sm">{new Date(project.endDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="text-sm">{duration} days</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Deliverables</h3>
          <div className="space-y-2">
            {project.deliverables.length ? project.deliverables.map((deliverable, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox 
                  checked={project.deliverableStatus?.[index] || false}
                  onCheckedChange={(checked) => updateDeliverableStatus(index, checked as boolean)}
                />
                <p className={`text-sm ${project.deliverableStatus?.[index] ? 'line-through text-gray-500' : ''}`}>
                  {deliverable}
                </p>
              </div>
            )) : (
              <p className="text-sm text-gray-500">No deliverables specified</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
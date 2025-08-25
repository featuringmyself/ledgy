"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";


interface Project {
  id: number;
  name: string;
  budget: number;
  currency: string;
  endDate: string;
  client: {
    name: string;
  };
}

interface ProjectsOverviewProps {
  projects: Project[];
  userCurrency: string;
}

export default function ProjectsOverview({ projects, userCurrency }: ProjectsOverviewProps) {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isCalculating, setIsCalculating] = useState(true);

  useEffect(() => {
    const calculateTotalRevenue = async () => {
      setIsCalculating(true);
      let total = 0;

      for (const project of projects) {
        if (project.currency === userCurrency) {
          total += project.budget;
        } else {
          try {
            const response = await fetch(
              `/api/exchange-rates?from=${project.currency}&to=${userCurrency}`
            );
            if (response.ok) {
              const data = await response.json();
              total += project.budget * data.rate;
            } else {
              // Fallback: add original amount if conversion fails
              total += project.budget;
            }
          } catch (error) {
            console.error('Currency conversion failed:', error);
            total += project.budget;
          }
        }
      }

      setTotalRevenue(total);
      setIsCalculating(false);
    };

    calculateTotalRevenue();
  }, [projects, userCurrency]);

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => new Date(p.endDate) > new Date()).length;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Projects Overview</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">Track and manage your projects</p>
        </div>
        <Link href="/projects/add">
          <Button>Add Project</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</h3>
          <p className="text-2xl font-bold mt-2">{totalProjects}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Projects</h3>
          <p className="text-2xl font-bold mt-2">{activeProjects}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
          <p className="text-2xl font-bold mt-2">
            {isCalculating ? (
              <span className="animate-pulse">Calculating...</span>
            ) : (
              formatCurrency(totalRevenue, userCurrency)
            )}
          </p>
          {!isCalculating && projects.some(p => p.currency !== userCurrency) && (
            <p className="text-xs text-gray-500 mt-1">
              Converted to {userCurrency}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Projects</h2>
        </div>
        <div className="divide-y">
          {projects.length ? projects.map((project) => {
            const isActive = new Date(project.endDate) > new Date();
            const isCompleted = new Date(project.endDate) <= new Date();
            return (
              <div key={project.id} className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.client.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatCurrency(project.budget, project.currency)}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                    isCompleted ? 'bg-green-100 text-green-800' :
                    isActive ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {isCompleted ? 'Completed' : isActive ? 'Active' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          }) : (
            <div className="p-8 text-center text-gray-500">
              <p>No projects found. <Link href="/projects/add" className="text-blue-600 hover:underline">Create your first project</Link></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


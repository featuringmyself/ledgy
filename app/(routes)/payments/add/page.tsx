"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function AddPaymentPage() {
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [formData, setFormData] = useState({
    projectId: "",
    type: "ADVANCE",
    amount: "",
    dueDate: "",
    description: "",
    milestoneId: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => setProjects(data));
  }, []);

  useEffect(() => {
    if (formData.projectId) {
      fetch(`/api/milestones?projectId=${formData.projectId}`)
        .then(res => res.json())
        .then(data => setMilestones(data));
    }
  }, [formData.projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          projectId: parseInt(formData.projectId),
          amount: parseFloat(formData.amount),
          milestoneId: formData.milestoneId ? parseInt(formData.milestoneId) : null,
        }),
      });

      if (response.ok) {
        router.push("/payments");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Create Invoice</h1>
        <p className="text-sm text-gray-600 mt-1">Set up a payment expectation for a project</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="projectId">Project</Label>
          <select
            id="projectId"
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            className="w-full mt-1 p-2 border rounded-md"
            required
          >
            <option value="">Select a project</option>
            {projects.map((project: any) => (
              <option key={project.id} value={project.id}>
                {project.name} - {project.client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="type">Payment Type</Label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full mt-1 p-2 border rounded-md"
            required
          >
            <option value="ADVANCE">Advance Payment</option>
            <option value="MILESTONE">Milestone Payment</option>
            <option value="FINAL">Final Payment</option>
          </select>
        </div>

        {formData.type === "MILESTONE" && (
          <div>
            <Label htmlFor="milestoneId">Milestone</Label>
            <select
              id="milestoneId"
              value={formData.milestoneId}
              onChange={(e) => setFormData({ ...formData, milestoneId: e.target.value })}
              className="w-full mt-1 p-2 border rounded-md"
            >
              <option value="">Select a milestone</option>
              {milestones.map((milestone: any) => (
                <option key={milestone.id} value={milestone.id}>
                  {milestone.title} - ${milestone.amount}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Optional description"
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Invoice"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
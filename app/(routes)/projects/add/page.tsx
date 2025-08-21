"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface Client {
  id: string;
  name: string;
  email: string;
}

export default function AddProjectPage() {
  const [deliverables, setDeliverables] = useState([""]);
  const [currency, setCurrency] = useState("INR");
  const [showDropdown, setShowDropdown] = useState(false);
  const [budget, setBudget] = useState("");
  const [clientName, setClientName] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("full_upfront");
  const [fullAmount, setFullAmount] = useState("");
  const [advancePayment, setAdvancePayment] = useState("");
  const [milestones, setMilestones] = useState([{ title: "", amount: "", dueDate: "" }]);
  const { user } = useUser();
  const currencies = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY"];

  const formatNumber = (num: string) => {
    if (!num) return "";
    return parseInt(num).toLocaleString();
  };

  const numberToWords = (num: string) => {
    if (!num || num === "0") return "";
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    
    const convertHundreds = (n: number): string => {
      let result = "";
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + " hundred ";
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + " ";
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + " ";
        n = 0;
      }
      if (n > 0) result += ones[n] + " ";
      return result;
    };
    
    const number = parseInt(num);
    if (number === 0) return "zero";
    
    let result = "";
    if (number >= 1000000) {
      result += convertHundreds(Math.floor(number / 1000000)) + "million ";
    }
    if (number >= 1000) {
      result += convertHundreds(Math.floor((number % 1000000) / 1000)) + "thousand ";
    }
    result += convertHundreds(number % 1000);
    
    return result.trim();
  };

  const addDeliverable = () => {
    setDeliverables([...deliverables, ""]);
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", amount: "", dueDate: "" }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
  };

  const handleCurrencyChange = (value: string) => {
    const match = currencies.find(c => c.toLowerCase().startsWith(value.toLowerCase()));
    setCurrency(match || value);
  };

  useEffect(() => {
    if (user) {
      console.log('User object:', user);
      fetch(`/api/clients?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          console.log('Fetched clients:', data);
          setClients(data);
        })
        .catch(err => console.error('Error fetching clients:', err));
    }
  }, [user]);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(clientName.toLowerCase())
  );

  const handleSubmit = async () => {
    setLoading(true);
    const projectData = {
      name: projectName,
      clientName,
      email,
      phone,
      description,
      startDate,
      endDate,
      budget: budget ? parseInt(budget) : 0,
      currency,
      deliverables: deliverables.filter(d => d.trim() !== ""),
      paymentType,
      fullAmount: paymentType === "full_upfront" && fullAmount ? parseFloat(fullAmount) : 0,
      milestones: paymentType === "milestone_only" ? milestones.filter(m => m.title.trim() !== "" && m.amount.trim() !== "") : []
    };
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      
      if (response.ok) {
        alert('Project added successfully!');
        // Reset form
        setProjectName("");
        setClientName("");
        setEmail("");
        setPhone("");
        setDescription("");
        setBudget("");
        setDeliverables([""]);
        setPaymentType("full_upfront");
        setFullAmount("");
        setAdvancePayment("");
        setMilestones([{ title: "", amount: "", dueDate: "" }]);
      }
    } catch (error) {
      alert('Error adding project');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-10 flex flex-col items-center">
      <h1 className="font-semibold text-4xl mb-10">Add Project</h1>
      <div className="grid w-full max-w-2xl items-center gap-4">
        {/* Project Name */}
        <div className="gap-1 flex flex-col">
          <Label htmlFor="project">Project Name</Label>
          <Input type="text" id="project" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Enter project name" />
        </div>

        {/* Client Name */}
        <div className="gap-1 flex flex-col">
          <Label htmlFor="client">Client Name</Label>
          <div className="relative">
            <Input 
              type="text" 
              id="client" 
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
                setShowClientDropdown(e.target.value.length > 0);
              }}
              onBlur={() => setTimeout(() => setShowClientDropdown(false), 200)}
              placeholder="Enter client name" 
            />
            {showClientDropdown && filteredClients.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setClientName(client.name);
                      setShowClientDropdown(false);
                    }}
                  >
                    {client.name}
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Client Email */}
          <div className="gap-1 flex flex-col">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>
          <div className="gap-1 flex flex-col">
            <Label htmlFor="phone">Phone</Label>
            <Input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
          </div>
        </div>

        {/* Project Description */}
        <div className="gap-1 flex flex-col">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project description" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="gap-1 flex flex-col">
            <Label htmlFor="startDate">Start Date</Label>
            <Input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          {/* End Date */}
          <div className="gap-1 flex flex-col">
            <Label htmlFor="endDate">End Date</Label>
            <Input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        {/* Budget */}
        <div className="gap-1 flex flex-col">
          <Label htmlFor="budget">Budget</Label>
          <div className="flex gap-2">
            <div className="relative">
              <input 
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="px-3 py-2 pr-8 border border-gray-300 rounded-md w-20" 
                placeholder="INR" 
              />
              <div 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                ▼
              </div>
              {showDropdown && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {currencies.map((curr) => (
                    <div
                      key={curr}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setCurrency(curr);
                        setShowDropdown(false);
                      }}
                    >
                      {curr}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
            <Input 
              type="text" 
              id="budget" 
              value={formatNumber(budget)}
              onChange={(e) => setBudget(e.target.value.replace(/,/g, ''))}
              placeholder="Enter budget"
              className="flex-1"
            />
            {budget && (
            <p className="text-sm text-gray-600 mt-1 capitalize">
              {numberToWords(budget)} {currency}
            </p>
          )}
            </div>
          </div>
          
        </div>

        {/* Deliverables */}
        <div className="gap-1 flex flex-col">
          <Label>Deliverables</Label>
          {deliverables.map((deliverable, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="text"
                value={deliverable}
                onChange={(e) => {
                  const newDeliverables = [...deliverables];
                  newDeliverables[index] = e.target.value;
                  setDeliverables(newDeliverables);
                }}
                placeholder={`Deliverable ${index + 1}`}
              />
              {deliverables.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeDeliverable(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addDeliverable}
            className="w-fit"
          >
            Add Deliverable
          </Button>
        </div>

        {/* Payment Configuration */}
        <div className="gap-4 flex flex-col border-t pt-6">
          <h3 className="text-lg font-semibold">Payment Configuration</h3>
          
          <div className="gap-1 flex flex-col">
            <Label htmlFor="paymentType">Payment Structure</Label>
            <select
              id="paymentType"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            >
              <option value="full_upfront">Full Payment Upfront</option>
              <option value="milestone_only">Milestone Payments</option>
            </select>
          </div>

          {paymentType === "full_upfront" && (
            <div className="gap-1 flex flex-col">
              <Label htmlFor="fullAmount">Payment Amount ({currency})</Label>
              <Input
                type="number"
                id="fullAmount"
                value={fullAmount}
                onChange={(e) => setFullAmount(e.target.value)}
                placeholder="Enter full payment amount"
              />
            </div>
          )}

          {paymentType === "milestone_only" && (
            <div className="gap-3 flex flex-col">
              <Label>Milestones</Label>
              {milestones.map((milestone, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 p-3 border rounded">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                      placeholder="Milestone name"
                    />
                  </div>
                  <div>
                    <Label>Amount ({currency})</Label>
                    <Input
                      type="number"
                      value={milestone.amount}
                      onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                      placeholder="Amount"
                    />
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        value={milestone.dueDate}
                        onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                      />
                      {milestones.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeMilestone(index)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addMilestone}
                className="w-fit"
              >
                Add Milestone
              </Button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button className="mt-4" onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add Project"}
        </Button>
      </div>
    </div>
  );
}

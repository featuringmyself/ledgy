import { PrismaClient } from "./app/generated/prisma";

const prisma = new PrismaClient();

export async function main() {
  // Clear existing data in correct order (due to foreign key constraints)
  await prisma.transaction.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.paymentMilestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();
  
  // Clear exchange rates if table exists
  try {
    await prisma.exchangeRate.deleteMany();
  } catch (error) {
    console.log("ExchangeRate table doesn't exist yet, skipping cleanup...");
  }

  console.log("Creating seed data...");

  // Create comprehensive exchange rates for all supported currencies
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Base exchange rates (approximate real-world rates as of 2024)
  const exchangeRates = [
    // INR to other currencies
    { fromCurrency: "INR", toCurrency: "USD", rate: 0.012, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "EUR", rate: 0.011, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "GBP", rate: 0.0095, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "CAD", rate: 0.016, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "AUD", rate: 0.018, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "JPY", rate: 1.8, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "CHF", rate: 0.011, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "CNY", rate: 0.087, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "BRL", rate: 0.061, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "MXN", rate: 0.21, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "SGD", rate: 0.016, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "HKD", rate: 0.094, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "NOK", rate: 0.13, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "SEK", rate: 0.13, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "DKK", rate: 0.082, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "PLN", rate: 0.049, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "CZK", rate: 0.28, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "HUF", rate: 4.3, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "RUB", rate: 1.1, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "AED", rate: 0.044, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "SAR", rate: 0.045, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "KRW", rate: 16.1, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "THB", rate: 0.43, date: today, source: "seed-data" },
    { fromCurrency: "INR", toCurrency: "MYR", rate: 0.057, date: today, source: "seed-data" },
    
    // USD to other currencies
    { fromCurrency: "USD", toCurrency: "INR", rate: 83.5, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "EUR", rate: 0.92, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "GBP", rate: 0.79, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "CAD", rate: 1.35, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "AUD", rate: 1.52, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "JPY", rate: 150.0, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "CHF", rate: 0.91, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "CNY", rate: 7.25, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "BRL", rate: 5.1, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "MXN", rate: 17.5, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "SGD", rate: 1.34, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "HKD", rate: 7.8, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "NOK", rate: 10.8, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "SEK", rate: 10.9, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "DKK", rate: 6.85, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "PLN", rate: 4.1, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "CZK", rate: 23.2, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "HUF", rate: 360.0, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "RUB", rate: 92.0, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "AED", rate: 3.67, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "SAR", rate: 3.75, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "KRW", rate: 1340.0, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "THB", rate: 36.0, date: today, source: "seed-data" },
    { fromCurrency: "USD", toCurrency: "MYR", rate: 4.75, date: today, source: "seed-data" },
    
    // EUR to other currencies
    { fromCurrency: "EUR", toCurrency: "INR", rate: 90.8, date: today, source: "seed-data" },
    { fromCurrency: "EUR", toCurrency: "USD", rate: 1.09, date: today, source: "seed-data" },
    { fromCurrency: "EUR", toCurrency: "GBP", rate: 0.86, date: today, source: "seed-data" },
    { fromCurrency: "EUR", toCurrency: "CAD", rate: 1.47, date: today, source: "seed-data" },
    { fromCurrency: "EUR", toCurrency: "AUD", rate: 1.65, date: today, source: "seed-data" },
    { fromCurrency: "EUR", toCurrency: "JPY", rate: 163.0, date: today, source: "seed-data" },
    { fromCurrency: "EUR", toCurrency: "CHF", rate: 0.99, date: today, source: "seed-data" },
    { fromCurrency: "EUR", toCurrency: "CNY", rate: 7.89, date: today, source: "seed-data" },
    { fromCurrency: "EUR", toCurrency: "BRL", rate: 5.55, date: today, source: "seed-data" },
    { fromCurrency: "EUR", toCurrency: "MXN", rate: 19.1, date: today, source: "seed-data" },
    { fromCurrency: "EUR", toCurrency: "SGD", rate: 1.46, date: today, source: "seed-data" },
    { fromCurrency: "EUR", toCurrency: "HKD", rate: 8.5, date: today, source: "seed-data" },
    
    // GBP to other currencies
    { fromCurrency: "GBP", toCurrency: "INR", rate: 105.6, date: today, source: "seed-data" },
    { fromCurrency: "GBP", toCurrency: "USD", rate: 1.27, date: today, source: "seed-data" },
    { fromCurrency: "GBP", toCurrency: "EUR", rate: 1.16, date: today, source: "seed-data" },
    { fromCurrency: "GBP", toCurrency: "CAD", rate: 1.71, date: today, source: "seed-data" },
    { fromCurrency: "GBP", toCurrency: "AUD", rate: 1.92, date: today, source: "seed-data" },
    { fromCurrency: "GBP", toCurrency: "JPY", rate: 190.0, date: today, source: "seed-data" },
    
    // CAD to other currencies
    { fromCurrency: "CAD", toCurrency: "INR", rate: 61.9, date: today, source: "seed-data" },
    { fromCurrency: "CAD", toCurrency: "USD", rate: 0.74, date: today, source: "seed-data" },
    { fromCurrency: "CAD", toCurrency: "EUR", rate: 0.68, date: today, source: "seed-data" },
    { fromCurrency: "CAD", toCurrency: "GBP", rate: 0.58, date: today, source: "seed-data" },
    { fromCurrency: "CAD", toCurrency: "AUD", rate: 1.12, date: today, source: "seed-data" },
    
    // AUD to other currencies
    { fromCurrency: "AUD", toCurrency: "INR", rate: 55.0, date: today, source: "seed-data" },
    { fromCurrency: "AUD", toCurrency: "USD", rate: 0.66, date: today, source: "seed-data" },
    { fromCurrency: "AUD", toCurrency: "EUR", rate: 0.61, date: today, source: "seed-data" },
    { fromCurrency: "AUD", toCurrency: "GBP", rate: 0.52, date: today, source: "seed-data" },
    { fromCurrency: "AUD", toCurrency: "CAD", rate: 0.89, date: today, source: "seed-data" },
    
    // JPY to other currencies
    { fromCurrency: "JPY", toCurrency: "INR", rate: 0.56, date: today, source: "seed-data" },
    { fromCurrency: "JPY", toCurrency: "USD", rate: 0.0067, date: today, source: "seed-data" },
    { fromCurrency: "JPY", toCurrency: "EUR", rate: 0.0061, date: today, source: "seed-data" },
    { fromCurrency: "JPY", toCurrency: "GBP", rate: 0.0053, date: today, source: "seed-data" },
    
    // CHF to other currencies
    { fromCurrency: "CHF", toCurrency: "INR", rate: 91.8, date: today, source: "seed-data" },
    { fromCurrency: "CHF", toCurrency: "USD", rate: 1.10, date: today, source: "seed-data" },
    { fromCurrency: "CHF", toCurrency: "EUR", rate: 1.01, date: today, source: "seed-data" },
    
    // CNY to other currencies
    { fromCurrency: "CNY", toCurrency: "INR", rate: 11.5, date: today, source: "seed-data" },
    { fromCurrency: "CNY", toCurrency: "USD", rate: 0.138, date: today, source: "seed-data" },
    { fromCurrency: "CNY", toCurrency: "EUR", rate: 0.127, date: today, source: "seed-data" },
    
    // SGD to other currencies
    { fromCurrency: "SGD", toCurrency: "INR", rate: 62.3, date: today, source: "seed-data" },
    { fromCurrency: "SGD", toCurrency: "USD", rate: 0.75, date: today, source: "seed-data" },
    { fromCurrency: "SGD", toCurrency: "EUR", rate: 0.68, date: today, source: "seed-data" },
    
    // AED to other currencies
    { fromCurrency: "AED", toCurrency: "INR", rate: 22.7, date: today, source: "seed-data" },
    { fromCurrency: "AED", toCurrency: "USD", rate: 0.272, date: today, source: "seed-data" },
    { fromCurrency: "AED", toCurrency: "EUR", rate: 0.25, date: today, source: "seed-data" },
  ];

  await prisma.exchangeRate.createMany({
    data: exchangeRates
  });

  // Create users with diverse currency preferences
  const user1 = await prisma.user.create({
    data: {
      clerkId: "user_31aluWUvRoiKEqueHqij96b1Cem",
      email: "rudralocked@gmail.com",
      defaultCurrency: "INR"
    }
  });

  const user2 = await prisma.user.create({
    data: {
      clerkId: "user_freelancer456",
      email: "freelancer@example.com",
      defaultCurrency: "USD"
    }
  });

  const user3 = await prisma.user.create({
    data: {
      clerkId: "user_european789",
      email: "developer@europe.com",
      defaultCurrency: "EUR"
    }
  });

  const user4 = await prisma.user.create({
    data: {
      clerkId: "user_singapore123",
      email: "consultant@singapore.com",
      defaultCurrency: "SGD"
    }
  });

  const user5 = await prisma.user.create({
    data: {
      clerkId: "user_japan456",
      email: "designer@japan.com",
      defaultCurrency: "JPY"
    }
  });

  // Create clients for user1
  const client1 = await prisma.client.create({
    data: {
      name: "TechCorp Inc",
      email: "contact@techcorp.com",
      phone: "+1-555-0123",
      userId: user1.id
    }
  });

  const client2 = await prisma.client.create({
    data: {
      name: "StartupXYZ",
      email: "hello@startupxyz.com",
      phone: "+1-555-0456",
      userId: user1.id
    }
  });

  const client3 = await prisma.client.create({
    data: {
      name: "Digital Agency Pro",
      email: "projects@digitalagency.com",
      phone: "+1-555-0789",
      userId: user1.id
    }
  });

  // Create clients for user2
  const client4 = await prisma.client.create({
    data: {
      name: "Local Restaurant Chain",
      email: "marketing@restaurant.com",
      phone: "+1-555-0321",
      userId: user2.id
    }
  });

  const client5 = await prisma.client.create({
    data: {
      name: "Healthcare Solutions",
      email: "it@healthcare.com",
      phone: "+1-555-0654",
      userId: user2.id
    }
  });

  // Create clients for user3 (EUR)
  const client6 = await prisma.client.create({
    data: {
      name: "Berlin Tech GmbH",
      email: "projects@berlintech.de",
      phone: "+49-30-12345678",
      userId: user3.id
    }
  });

  const client7 = await prisma.client.create({
    data: {
      name: "Amsterdam Fintech B.V.",
      email: "development@fintech.nl",
      phone: "+31-20-1234567",
      userId: user3.id
    }
  });

  // Create clients for user4 (SGD)
  const client8 = await prisma.client.create({
    data: {
      name: "Singapore Maritime Corp",
      email: "tech@maritime.sg",
      phone: "+65-6123-4567",
      userId: user4.id
    }
  });

  const client9 = await prisma.client.create({
    data: {
      name: "ASEAN Trading Hub",
      email: "digital@trading.sg",
      phone: "+65-6234-5678",
      userId: user4.id
    }
  });

  // Create clients for user5 (JPY)
  const client10 = await prisma.client.create({
    data: {
      name: "Tokyo Innovation Labs",
      email: "projects@innovation.jp",
      phone: "+81-3-1234-5678",
      userId: user5.id
    }
  });

  const client11 = await prisma.client.create({
    data: {
      name: "Osaka Digital Solutions",
      email: "contact@digital.osaka.jp",
      phone: "+81-6-2345-6789",
      userId: user5.id
    }
  });

  // Create projects with comprehensive data - mix of INR and USD
  const project1 = await prisma.project.create({
    data: {
      name: "E-commerce Platform",
      description: "Build a modern e-commerce platform with React and Node.js",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-04-15"),
      budget: 2087500, // ₹20,87,500 (equivalent to ~$25,000)
      currency: "INR",
      deliverables: ["Frontend Development", "Backend API", "Payment Integration", "Admin Dashboard"],
      deliverableStatus: [true, true, false, false],
      completed: false,
      userId: user1.id,
      clientId: client1.id
    }
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Mobile App Design",
      description: "Design and develop a mobile app for iOS and Android",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-03-30"),
      budget: 1503000, // ₹15,03,000 (equivalent to ~$18,000)
      currency: "INR",
      deliverables: ["UI/UX Design", "iOS Development", "Android Development", "Testing"],
      deliverableStatus: [true, true, true, true],
      completed: true,
      userId: user1.id,
      clientId: client2.id
    }
  });

  const project3 = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Complete redesign of company website with modern UI",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-05-01"),
      budget: 1002000, // ₹10,02,000 (equivalent to ~$12,000)
      currency: "INR",
      deliverables: ["Homepage Design", "Product Pages", "Contact Form", "SEO Optimization"],
      deliverableStatus: [true, false, false, false],
      completed: false,
      userId: user1.id,
      clientId: client3.id
    }
  });

  // Add a USD project for user1 to show multi-currency
  const project3b = await prisma.project.create({
    data: {
      name: "International Consulting",
      description: "Consulting services for US-based client",
      startDate: new Date("2024-02-15"),
      endDate: new Date("2024-04-15"),
      budget: 15000, // $15,000 USD
      currency: "USD",
      deliverables: ["Strategy Planning", "Implementation", "Training"],
      deliverableStatus: [true, true, false],
      completed: false,
      userId: user1.id,
      clientId: client1.id
    }
  });

  // Add a EUR project for user1 to show multi-currency
  const project3c = await prisma.project.create({
    data: {
      name: "European Market Analysis",
      description: "Market research and analysis for European expansion",
      startDate: new Date("2024-01-10"),
      endDate: new Date("2024-03-10"),
      budget: 8000, // €8,000 EUR
      currency: "EUR",
      deliverables: ["Market Research", "Competitive Analysis", "Report"],
      deliverableStatus: [true, true, true],
      completed: true,
      userId: user1.id,
      clientId: client2.id
    }
  });

  const project4 = await prisma.project.create({
    data: {
      name: "Restaurant POS System",
      description: "Custom point-of-sale system for restaurant chain",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-06-01"),
      budget: 35000, // $35,000 USD
      currency: "USD",
      deliverables: ["System Analysis", "Database Design", "Frontend Development", "Integration", "Training"],
      deliverableStatus: [true, true, true, false, false],
      completed: false,
      userId: user2.id,
      clientId: client4.id
    }
  });

  const project5 = await prisma.project.create({
    data: {
      name: "Patient Management System",
      description: "HIPAA-compliant patient management and scheduling system",
      startDate: new Date("2023-11-01"),
      endDate: new Date("2024-02-01"),
      budget: 28000, // $28,000 USD
      currency: "USD",
      deliverables: ["Requirements Analysis", "Security Implementation", "Patient Portal", "Doctor Dashboard", "Reporting"],
      deliverableStatus: [true, true, true, true, true],
      completed: true,
      userId: user2.id,
      clientId: client5.id
    }
  });

  // EUR Projects
  const project6 = await prisma.project.create({
    data: {
      name: "Blockchain Trading Platform",
      description: "Decentralized trading platform with smart contracts",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-07-01"),
      budget: 45000, // €45,000 EUR
      currency: "EUR",
      deliverables: ["Smart Contract Development", "Frontend Interface", "Security Audit", "Deployment"],
      deliverableStatus: [true, true, false, false],
      completed: false,
      userId: user3.id,
      clientId: client6.id
    }
  });

  const project7 = await prisma.project.create({
    data: {
      name: "Fintech Mobile App",
      description: "Mobile banking application with advanced security",
      startDate: new Date("2024-01-15"),
      endDate: new Date("2024-05-15"),
      budget: 32000, // €32,000 EUR
      currency: "EUR",
      deliverables: ["Security Framework", "Mobile UI", "Backend Services", "Testing"],
      deliverableStatus: [true, true, true, false],
      completed: false,
      userId: user3.id,
      clientId: client7.id
    }
  });

  // SGD Projects
  const project8 = await prisma.project.create({
    data: {
      name: "Maritime Logistics System",
      description: "Container tracking and logistics management system",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-08-01"),
      budget: 68000, // S$68,000 SGD
      currency: "SGD",
      deliverables: ["System Architecture", "Tracking Module", "Analytics Dashboard", "Mobile App"],
      deliverableStatus: [true, false, false, false],
      completed: false,
      userId: user4.id,
      clientId: client8.id
    }
  });

  const project9 = await prisma.project.create({
    data: {
      name: "ASEAN Trade Portal",
      description: "Cross-border trade facilitation platform",
      startDate: new Date("2023-12-01"),
      endDate: new Date("2024-04-01"),
      budget: 42000, // S$42,000 SGD
      currency: "SGD",
      deliverables: ["Multi-language Support", "Payment Gateway", "Document Management", "Compliance Module"],
      deliverableStatus: [true, true, true, true],
      completed: true,
      userId: user4.id,
      clientId: client9.id
    }
  });

  // JPY Projects
  const project10 = await prisma.project.create({
    data: {
      name: "AI Research Platform",
      description: "Machine learning research and experimentation platform",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-06-01"),
      budget: 5400000, // ¥5,400,000 JPY
      currency: "JPY",
      deliverables: ["ML Pipeline", "Data Visualization", "Model Training", "API Development"],
      deliverableStatus: [true, true, false, false],
      completed: false,
      userId: user5.id,
      clientId: client10.id
    }
  });

  const project11 = await prisma.project.create({
    data: {
      name: "Digital Transformation Suite",
      description: "Enterprise digital transformation tools and services",
      startDate: new Date("2023-10-01"),
      endDate: new Date("2024-03-01"),
      budget: 3600000, // ¥3,600,000 JPY
      currency: "JPY",
      deliverables: ["Legacy System Integration", "Cloud Migration", "User Training", "Support Documentation"],
      deliverableStatus: [true, true, true, true],
      completed: true,
      userId: user5.id,
      clientId: client11.id
    }
  });

  // Create milestones with currency and exchange rate data
  const milestone1 = await prisma.paymentMilestone.create({
    data: {
      projectId: project1.id,
      title: "Frontend Development Complete",
      description: "Complete React frontend with all major components",
      amount: 668000, // ₹6,68,000 (equivalent to ~$8,000)
      currency: "INR",
      exchangeRate: 83.5, // INR to USD rate
      amountInBaseCurrency: 668000, // Same as amount since it's in base currency
      dueDate: new Date("2024-02-15"),
      status: "COMPLETED",
      completedDate: new Date("2024-02-14")
    }
  });

  const milestone2 = await prisma.paymentMilestone.create({
    data: {
      projectId: project1.id,
      title: "Backend API Complete",
      description: "REST API with authentication and core functionality",
      amount: 584500, // ₹5,84,500 (equivalent to ~$7,000)
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 584500,
      dueDate: new Date("2024-03-15"),
      status: "COMPLETED",
      completedDate: new Date("2024-03-12")
    }
  });

  const milestone3 = await prisma.paymentMilestone.create({
    data: {
      projectId: project1.id,
      title: "Payment Integration",
      description: "Stripe payment integration and testing",
      amount: 417500, // ₹4,17,500 (equivalent to ~$5,000)
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 417500,
      dueDate: new Date("2024-04-01"),
      status: "IN_PROGRESS"
    }
  });

  const milestone4 = await prisma.paymentMilestone.create({
    data: {
      projectId: project4.id,
      title: "Database Design & Setup",
      description: "Complete database schema and initial setup",
      amount: 8000, // $8,000 USD
      currency: "USD",
      exchangeRate: 1.0, // USD to USD rate
      amountInBaseCurrency: 8000,
      dueDate: new Date("2024-02-01"),
      status: "COMPLETED",
      completedDate: new Date("2024-01-28")
    }
  });

  const milestone5 = await prisma.paymentMilestone.create({
    data: {
      projectId: project4.id,
      title: "Core POS Features",
      description: "Order management, inventory tracking, basic reporting",
      amount: 12000, // $12,000 USD
      currency: "USD",
      exchangeRate: 1.0,
      amountInBaseCurrency: 12000,
      dueDate: new Date("2024-04-01"),
      status: "IN_PROGRESS"
    }
  });

  // EUR Milestones
  const milestone6 = await prisma.paymentMilestone.create({
    data: {
      projectId: project6.id,
      title: "Smart Contract Development",
      description: "Core blockchain smart contracts and testing",
      amount: 15000, // €15,000 EUR
      currency: "EUR",
      exchangeRate: 1.09, // EUR to USD rate
      amountInBaseCurrency: 16350, // €15,000 * 1.09
      dueDate: new Date("2024-03-15"),
      status: "COMPLETED",
      completedDate: new Date("2024-03-12")
    }
  });

  const milestone7 = await prisma.paymentMilestone.create({
    data: {
      projectId: project7.id,
      title: "Security Framework Implementation",
      description: "Advanced security protocols and encryption",
      amount: 12000, // €12,000 EUR
      currency: "EUR",
      exchangeRate: 1.09,
      amountInBaseCurrency: 13080, // €12,000 * 1.09
      dueDate: new Date("2024-02-28"),
      status: "COMPLETED",
      completedDate: new Date("2024-02-25")
    }
  });

  // SGD Milestones
  const milestone8 = await prisma.paymentMilestone.create({
    data: {
      projectId: project8.id,
      title: "System Architecture Design",
      description: "Complete system architecture and database design",
      amount: 20000, // S$20,000 SGD
      currency: "SGD",
      exchangeRate: 0.75, // SGD to USD rate
      amountInBaseCurrency: 15000, // S$20,000 * 0.75
      dueDate: new Date("2024-04-01"),
      status: "COMPLETED",
      completedDate: new Date("2024-03-28")
    }
  });

  const milestone9 = await prisma.paymentMilestone.create({
    data: {
      projectId: project9.id,
      title: "Payment Gateway Integration",
      description: "Multi-currency payment processing system",
      amount: 15000, // S$15,000 SGD
      currency: "SGD",
      exchangeRate: 0.75,
      amountInBaseCurrency: 11250, // S$15,000 * 0.75
      dueDate: new Date("2024-02-15"),
      status: "COMPLETED",
      completedDate: new Date("2024-02-10")
    }
  });

  // JPY Milestones
  const milestone10 = await prisma.paymentMilestone.create({
    data: {
      projectId: project10.id,
      title: "ML Pipeline Development",
      description: "Machine learning data processing pipeline",
      amount: 1800000, // ¥1,800,000 JPY
      currency: "JPY",
      exchangeRate: 0.0067, // JPY to USD rate
      amountInBaseCurrency: 12060, // ¥1,800,000 * 0.0067
      dueDate: new Date("2024-03-01"),
      status: "COMPLETED",
      completedDate: new Date("2024-02-28")
    }
  });

  const milestone11 = await prisma.paymentMilestone.create({
    data: {
      projectId: project11.id,
      title: "Legacy System Integration",
      description: "Integration with existing enterprise systems",
      amount: 1200000, // ¥1,200,000 JPY
      currency: "JPY",
      exchangeRate: 0.0067,
      amountInBaseCurrency: 8040, // ¥1,200,000 * 0.0067
      dueDate: new Date("2023-12-15"),
      status: "COMPLETED",
      completedDate: new Date("2023-12-10")
    }
  });

  // Create payments with currency and exchange rate data
  const payment1 = await prisma.payment.create({
    data: {
      projectId: project1.id,
      type: "ADVANCE",
      amount: 417500, // ₹4,17,500 (equivalent to ~$5,000)
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 417500,
      status: "PAID",
      dueDate: new Date("2024-01-15"),
      paidDate: new Date("2024-01-16"),
      description: "Initial advance payment for e-commerce project"
    }
  });

  const payment2 = await prisma.payment.create({
    data: {
      projectId: project1.id,
      type: "MILESTONE",
      amount: 668000, // ₹6,68,000 (equivalent to ~$8,000)
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 668000,
      status: "PAID",
      dueDate: new Date("2024-02-20"),
      paidDate: new Date("2024-02-18"),
      description: "Payment for frontend development milestone",
      milestoneId: milestone1.id
    }
  });

  const payment3 = await prisma.payment.create({
    data: {
      projectId: project1.id,
      type: "MILESTONE",
      amount: 584500, // ₹5,84,500 (equivalent to ~$7,000)
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 584500,
      status: "PAID",
      dueDate: new Date("2024-03-20"),
      paidDate: new Date("2024-03-15"),
      description: "Payment for backend API milestone",
      milestoneId: milestone2.id
    }
  });

  const payment4 = await prisma.payment.create({
    data: {
      projectId: project1.id,
      type: "MILESTONE",
      amount: 417500, // ₹4,17,500 (equivalent to ~$5,000)
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 417500,
      status: "PENDING",
      dueDate: new Date("2024-04-05"),
      description: "Payment for payment integration milestone",
      milestoneId: milestone3.id
    }
  });

  const payment5 = await prisma.payment.create({
    data: {
      projectId: project2.id,
      type: "ADVANCE",
      amount: 501000, // ₹5,01,000 (equivalent to ~$6,000)
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 501000,
      status: "PAID",
      dueDate: new Date("2024-02-01"),
      paidDate: new Date("2024-02-01"),
      description: "Advance payment for mobile app project"
    }
  });

  const payment6 = await prisma.payment.create({
    data: {
      projectId: project2.id,
      type: "FINAL",
      amount: 1002000, // ₹10,02,000 (equivalent to ~$12,000)
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 1002000,
      status: "PAID",
      dueDate: new Date("2024-04-05"),
      paidDate: new Date("2024-04-03"),
      description: "Final payment for completed mobile app"
    }
  });

  const payment7 = await prisma.payment.create({
    data: {
      projectId: project3.id,
      type: "ADVANCE",
      amount: 334000, // ₹3,34,000 (equivalent to ~$4,000)
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 334000,
      status: "PAID",
      dueDate: new Date("2024-03-01"),
      paidDate: new Date("2024-03-02"),
      description: "Advance payment for website redesign"
    }
  });

  const payment8 = await prisma.payment.create({
    data: {
      projectId: project3.id,
      type: "MILESTONE",
      amount: 334000, // ₹3,34,000 (equivalent to ~$4,000)
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 334000,
      status: "OVERDUE",
      dueDate: new Date("2024-04-01"),
      description: "Payment for homepage design completion"
    }
  });

  // Add USD payments for user1
  const payment8b = await prisma.payment.create({
    data: {
      projectId: project3b.id,
      type: "ADVANCE",
      amount: 5000, // $5,000 USD
      currency: "USD",
      exchangeRate: 1.0,
      amountInBaseCurrency: 5000,
      status: "PAID",
      dueDate: new Date("2024-02-15"),
      paidDate: new Date("2024-02-16"),
      description: "Advance payment for consulting project"
    }
  });

  const payment8c = await prisma.payment.create({
    data: {
      projectId: project3b.id,
      type: "MILESTONE",
      amount: 7500, // $7,500 USD
      currency: "USD",
      exchangeRate: 1.0,
      amountInBaseCurrency: 7500,
      status: "PAID",
      dueDate: new Date("2024-03-15"),
      paidDate: new Date("2024-03-12"),
      description: "Payment for strategy and implementation"
    }
  });

  // Add EUR payments for user1
  const payment8d = await prisma.payment.create({
    data: {
      projectId: project3c.id,
      type: "ADVANCE",
      amount: 3000, // €3,000 EUR
      currency: "EUR",
      exchangeRate: 1.09,
      amountInBaseCurrency: 3270, // €3,000 * 1.09
      status: "PAID",
      dueDate: new Date("2024-01-10"),
      paidDate: new Date("2024-01-11"),
      description: "Advance for market analysis project"
    }
  });

  const payment8e = await prisma.payment.create({
    data: {
      projectId: project3c.id,
      type: "FINAL",
      amount: 5000, // €5,000 EUR
      currency: "EUR",
      exchangeRate: 1.09,
      amountInBaseCurrency: 5450, // €5,000 * 1.09
      status: "PAID",
      dueDate: new Date("2024-03-15"),
      paidDate: new Date("2024-03-10"),
      description: "Final payment for completed analysis"
    }
  });

  const payment9 = await prisma.payment.create({
    data: {
      projectId: project4.id,
      type: "ADVANCE",
      amount: 10000, // $10,000 USD
      currency: "USD",
      exchangeRate: 1.0,
      amountInBaseCurrency: 10000,
      status: "PAID",
      dueDate: new Date("2024-01-01"),
      paidDate: new Date("2024-01-03"),
      description: "Initial payment for POS system development"
    }
  });

  const payment10 = await prisma.payment.create({
    data: {
      projectId: project4.id,
      type: "MILESTONE",
      amount: 8000, // $8,000 USD
      currency: "USD",
      exchangeRate: 1.0,
      amountInBaseCurrency: 8000,
      status: "PAID",
      dueDate: new Date("2024-02-05"),
      paidDate: new Date("2024-02-01"),
      description: "Database milestone payment",
      milestoneId: milestone4.id
    }
  });

  const payment11 = await prisma.payment.create({
    data: {
      projectId: project5.id,
      type: "ADVANCE",
      amount: 8000, // $8,000 USD
      currency: "USD",
      exchangeRate: 1.0,
      amountInBaseCurrency: 8000,
      status: "PAID",
      dueDate: new Date("2023-11-01"),
      paidDate: new Date("2023-11-01"),
      description: "Advance for patient management system"
    }
  });

  const payment12 = await prisma.payment.create({
    data: {
      projectId: project5.id,
      type: "FINAL",
      amount: 20000, // $20,000 USD
      currency: "USD",
      exchangeRate: 1.0,
      amountInBaseCurrency: 20000,
      status: "PAID",
      dueDate: new Date("2024-02-10"),
      paidDate: new Date("2024-02-08"),
      description: "Final payment for completed patient management system"
    }
  });

  // EUR Payments
  const payment13 = await prisma.payment.create({
    data: {
      projectId: project6.id,
      type: "ADVANCE",
      amount: 13500, // €13,500 EUR
      currency: "EUR",
      exchangeRate: 1.09,
      amountInBaseCurrency: 14715, // €13,500 * 1.09
      status: "PAID",
      dueDate: new Date("2024-02-01"),
      paidDate: new Date("2024-02-01"),
      description: "Advance payment for blockchain platform"
    }
  });

  const payment14 = await prisma.payment.create({
    data: {
      projectId: project6.id,
      type: "MILESTONE",
      amount: 15000, // €15,000 EUR
      currency: "EUR",
      exchangeRate: 1.09,
      amountInBaseCurrency: 16350,
      status: "PAID",
      dueDate: new Date("2024-03-20"),
      paidDate: new Date("2024-03-15"),
      description: "Smart contract milestone payment",
      milestoneId: milestone6.id
    }
  });

  const payment15 = await prisma.payment.create({
    data: {
      projectId: project7.id,
      type: "ADVANCE",
      amount: 9600, // €9,600 EUR
      currency: "EUR",
      exchangeRate: 1.09,
      amountInBaseCurrency: 10464,
      status: "PAID",
      dueDate: new Date("2024-01-15"),
      paidDate: new Date("2024-01-16"),
      description: "Initial payment for fintech mobile app"
    }
  });

  const payment16 = await prisma.payment.create({
    data: {
      projectId: project7.id,
      type: "MILESTONE",
      amount: 12000, // €12,000 EUR
      currency: "EUR",
      exchangeRate: 1.09,
      amountInBaseCurrency: 13080,
      status: "PAID",
      dueDate: new Date("2024-03-05"),
      paidDate: new Date("2024-03-01"),
      description: "Security framework milestone payment",
      milestoneId: milestone7.id
    }
  });

  // SGD Payments
  const payment17 = await prisma.payment.create({
    data: {
      projectId: project8.id,
      type: "ADVANCE",
      amount: 20400, // S$20,400 SGD
      currency: "SGD",
      exchangeRate: 0.75,
      amountInBaseCurrency: 15300,
      status: "PAID",
      dueDate: new Date("2024-03-01"),
      paidDate: new Date("2024-03-01"),
      description: "Advance for maritime logistics system"
    }
  });

  const payment18 = await prisma.payment.create({
    data: {
      projectId: project8.id,
      type: "MILESTONE",
      amount: 20000, // S$20,000 SGD
      currency: "SGD",
      exchangeRate: 0.75,
      amountInBaseCurrency: 15000,
      status: "PAID",
      dueDate: new Date("2024-04-05"),
      paidDate: new Date("2024-04-01"),
      description: "Architecture milestone payment",
      milestoneId: milestone8.id
    }
  });

  const payment19 = await prisma.payment.create({
    data: {
      projectId: project9.id,
      type: "ADVANCE",
      amount: 12600, // S$12,600 SGD
      currency: "SGD",
      exchangeRate: 0.75,
      amountInBaseCurrency: 9450,
      status: "PAID",
      dueDate: new Date("2023-12-01"),
      paidDate: new Date("2023-12-01"),
      description: "Initial payment for trade portal"
    }
  });

  const payment20 = await prisma.payment.create({
    data: {
      projectId: project9.id,
      type: "FINAL",
      amount: 29400, // S$29,400 SGD
      currency: "SGD",
      exchangeRate: 0.75,
      amountInBaseCurrency: 22050,
      status: "PAID",
      dueDate: new Date("2024-04-10"),
      paidDate: new Date("2024-04-05"),
      description: "Final payment for completed trade portal"
    }
  });

  // JPY Payments
  const payment21 = await prisma.payment.create({
    data: {
      projectId: project10.id,
      type: "ADVANCE",
      amount: 1620000, // ¥1,620,000 JPY
      currency: "JPY",
      exchangeRate: 0.0067,
      amountInBaseCurrency: 10854,
      status: "PAID",
      dueDate: new Date("2024-01-01"),
      paidDate: new Date("2024-01-02"),
      description: "Advance for AI research platform"
    }
  });

  const payment22 = await prisma.payment.create({
    data: {
      projectId: project10.id,
      type: "MILESTONE",
      amount: 1800000, // ¥1,800,000 JPY
      currency: "JPY",
      exchangeRate: 0.0067,
      amountInBaseCurrency: 12060,
      status: "PAID",
      dueDate: new Date("2024-03-05"),
      paidDate: new Date("2024-03-01"),
      description: "ML pipeline milestone payment",
      milestoneId: milestone10.id
    }
  });

  const payment23 = await prisma.payment.create({
    data: {
      projectId: project11.id,
      type: "ADVANCE",
      amount: 1080000, // ¥1,080,000 JPY
      currency: "JPY",
      exchangeRate: 0.0067,
      amountInBaseCurrency: 7236,
      status: "PAID",
      dueDate: new Date("2023-10-01"),
      paidDate: new Date("2023-10-01"),
      description: "Initial payment for digital transformation"
    }
  });

  const payment24 = await prisma.payment.create({
    data: {
      projectId: project11.id,
      type: "FINAL",
      amount: 2520000, // ¥2,520,000 JPY
      currency: "JPY",
      exchangeRate: 0.0067,
      amountInBaseCurrency: 16884,
      status: "PAID",
      dueDate: new Date("2024-03-10"),
      paidDate: new Date("2024-03-05"),
      description: "Final payment for completed transformation suite"
    }
  });

  // Create transactions with currency data
  await prisma.transaction.create({
    data: {
      paymentId: payment1.id,
      amount: 417500, // ₹4,17,500
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 417500,
      method: "BANK_TRANSFER",
      reference: "TXN-001-2024",
      notes: "Wire transfer received in INR",
      transactionDate: new Date("2024-01-16")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment2.id,
      amount: 668000, // ₹6,68,000
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 668000,
      method: "BANK_TRANSFER",
      reference: "TXN-002-2024",
      notes: "NEFT transfer for milestone completion",
      transactionDate: new Date("2024-02-18")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment3.id,
      amount: 584500, // ₹5,84,500
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 584500,
      method: "CHECK",
      reference: "CHK-1001",
      notes: "Company cheque deposited",
      transactionDate: new Date("2024-03-15")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment5.id,
      amount: 501000, // ₹5,01,000
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 501000,
      method: "CREDIT_CARD",
      reference: "CC-2024-001",
      notes: "Credit card payment processed via Razorpay",
      transactionDate: new Date("2024-02-01")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment6.id,
      amount: 1002000, // ₹10,02,000
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 1002000,
      method: "BANK_TRANSFER",
      reference: "TXN-003-2024",
      notes: "Final payment RTGS transfer",
      transactionDate: new Date("2024-04-03")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment7.id,
      amount: 334000, // ₹3,34,000
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 334000,
      method: "PAYPAL",
      reference: "PP-2024-001",
      notes: "PayPal business payment in INR",
      transactionDate: new Date("2024-03-02")
    }
  });

  // Add USD transactions for user1
  await prisma.transaction.create({
    data: {
      paymentId: payment8b.id,
      amount: 5000, // $5,000 USD
      currency: "USD",
      exchangeRate: 1.0,
      amountInBaseCurrency: 5000,
      method: "BANK_TRANSFER",
      reference: "USD-TXN-001-2024",
      notes: "Wire transfer from US client",
      transactionDate: new Date("2024-02-16")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment8c.id,
      amount: 7500, // $7,500 USD
      currency: "USD",
      exchangeRate: 1.0,
      amountInBaseCurrency: 7500,
      method: "CHECK",
      reference: "USD-CHK-001",
      notes: "Company check in USD",
      transactionDate: new Date("2024-03-12")
    }
  });

  // Add EUR transactions for user1
  await prisma.transaction.create({
    data: {
      paymentId: payment8d.id,
      amount: 3000, // €3,000 EUR
      currency: "EUR",
      exchangeRate: 1.09,
      amountInBaseCurrency: 3270,
      method: "BANK_TRANSFER",
      reference: "EUR-TXN-USER1-001",
      notes: "SEPA transfer from European client",
      transactionDate: new Date("2024-01-11")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment8e.id,
      amount: 5000, // €5,000 EUR
      currency: "EUR",
      exchangeRate: 1.09,
      amountInBaseCurrency: 5450,
      method: "CREDIT_CARD",
      reference: "EUR-CC-USER1-001",
      notes: "Credit card payment in EUR",
      transactionDate: new Date("2024-03-10")
    }
  });

  // Create additional transactions for milestone5 and payment4, payment8
  await prisma.transaction.create({
    data: {
      paymentId: payment4.id,
      amount: 417500, // ₹4,17,500 (partial payment)
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 417500,
      method: "BANK_TRANSFER",
      reference: "TXN-007-2024",
      notes: "Pending payment for integration milestone",
      transactionDate: new Date("2024-04-05")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment8.id,
      amount: 334000, // ₹3,34,000 (overdue payment)
      currency: "INR",
      exchangeRate: 83.5,
      amountInBaseCurrency: 334000,
      method: "BANK_TRANSFER",
      reference: "TXN-008-2024",
      notes: "Overdue payment for homepage design",
      transactionDate: new Date("2024-04-01")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment9.id,
      amount: 10000, // $10,000 USD
      currency: "USD",
      exchangeRate: 1.0,
      amountInBaseCurrency: 10000,
      method: "BANK_TRANSFER",
      reference: "TXN-004-2024",
      notes: "Initial project funding via wire transfer",
      transactionDate: new Date("2024-01-03")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment10.id,
      amount: 8000, // $8,000 USD
      currency: "USD",
      exchangeRate: 1.0,
      amountInBaseCurrency: 8000,
      method: "BANK_TRANSFER",
      reference: "TXN-005-2024",
      notes: "Milestone payment - database completion",
      transactionDate: new Date("2024-02-01")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment11.id,
      amount: 8000, // $8,000 USD
      currency: "USD",
      exchangeRate: 1.0,
      amountInBaseCurrency: 8000,
      method: "CHECK",
      reference: "CHK-2001",
      notes: "Healthcare project advance check",
      transactionDate: new Date("2023-11-01")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment12.id,
      amount: 20000, // $20,000 USD
      currency: "USD",
      exchangeRate: 1.0,
      amountInBaseCurrency: 20000,
      method: "BANK_TRANSFER",
      reference: "TXN-006-2024",
      notes: "Final payment for completed healthcare system",
      transactionDate: new Date("2024-02-08")
    }
  });

  // EUR Transactions
  await prisma.transaction.create({
    data: {
      paymentId: payment13.id,
      amount: 13500, // €13,500 EUR
      currency: "EUR",
      exchangeRate: 1.09,
      amountInBaseCurrency: 14715,
      method: "BANK_TRANSFER",
      reference: "SEPA-001-2024",
      notes: "SEPA transfer from German client",
      transactionDate: new Date("2024-02-01")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment14.id,
      amount: 15000, // €15,000 EUR
      currency: "EUR",
      exchangeRate: 1.09,
      amountInBaseCurrency: 16350,
      method: "BANK_TRANSFER",
      reference: "EUR-TXN-002-2024",
      notes: "Wire transfer for blockchain milestone",
      transactionDate: new Date("2024-03-15")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment15.id,
      amount: 9600, // €9,600 EUR
      currency: "EUR",
      exchangeRate: 1.09,
      amountInBaseCurrency: 10464,
      method: "CREDIT_CARD",
      reference: "EUR-CC-001-2024",
      notes: "Credit card payment via Stripe EUR",
      transactionDate: new Date("2024-01-16")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment16.id,
      amount: 12000, // €12,000 EUR
      currency: "EUR",
      exchangeRate: 1.09,
      amountInBaseCurrency: 13080,
      method: "BANK_TRANSFER",
      reference: "SEPA-003-2024",
      notes: "SEPA instant transfer for security milestone",
      transactionDate: new Date("2024-03-01")
    }
  });

  // SGD Transactions
  await prisma.transaction.create({
    data: {
      paymentId: payment17.id,
      amount: 20400, // S$20,400 SGD
      currency: "SGD",
      exchangeRate: 0.75,
      amountInBaseCurrency: 15300,
      method: "BANK_TRANSFER",
      reference: "SGD-TXN-001-2024",
      notes: "DBS bank transfer from Singapore",
      transactionDate: new Date("2024-03-01")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment18.id,
      amount: 20000, // S$20,000 SGD
      currency: "SGD",
      exchangeRate: 0.75,
      amountInBaseCurrency: 15000,
      method: "CHECK",
      reference: "SGD-CHK-001",
      notes: "Company cheque in Singapore Dollars",
      transactionDate: new Date("2024-04-01")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment19.id,
      amount: 12600, // S$12,600 SGD
      currency: "SGD",
      exchangeRate: 0.75,
      amountInBaseCurrency: 9450,
      method: "PAYPAL",
      reference: "PP-SGD-001-2023",
      notes: "PayPal business payment in SGD",
      transactionDate: new Date("2023-12-01")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment20.id,
      amount: 29400, // S$29,400 SGD
      currency: "SGD",
      exchangeRate: 0.75,
      amountInBaseCurrency: 22050,
      method: "BANK_TRANSFER",
      reference: "SGD-TXN-004-2024",
      notes: "Final payment via OCBC bank transfer",
      transactionDate: new Date("2024-04-05")
    }
  });

  // JPY Transactions
  await prisma.transaction.create({
    data: {
      paymentId: payment21.id,
      amount: 1620000, // ¥1,620,000 JPY
      currency: "JPY",
      exchangeRate: 0.0067,
      amountInBaseCurrency: 10854,
      method: "BANK_TRANSFER",
      reference: "JPY-TXN-001-2024",
      notes: "Bank transfer from Tokyo client",
      transactionDate: new Date("2024-01-02")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment22.id,
      amount: 1800000, // ¥1,800,000 JPY
      currency: "JPY",
      exchangeRate: 0.0067,
      amountInBaseCurrency: 12060,
      method: "BANK_TRANSFER",
      reference: "JPY-TXN-002-2024",
      notes: "Milestone payment via Mizuho bank",
      transactionDate: new Date("2024-03-01")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment23.id,
      amount: 1080000, // ¥1,080,000 JPY
      currency: "JPY",
      exchangeRate: 0.0067,
      amountInBaseCurrency: 7236,
      method: "CHECK",
      reference: "JPY-CHK-001",
      notes: "Company cheque in Japanese Yen",
      transactionDate: new Date("2023-10-01")
    }
  });

  await prisma.transaction.create({
    data: {
      paymentId: payment24.id,
      amount: 2520000, // ¥2,520,000 JPY
      currency: "JPY",
      exchangeRate: 0.0067,
      amountInBaseCurrency: 16884,
      method: "BANK_TRANSFER",
      reference: "JPY-TXN-005-2024",
      notes: "Final payment for digital transformation project",
      transactionDate: new Date("2024-03-05")
    }
  });

  console.log("✅ Seed data created successfully!");
  console.log("📊 Created:");
  console.log("  - 5 Users (INR, USD, EUR, SGD, JPY defaults)");
  console.log("  - 11 Clients across different regions");
  console.log("  - 13 Projects (5 INR, 3 USD, 3 EUR, 2 SGD, 2 JPY)");
  console.log("  - 11 Payment Milestones across all currencies");
  console.log("  - 29 Payments across all currencies");
  console.log("  - 29 Transactions across all currencies");
  console.log("  - 80+ Exchange Rates for comprehensive currency support");
  console.log("");
  console.log("💰 Currency Distribution:");
  console.log("  - INR Projects: ₹45,92,500 total budget");
  console.log("  - USD Projects: $78,000 total budget");
  console.log("  - EUR Projects: €85,000 total budget");
  console.log("  - SGD Projects: S$110,000 total budget");
  console.log("  - JPY Projects: ¥9,000,000 total budget");
  console.log("");
  console.log("👤 User 1 now has multi-currency projects:");
  console.log("  - 3 INR projects (₹45,92,500)");
  console.log("  - 1 USD project ($15,000)");
  console.log("  - 1 EUR project (€8,000)");
  console.log("");
  console.log("🌍 Supported Currencies:");
  console.log("  - Major: INR, USD, EUR, GBP, CAD, AUD, JPY, CHF");
  console.log("  - Asian: CNY, SGD, HKD, KRW, THB, MYR");
  console.log("  - European: NOK, SEK, DKK, PLN, CZK, HUF, RUB");
  console.log("  - Middle East: AED, SAR");
  console.log("  - Latin America: BRL, MXN");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
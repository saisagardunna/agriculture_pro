const { MongoClient } = require("mongodb")

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://damerasrimanthreddy:1234@agri.4aqzbx2.mongodb.net/?retryWrites=true&w=majority&appName=agri"

const sampleProducts = [
  {
    name: "Premium Wheat Seeds",
    description: "High-yield wheat seeds suitable for all soil types. Disease resistant and drought tolerant.",
    price: 450,
    category: "seeds",
    stock: 100,
    image: "/placeholder.svg?height=300&width=400",
    status: "active",
    createdAt: new Date(),
  },
  {
    name: "Organic Fertilizer NPK",
    description: "Complete organic fertilizer with balanced NPK ratio for healthy plant growth.",
    price: 850,
    category: "fertilizers",
    stock: 75,
    image: "/placeholder.svg?height=300&width=400",
    status: "active",
    createdAt: new Date(),
  },
  {
    name: "Smart Irrigation System",
    description: "Automated drip irrigation system with smart sensors for efficient water management.",
    price: 12500,
    category: "tools",
    stock: 25,
    image: "/placeholder.svg?height=300&width=400",
    status: "active",
    createdAt: new Date(),
  },
  {
    name: "Bio Pesticide Spray",
    description: "Eco-friendly pesticide made from natural ingredients. Safe for crops and environment.",
    price: 320,
    category: "pesticides",
    stock: 150,
    image: "/placeholder.svg?height=300&width=400",
    status: "active",
    createdAt: new Date(),
  },
  {
    name: "Hybrid Tomato Seeds",
    description: "High-yielding hybrid tomato seeds with excellent disease resistance.",
    price: 280,
    category: "seeds",
    stock: 200,
    image: "/placeholder.svg?height=300&width=400",
    status: "active",
    createdAt: new Date(),
  },
  {
    name: "Soil Testing Kit",
    description: "Professional soil testing kit to analyze pH, nutrients, and soil health.",
    price: 1250,
    category: "tools",
    stock: 50,
    image: "/placeholder.svg?height=300&width=400",
    status: "active",
    createdAt: new Date(),
  },
]

async function seedProducts() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()
    const collection = db.collection("products")

    // Clear existing products
    await collection.deleteMany({})
    console.log("Cleared existing products")

    // Insert sample products
    const result = await collection.insertMany(sampleProducts)
    console.log(`Inserted ${result.insertedCount} products`)

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedProducts()

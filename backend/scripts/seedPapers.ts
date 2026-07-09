import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Paper from "../models/Paper.js"; // Note: .js extension for ES Module resolution in TS

// Load environment variables from the parent directory's .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// --- CONFIGURATION ---
// Hardcoded target user ID (Must be a valid MongoDB ObjectId)
// You can replace this with an actual user ID from your database
const TARGET_USER_ID = "65b9df0a1234567890abcdef"; 

const seedDatabase = async () => {
  try {
    // 1. Connect to Database
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/research-paper-tracker";
    await mongoose.connect(MONGO_URI);
    console.log("✅ Successfully connected to MongoDB for seeding.");

    // Helper for date offsets
    const getDaysAgo = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return date;
    };

    // 2. Define Mock Data
    const mockPapers = [
      // --- THIS WEEK (< 7 days) ---
      {
        user: TARGET_USER_ID,
        title: "Attention Is All You Need",
        firstAuthor: "Ashish Vaswani",
        researchDomain: "Computer Science",
        readingStage: "Fully Read",
        citationCount: 95432,
        impactScore: "High Impact",
        dateAdded: getDaysAgo(2),
      },
      {
        user: TARGET_USER_ID,
        title: "CRISPR-Cas9 Structures and Mechanisms",
        firstAuthor: "F. Jiang",
        researchDomain: "Biology",
        readingStage: "Methodology Done",
        citationCount: 1423,
        impactScore: "High Impact",
        dateAdded: getDaysAgo(5),
      },

      // --- THIS MONTH (< 30 days) ---
      {
        user: TARGET_USER_ID,
        title: "Quantum Supremacy Using a Programmable Superconducting Processor",
        firstAuthor: "Frank Arute",
        researchDomain: "Physics",
        readingStage: "Abstract Read",
        citationCount: 8901,
        impactScore: "High Impact",
        dateAdded: getDaysAgo(15),
      },
      {
        user: TARGET_USER_ID,
        title: "Advances in Asymmetric Organocatalysis",
        firstAuthor: "Benjamin List",
        researchDomain: "Chemistry",
        readingStage: "Notes Completed",
        citationCount: 350,
        impactScore: "Medium Impact",
        dateAdded: getDaysAgo(25),
      },

      // --- LAST 3 MONTHS (< 90 days) ---
      {
        user: TARGET_USER_ID,
        title: "A Mathematical Theory of Communication",
        firstAuthor: "Claude Shannon",
        researchDomain: "Mathematics",
        readingStage: "Results Analyzed",
        citationCount: 135400,
        impactScore: "High Impact",
        dateAdded: getDaysAgo(45),
      },
      {
        user: TARGET_USER_ID,
        title: "The WEIRDest People in the World",
        firstAuthor: "Joseph Henrich",
        researchDomain: "Social Sciences",
        readingStage: "Introduction Done",
        citationCount: 412,
        impactScore: "Medium Impact",
        dateAdded: getDaysAgo(80),
      },

      // --- ALL TIME (> 90 days) ---
      {
        user: TARGET_USER_ID,
        title: "Deep Residual Learning for Image Recognition",
        firstAuthor: "Kaiming He",
        researchDomain: "Computer Science",
        readingStage: "Notes Completed",
        citationCount: 154000,
        impactScore: "High Impact",
        dateAdded: getDaysAgo(150),
      },
      {
        user: TARGET_USER_ID,
        title: "Low-impact preliminary study on cellular respiration",
        firstAuthor: "John Doe",
        researchDomain: "Biology",
        readingStage: "Abstract Read",
        citationCount: 12,
        impactScore: "Low Impact",
        dateAdded: getDaysAgo(200),
      },
      {
        user: TARGET_USER_ID,
        title: "Unpublished pre-print on network topologies",
        firstAuthor: "Jane Smith",
        researchDomain: "Computer Science",
        readingStage: "Introduction Done",
        citationCount: 0,
        impactScore: "Unknown",
        dateAdded: getDaysAgo(120),
      }
    ];

    // 3. Purge existing items for the target user
    const deleteResult = await Paper.deleteMany({ user: TARGET_USER_ID });
    console.log(`🗑️  Purged ${deleteResult.deletedCount} existing paper(s) for user ${TARGET_USER_ID}.`);

    // 4. Insert mock papers
    const insertResult = await Paper.insertMany(mockPapers);
    console.log(`🌱 Successfully seeded ${insertResult.length} mock paper(s) into the database!`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding the database:", error);
    process.exit(1);
  }
};

seedDatabase();

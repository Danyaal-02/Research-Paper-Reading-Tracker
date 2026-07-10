import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Paper from "../models/Paper.js"; // Note: .js extension for ES Module resolution in TS
import User from "../models/User.js";
import logger from "../utils/logger.js";

// Load environment variables from the parent directory's .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// We will fetch the TARGET_USER_ID dynamically from the database
// by finding the most recently created user. 

const seedDatabase = async () => {
  try {
    // 1. Connect to Database
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/research-paper-tracker";
    await mongoose.connect(MONGO_URI);
    logger.info("✅ Successfully connected to MongoDB for seeding.", { context: "Seed" });

    // Fetch the most recently created user
    const latestUser = await User.findOne().sort({ createdAt: -1 });
    if (!latestUser) {
      logger.error("❌ No users found in the database. Please create an account in the UI first.", { context: "Seed" });
      process.exit(1);
    }
    
    const TARGET_USER_ID = latestUser._id.toString();
    logger.info(`Found latest user: ${latestUser.email} (${TARGET_USER_ID}). Seeding data...`, { context: "Seed" });

    // Helper for date offsets
    const getDaysAgo = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return date;
    };

    // 2. Define Mock Data (100 Entries)
    const DOMAINS = ["Computer Science", "Biology", "Physics", "Chemistry", "Mathematics", "Social Sciences"];
    const STAGES = ["Abstract Read", "Introduction Done", "Methodology Done", "Results Analyzed", "Fully Read", "Notes Completed"];
    const IMPACT_SCORES = ["High Impact", "Medium Impact", "Low Impact", "Unknown"];
    const FIRST_NAMES = ["Alan", "Ada", "Claude", "Grace", "Tim", "Marie", "Albert", "Niels", "Rosalind", "Richard", "Linus"];
    const LAST_NAMES = ["Turing", "Lovelace", "Shannon", "Hopper", "Berners-Lee", "Curie", "Einstein", "Bohr", "Franklin", "Feynman", "Torvalds"];
    const TOPICS = ["Networks", "Algorithms", "Machine Learning", "Quantum Computing", "Genomics", "Thermodynamics", "Cryptography", "Data Structures", "Particle Physics", "Cognitive Psychology"];
    const ACTIONS = ["Analysis of", "Advances in", "A New Approach to", "Understanding", "Deep Dive into", "Fundamentals of", "Applications of", "The Future of"];

    const mockPapers = Array.from({ length: 100 }).map((_, i) => {
      // Randomized Fields
      const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
      const stage = STAGES[Math.floor(Math.random() * STAGES.length)];
      const impact = IMPACT_SCORES[Math.floor(Math.random() * IMPACT_SCORES.length)];
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];

      const title = `${action} ${topic} (${i + 1})`;
      const citationCount = Math.floor(Math.pow(Math.random(), 3) * 50000); // Skewed towards lower citations, but possible high
      const daysAgo = Math.floor(Math.random() * 365); // Random day within the last year

      return {
        user: TARGET_USER_ID,
        title,
        firstAuthor: `${firstName} ${lastName}`,
        researchDomain: domain,
        readingStage: stage,
        citationCount,
        impactScore: impact,
        dateAdded: getDaysAgo(daysAgo),
      };
    });

    // 3. Purge existing items for the target user
    const deleteResult = await Paper.deleteMany({ user: TARGET_USER_ID });
    logger.info(`🗑️  Purged ${deleteResult.deletedCount} existing paper(s) for user ${TARGET_USER_ID}.`, { context: "Seed" });

    // 4. Insert mock papers
    const insertResult = await Paper.insertMany(mockPapers);
    logger.info(`🌱 Successfully seeded ${insertResult.length} mock paper(s) into the database!`, { context: "Seed" });

    process.exit(0);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`❌ Error seeding the database: ${error.message}`, { context: "Seed" });
    }
    process.exit(1);
  }
};

seedDatabase();

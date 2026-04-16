import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const password = await bcrypt.hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@rankspark.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@rankspark.com",
      password,
    },
  });

  // Seed rankings
  const rankingsData = [
    {
      title: "Top 10 Programming Languages 2025",
      description:
        "The most popular and impactful programming languages developers should know in 2025.",
      category: "technology",
      aiGenerated: true,
      items: [
        {
          rank: 1,
          title: "Python",
          description: "Dominant in AI/ML, data science, and general programming.",
          aiReasoning:
            "Python continues to reign supreme due to its dominance in AI and machine learning, an enormous ecosystem of libraries, and unmatched readability that welcomes beginners while satisfying experts.",
        },
        {
          rank: 2,
          title: "JavaScript",
          description: "The language of the web, running everywhere.",
          aiReasoning:
            "JavaScript remains indispensable as the only language natively supported by browsers, and Node.js has extended its reach to servers, making it the most versatile language for full-stack development.",
        },
        {
          rank: 3,
          title: "TypeScript",
          description: "JavaScript with static typing for large-scale apps.",
          aiReasoning:
            "TypeScript's type safety catches errors at compile time and dramatically improves developer productivity in large codebases, making it the preferred choice for enterprise applications.",
        },
        {
          rank: 4,
          title: "Rust",
          description: "Systems programming with memory safety guarantees.",
          aiReasoning:
            "Rust has disrupted systems programming by offering C-like performance without the memory safety pitfalls, earning a spot in the Linux kernel and being loved by developers for six consecutive years.",
        },
        {
          rank: 5,
          title: "Go",
          description: "Simple, fast, and designed for the cloud.",
          aiReasoning:
            "Go's simplicity and built-in concurrency support make it ideal for cloud-native development. Docker, Kubernetes, and countless microservices are written in Go.",
        },
      ],
    },
    {
      title: "Greatest Movies of All Time",
      description:
        "Timeless cinematic masterpieces that defined filmmaking and culture.",
      category: "entertainment",
      aiGenerated: false,
      items: [
        {
          rank: 1,
          title: "The Godfather (1972)",
          description: "Francis Ford Coppola's operatic crime masterpiece.",
        },
        {
          rank: 2,
          title: "Citizen Kane (1941)",
          description: "Orson Welles' revolutionary portrait of power and loss.",
        },
        {
          rank: 3,
          title: "2001: A Space Odyssey (1968)",
          description: "Kubrick's philosophical journey to the stars.",
        },
        {
          rank: 4,
          title: "Pulp Fiction (1994)",
          description: "Tarantino's non-linear crime anthology.",
        },
        {
          rank: 5,
          title: "Schindler's List (1993)",
          description: "Spielberg's devastating Holocaust drama.",
        },
      ],
    },
    {
      title: "Best JavaScript Frameworks",
      description: "The most popular and powerful JavaScript frameworks for building modern web applications.",
      category: "technology",
      aiGenerated: true,
      items: [
        {
          rank: 1,
          title: "React",
          description: "Meta's component-based UI library.",
          aiReasoning:
            "React's virtual DOM, component model, and massive ecosystem have made it the most adopted front-end library, powering Meta, Netflix, Airbnb, and millions of applications worldwide.",
        },
        {
          rank: 2,
          title: "Next.js",
          description: "The full-stack React framework.",
          aiReasoning:
            "Next.js provides everything developers need for production React apps: SSR, SSG, file-based routing, API routes, and edge functions — all with outstanding developer experience.",
        },
        {
          rank: 3,
          title: "Vue.js",
          description: "Progressive framework with gentle learning curve.",
          aiReasoning:
            "Vue.js strikes the perfect balance between approachability and power. Its reactivity system and single-file components make it incredibly productive for teams of all sizes.",
        },
        {
          rank: 4,
          title: "Svelte",
          description: "Compile-time framework with zero runtime overhead.",
          aiReasoning:
            "Svelte's compile-time approach eliminates framework overhead entirely, producing the smallest and fastest applications. Its syntax is the most intuitive of any modern framework.",
        },
        {
          rank: 5,
          title: "Angular",
          description: "Google's opinionated enterprise framework.",
          aiReasoning:
            "Angular's comprehensive, opinionated structure with built-in tooling, dependency injection, and TypeScript-first approach makes it the preferred choice for large enterprise teams.",
        },
      ],
    },
  ];

  for (const data of rankingsData) {
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s]+/g, "-")
      .substring(0, 60) + "-demo";

    const existing = await prisma.rankingList.findFirst({ where: { slug } });
    if (existing) continue;

    await prisma.rankingList.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        isPublic: true,
        aiGenerated: data.aiGenerated,
        slug,
        authorId: user.id,
        items: {
          create: data.items,
        },
      },
    });
    console.log(`Created: ${data.title}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

export const solutionsData = [
    {
        id: 1,
        title: "LLM Integration Engine",
        category: "AI Architecture",
        description: "A robust middleware facilitating seamless communication between frontend inputs and Large Language Models (OpenAI/Anthropic). Features include context awareness, streaming responses for real-time latency reduction, and prompt engineering utilities.",
        tech: ["LangChain", "Node.js", "Redis Memory", "Streaming API"]
    },
    {
        id: 2,
        title: "Scalable Microservices",
        category: "Backend Systems",
        description: "Decomposed monolithic legacy systems into isolated, fault-tolerant microservices. Utilized Docker orchestration and RabbitMQ for asynchronous event-driven communication, ensuring 99.9% uptime and horizontal scalability.",
        tech: ["Docker", "Kubernetes", "RabbitMQ", "Go/Node"]
    },
    {
        id: 3,
        title: "Real-time Collab Platform",
        category: "Web Sockets",
        description: "Engineered a high-concurrency document collaboration tool utilizing WebSockets for sub-100ms updates. Implemented Operational Transformation algorithms to handle conflict resolution multiple active users.",
        tech: ["Socket.io", "Redis Pub/Sub", "React", "CRDTs"]
    },
    {
        id: 4,
        title: "Cloud-Native DevOps Pipeline",
        category: "DevOps",
        description: "Automated CI/CD workflows reducing deployment time by 70%. Integrated infrastructure-as-code (Terraform) for reproducible environments across staging and production AWS clusters.",
        tech: ["GitHub Actions", "Terraform", "AWS ECS", "Prometheus"]
    }
];

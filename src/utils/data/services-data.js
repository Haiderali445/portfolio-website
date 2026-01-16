export const servicesData = [
    {
        id: 1,
        name: "Custom Business Solutions",
        description: "We build tailored software solutions to address your unique business challenges. From CRM systems to workflow automation, we've got you covered.",
        fullTechStack: ["Python", "Django", "PostgreSQL", "Redis", "Docker", "React"],
        problem: "Businesses often struggle with off-the-shelf software that doesn't fit their specific operational prowess, leading to manual workarounds and data silos.",
        solution: "A bespoke ERP/CRM platform engineered to mirror your exact business logic. We focus on automation, data integrity, and role-based access control to streamline operations.",
        implementationSteps: [
            { title: "Discovery", description: "Mapping out business processes and identifying bottlenecks." },
            { title: "Architecture", description: "Designing a modular database schema with PostgreSQL." },
            { title: "Core Logic", description: "Implementing business rules using Django's robust ORM." },
            { title: "UI Integration", description: "Connecting the React frontend via RESTful APIs." }
        ]
    },
    {
        id: 2,
        name: "Modern Website Development",
        description: "We create stunning, responsive websites that showcase your brand and drive conversions. We use the latest technologies to ensure your site is fast, secure, and user-friendly.",
        fullTechStack: ["Next.js", "Tailwind CSS", "Framer Motion", "Vercel", "Sanity CMS"],
        problem: "In a digital-first world, a slow or generic website kills credibility. High bounce rates and poor SEO are symptoms of outdated web architectures.",
        solution: "A high-performance Jamstack site. We leverage Next.js for server-side rendering (SEO) and Framer Motion for that premium, fluid 'app-like' feel.",
        implementationSteps: [
            { title: "Design System", description: "Defining typography, colors, and component tokens in Figma." },
            { title: "Component Build", description: "Developing atomic components with Tailwind CSS." },
            { title: "Content Modeling", description: "Setting up Sanity.io for easy client content management." },
            { title: "Optimization", description: "Achieving 100/100 Lighthouse scores via image optimization and code splitting." }
        ]
    },
    {
        id: 3,
        name: "Innovative Web Applications",
        description: "We develop cutting-edge web applications that streamline your operations, engage your customers, and provide a competitive edge.",
        fullTechStack: ["MERN Stack", "Socket.io", "AWS S3", "Redux Toolkit", "Stripe"],
        problem: "Static content is no longer enough. Users expect real-time interaction, complex data visualization, and seamless payments within the browser.",
        solution: "A Single Page Application (SPA) capable of handling complex state and real-time events. Scalable on AWS and secure.",
        implementationSteps: [
            { title: "API Design", description: "Structuring Express routes and MongoDB schemas." },
            { title: "State Management", description: "Implementing Redux for predictable global state flows." },
            { title: "Real-time Layer", description: "Integrating Socket.io for live notifications/chats." },
            { title: "Deployment", description: "CI/CD pipelining to AWS for automated scaling." }
        ]
    },
];

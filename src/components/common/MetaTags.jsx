import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaTags = ({
    title = "Haider Ali | AI Architect & Full-Stack Engineer",
    description = "Portfolio of Haider Ali, a Software Engineering student and Backend Developer specializing in Agentic AI, distributed microservices, and enterprise architecture.",
    keywords = ["Haider Ali", "Software Engineer", "AI Architect", "Backend Developer", "Agentic AI", "Distributed Systems", "Enterprise Architecture", ".NET Core", "Node.js", "Full Stack Developer"],
    image = "https://haideraliblog.netlify.app/assets/images/imgghibli.png",
    url = "https://haideraliblog.netlify.app/"
}) => {
    // Structured Data for Person/Professional Portfolio
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Haider Ali",
        "jobTitle": "AI Architect & Full Stack Engineer",
        "url": url,
        "description": description
    };

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="profile" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="profile:first_name" content="Haider" />
            <meta property="profile:last_name" content="Ali" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};

export default MetaTags;
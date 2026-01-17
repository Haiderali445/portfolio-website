import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaTags = ({
    title = "Haider Ali | AI Architect & Full Stack Engineer",
    description = "Portfolio of Haider Ali, a specialized AI Architect and Full Stack Engineer.",
    keywords = ["Software Engineer", "AI Architect", "Portfolio"],
    image = "https://haider-ali-portfolio.vercel.app/og-image.png",
    url = "https://haider-ali-portfolio.vercel.app/"
}) => {
    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
};

export default MetaTags;

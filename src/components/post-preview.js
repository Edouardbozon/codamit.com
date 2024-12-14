import React from 'react';
import { Link } from 'gatsby';
import { rhythm } from '../utils/typography';

export const PostPreview = ({ node }) => {
  const title = node.frontmatter.title || node.fields.slug;
  return (
    <article key={node.fields.slug}>
      <header>
        <h3
          style={{
            marginTop: 0,
            marginBottom: 0,
            fontFamily: '"Public Sans", sans-serif',
          }}
        >
          <Link style={{ color: 'initial' }} to={node.fields.slug}>
            {title}
          </Link>
        </h3>
      </header>
      <section
        style={{
          marginTop: rhythm(1 / 4),
          marginBottom: 0,
        }}
      >
        <p
          style={{ marginBottom: 0 }}
          dangerouslySetInnerHTML={{
            __html: node.frontmatter.description || node.excerpt,
          }}
        />
      </section>
      <footer style={{ marginTop: rhythm(1 / 6), fontWeight: 'lighter' }}>
        <span style={{ fontSize: '14px' }}>
          {node.frontmatter.draft ? (
            <span>
              <span role="img" aria-label="emoji" alt="wip">
                🚧
              </span>{' '}
              Draft
            </span>
          ) : (
            node.frontmatter.date
          )}
        </span>
      </footer>
    </article>
  );
};

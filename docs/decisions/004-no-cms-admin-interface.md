## ADR-004: No CMS Admin Interface (Decap/Forestry) for Initial Phase

**Date:** 2025-05-22  
**Status:** Accepted  
**Participants:** CTO, Lead Developer

### Context
Considering whether to implement CMS admin interface (Decap CMS, Forestry, etc.) for content management.

### Decision
**Skip CMS admin interface** for initial phase. Use direct file editing in IDE with helper scripts.

### Rationale
- **Team Size**: Solo developer comfortable with markdown and git workflow
- **Content Volume**: 10-25 articles manageable with file-based editing
- **Setup Cost**: CMS admin would take 2-3 days to configure properly
- **Maintenance**: Additional system to maintain, update, and troubleshoot
- **Authentication Complexity**: OAuth setup, user management overhead
- **Development Speed**: File editing is actually faster for technical users

### Implementation
- VS Code snippets for frontmatter templates
- CLI script to generate new article files with pre-filled metadata
- Git-based review process for content changes
- Contentlayer validation ensures content quality

### Helper Tools
```bash
# Create new article
npm run new-article "Understanding Coffee Bean Varieties"

# Validates all content
npm run validate-content

# Preview content locally
npm run dev
```

### Future Considerations
Consider CMS admin when:
- Hiring non-technical content writers
- Multiple team members need content access
- Article volume exceeds 50+ and becomes hard to manage manually
- Client requests visual editing interface

### Consequences
- **Positive**: Faster development, no additional systems, familiar git workflow
- **Negative**: Requires markdown knowledge for content editing
- **Future**: Can add CMS admin later without changing content structure

---
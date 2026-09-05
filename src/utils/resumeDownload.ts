import { PERSONAL_INFO, EXPERIENCE_DATA, CREDENTIALS_DATA, SKILLS_MATRIX } from '../data/portfolioData';

/**
 * Generates and triggers the client-side download of Saurabh's verified Curriculum Vitae.
 */
export function downloadResume() {
  const content = `========================================================================
SAURABH — CREATIVE TECHNOLOGIST & VISUAL EDITOR
Video Editor | Web Developer | Graphic Designer
Founder, Happicore Studio
========================================================================

CONTACT & CHANNELS:
- Email: ${PERSONAL_INFO.email}
- Location: ${PERSONAL_INFO.location}
- Status: ${PERSONAL_INFO.status}
- LinkedIn: ${PERSONAL_INFO.linkedin}
- Studio Instagram: ${PERSONAL_INFO.studio.instagramUrl}

------------------------------------------------------------------------
EXECUTIVE SUMMARY:
${PERSONAL_INFO.intro}
${PERSONAL_INFO.tagline}

------------------------------------------------------------------------
EDUCATION:
- Degree: ${PERSONAL_INFO.education.degree}
- Institution: ${PERSONAL_INFO.education.institution} (${PERSONAL_INFO.education.shortInstitution})
- Period: ${PERSONAL_INFO.education.period}
- Focus: Computational Systems, Algorithmic Foundations, Multimedia Engineering

------------------------------------------------------------------------
PROFESSIONAL EXPERIENCE:
${EXPERIENCE_DATA.map((item) => `
* ${item.role.toUpperCase()}
  Organization: ${item.organization} (${item.period})
  Location: ${item.location}
  Responsibilities & Milestones:
  ${Array.isArray(item.description) ? item.description.map((d) => `  - ${d}`).join('\n') : `  - ${item.description}`}
  Skills Applied: ${(item.skills || []).join(', ')}
`).join('\n')}

------------------------------------------------------------------------
CORE TECHNICAL & CREATIVE TOOLKIT:
- Web Development: ${SKILLS_MATRIX.web.join(', ')}
- Graphic Design: ${SKILLS_MATRIX.graphic.join(', ')}
- Video & Motion: ${SKILLS_MATRIX.video.join(', ')}
- Workflow: DaVinci Resolve Studio, Adobe Premiere Pro, After Effects, Next.js, React, Tailwind CSS

------------------------------------------------------------------------
ACCREDITATIONS & HONORS:
${CREDENTIALS_DATA.map((c) => `- [${c.category}] ${c.title} (${c.issuedBy}, ${c.year})`).join('\n')}

------------------------------------------------------------------------
PORTFOLIO & CONTACT:
For commercial inquiries, film editing commissions, and full-stack web builds,
visit the live portfolio or contact ${PERSONAL_INFO.email}.
========================================================================
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Saurabh_Creative_Portfolio_Resume.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import { Project, WireframeElement } from '../types';

export function downloadJson(data: any, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.json') ? filename : `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateHtmlCode(project: Project): string {
  const elements = project.wireframe.elements;
  const brand = project.brandPreset;

  const renderedElementsHtml = elements
    .map((el) => {
      if (el.type === 'navbar') {
        const links = (el.props.links || ['Home', 'Features', 'Pricing'])
          .map((l: string) => `<a href="#" class="text-zinc-600 hover:text-zinc-900 font-medium text-sm transition-colors">${l}</a>`)
          .join('');
        return `
    <!-- Navbar Component -->
    <header class="w-full bg-white border-b border-zinc-200 py-4 px-6 sticky top-0 z-30 shadow-xs">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-8">
          <div class="text-xl font-bold tracking-tight text-zinc-900">${el.props.brandName || brand.brandName}</div>
          <nav class="hidden md:flex items-center space-x-6">
            ${links}
          </nav>
        </div>
        <div>
          <a href="#" class="px-4 py-2 bg-[${brand.primaryColor}] text-white font-medium text-sm rounded-${brand.borderRadius === 9999 ? 'full' : 'lg'} hover:opacity-90 transition-opacity">
            ${el.props.ctaText || 'Get Started'}
          </a>
        </div>
      </div>
    </header>`;
      }

      if (el.type === 'hero') {
        return `
    <!-- Hero Component -->
    <section class="w-full py-20 px-6 bg-zinc-50 border-b border-zinc-200">
      <div class="max-w-4xl mx-auto text-center">
        ${
          el.props.badgeText
            ? `<div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-6">
            ${el.props.badgeText}
          </div>`
            : ''
        }
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6">
          ${el.props.title || 'Turn Ideas Into Wireframes'}
        </h1>
        <p class="text-lg sm:text-xl text-zinc-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          ${el.props.subtitle || 'Effortlessly transform natural language requirements into structured concepts.'}
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#" class="w-full sm:w-auto px-6 py-3 bg-[${brand.primaryColor}] text-white font-semibold text-base rounded-${brand.borderRadius === 9999 ? 'full' : 'lg'} shadow-sm hover:opacity-90 transition-opacity">
            ${el.props.primaryBtnText || 'Start Now'}
          </a>
          ${
            el.props.secondaryBtnText
              ? `<a href="#" class="w-full sm:w-auto px-6 py-3 bg-white text-zinc-800 font-semibold text-base border border-zinc-300 rounded-${brand.borderRadius === 9999 ? 'full' : 'lg'} hover:bg-zinc-100 transition-colors">
            ${el.props.secondaryBtnText}
          </a>`
              : ''
          }
        </div>
      </div>
    </section>`;
      }

      if (el.type === 'search') {
        return `
    <!-- Search Component -->
    <section class="w-full py-8 px-6 bg-white border-b border-zinc-200">
      <div class="max-w-3xl mx-auto">
        <div class="relative flex items-center">
          <input type="text" placeholder="${el.props.placeholder || 'Search...'}" class="w-full pl-4 pr-32 py-3.5 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-[${brand.primaryColor}] focus:outline-hidden text-zinc-900 shadow-xs" />
          <button class="absolute right-2 px-5 py-2 bg-[${brand.primaryColor}] text-white text-sm font-medium rounded-lg hover:opacity-90">
            ${el.props.buttonText || 'Search'}
          </button>
        </div>
        ${
          el.props.popularTags
            ? `<div class="flex flex-wrap items-center gap-2 mt-3 text-xs text-zinc-500">
            <span class="font-medium">Popular:</span>
            ${el.props.popularTags.map((t: string) => `<span class="px-2.5 py-1 bg-zinc-100 rounded-md text-zinc-700 cursor-pointer hover:bg-zinc-200">${t}</span>`).join('')}
          </div>`
            : ''
        }
      </div>
    </section>`;
      }

      if (el.type === 'restaurant_grid' || el.type === 'product_grid') {
        const items = (el.props.restaurants || el.props.products || [
          { name: 'Featured Item 1', price: '$24.00', rating: 4.9 },
          { name: 'Featured Item 2', price: '$32.00', rating: 4.8 },
          { name: 'Featured Item 3', price: '$18.00', rating: 4.7 },
        ])
          .map((item: any) => `
          <div class="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow p-5">
            <div class="h-40 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-400 mb-4 font-mono text-xs">
              [Image: ${item.name}]
            </div>
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-bold text-zinc-900 text-lg">${item.name}</h3>
              <span class="text-xs font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-sm">★ ${item.rating || '5.0'}</span>
            </div>
            <p class="text-sm text-zinc-500 mb-4">${item.cuisine || item.category || 'Curated Selection'}</p>
            <div class="flex items-center justify-between pt-3 border-t border-zinc-100">
              <span class="font-semibold text-zinc-900">${item.price || item.deliveryFee || 'Free Delivery'}</span>
              <button class="px-3 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-md hover:bg-zinc-800">
                Select
              </button>
            </div>
          </div>`)
          .join('');

        return `
    <!-- Grid Component -->
    <section class="w-full py-16 px-6 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold tracking-tight text-zinc-900">${el.props.heading || 'Featured Collection'}</h2>
          <p class="text-zinc-600 mt-2">${el.props.subheading || 'Browse top recommended selections.'}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${items}
        </div>
      </div>
    </section>`;
      }

      if (el.type === 'testimonials') {
        const reviews = (el.props.items || [
          { quote: 'Unparalleled experience and swift delivery.', author: 'Sarah Jenkins', role: 'Verified Customer' },
          { quote: 'Intuitive design and clean user experience.', author: 'Michael Chang', role: 'Daily User' },
        ])
          .map((rev: any) => `
          <div class="bg-white border border-zinc-200 rounded-xl p-6 shadow-xs">
            <div class="text-amber-400 mb-3 text-sm">★★★★★</div>
            <p class="text-zinc-700 italic mb-6">"${rev.quote}"</p>
            <div>
              <div class="font-semibold text-zinc-900 text-sm">${rev.author}</div>
              <div class="text-xs text-zinc-500">${rev.role}</div>
            </div>
          </div>`)
          .join('');

        return `
    <!-- Testimonials Component -->
    <section class="w-full py-16 px-6 bg-zinc-50 border-t border-b border-zinc-200">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-zinc-900">${el.props.heading || 'Customer Feedback'}</h2>
          <p class="text-zinc-600 mt-2">${el.props.subheading || 'What our users are saying'}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${reviews}
        </div>
      </div>
    </section>`;
      }

      if (el.type === 'footer') {
        return `
    <!-- Footer Component -->
    <footer class="w-full bg-zinc-900 text-zinc-400 py-12 px-6">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div class="text-white font-bold text-lg">${el.props.brandName || brand.brandName}</div>
          <p class="text-xs text-zinc-500 mt-1">${el.props.tagline || 'Engineered with AI-Driven Precision.'}</p>
        </div>
        <div class="text-xs text-zinc-500">
          ${el.props.copyright || '© 2026 All rights reserved.'}
        </div>
      </div>
    </footer>`;
      }

      // Generic container / section fallback
      return `
    <!-- Section: ${el.type} -->
    <section class="w-full py-12 px-6 border-b border-zinc-200 bg-white">
      <div class="max-w-6xl mx-auto">
        <h3 class="text-xl font-bold text-zinc-900 mb-2">${el.props.title || el.props.heading || el.type.toUpperCase()}</h3>
        <p class="text-zinc-600 text-sm">${el.props.subtitle || el.props.desc || 'Standard wireframe block.'}</p>
      </div>
    </section>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name} - Generated Wireframe</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: '${brand.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  </style>
</head>
<body class="bg-zinc-100 text-zinc-900 min-h-screen antialiased flex flex-col">
  <!-- Generated by AI-Driven Wireframe Platform -->
  <div class="w-full">
    ${renderedElementsHtml}
  </div>
</body>
</html>`;
}

export function downloadHtml(project: Project) {
  const html = generateHtmlCode(project);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const sanitizedName = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  link.download = `${sanitizedName}-wireframe.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadMarkdownSummary(project: Project) {
  const md = `# ${project.name} — Design Specification & Wireframe Blueprint

**Generated**: ${new Date(project.updatedAt).toLocaleDateString()}
**Domain**: ${project.domain}
**Primary Color**: \`${project.brandPreset.primaryColor}\`
**Font**: ${project.brandPreset.fontFamily}
**Target Devices**: ${project.devices.join(', ')}

---

## 1. Natural Language Requirement
> "${project.requirement}"

## 2. AI Requirements Understanding
- **Identified Pages**: ${project.analysis.pages.join(', ')}
- **Identified Components**: ${project.analysis.components.join(', ')}
- **Design Style Hints**: ${project.analysis.style_hints.join(', ')}
- **Constraints**: ${project.analysis.constraints.join(', ')}
- **Design Rationale**: ${project.analysis.design_rationale || 'N/A'}

## 3. Wireframe Hierarchy (${project.wireframe.elements.length} components)
${project.wireframe.elements
  .map((el, i) => `${i + 1}. **${el.type.toUpperCase()}** (ID: \`${el.id}\`)
   - Dimensions: \`width: ${el.width}\`, \`height: ${el.height}px\`
   - Properties: \`${JSON.stringify(el.props)}\``)
  .join('\n')}

---
*Exported from AI-Driven Wireframe and Design Concept Platform*
`;

  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const sanitizedName = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  link.download = `${sanitizedName}-spec.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * DesignSystemAgent
 * Client-side agent to read, preview, and export design tokens
 * Provides helpers to render a live style guide and edit token overrides.
 */
(function() {
  class DesignSystemAgent {
    constructor(options = {}) {
      this.options = options;
      this.tokenPrefix = options.tokenPrefix || '--';
      this.overrideStyleId = 'ds-agent-overrides';
      this.overrides = new Map();
      this.tokens = this.readTokens();
    }

    // Read CSS custom properties from :root
    readTokens() {
      const styles = getComputedStyle(document.documentElement);
      const tokens = {};
      for (let i = 0; i < styles.length; i++) {
        const name = styles[i];
        if (!name.startsWith(this.tokenPrefix)) continue;
        const value = styles.getPropertyValue(name).trim();
        tokens[name] = value;
      }
      return tokens;
    }

    // Group tokens into logical sections for the style guide
    groupTokens(tokens = this.tokens) {
      const groups = {
        colors: {},
        typography: {},
        spacing: {},
        radius: {},
        shadows: {},
        zindex: {},
        animation: {},
        gradients: {},
        misc: {}
      };

      Object.entries(tokens).forEach(([name, value]) => {
        if (name.startsWith('--color-')) groups.colors[name] = value;
        else if (name.startsWith('--text-') || name.startsWith('--font-') || name.startsWith('--leading-') || name.startsWith('--tracking-')) groups.typography[name] = value;
        else if (name.startsWith('--space-')) groups.spacing[name] = value;
        else if (name.startsWith('--radius-')) groups.radius[name] = value;
        else if (name.startsWith('--shadow-')) groups.shadows[name] = value;
        else if (name.startsWith('--z-index-')) groups.zindex[name] = value;
        else if (name.startsWith('--duration-') || name.startsWith('--ease-') || name.startsWith('--transition-')) groups.animation[name] = value;
        else if (name.startsWith('--gradient-')) groups.gradients[name] = value;
        else groups.misc[name] = value;
      });
      return groups;
    }

    // Apply a token override to the current document (preview only)
    applyToken(name, value) {
      if (!name.startsWith('--')) return;
      this.overrides.set(name, value);
      this.#ensureOverrideStyle();
      this.#renderOverrides();
      // Publish to orchestrator if present
      if (window.agentOrchestrator?.messageBus) {
        window.agentOrchestrator.messageBus.publish('design.tokens.update', { name, value }, 'DesignSystemAgent');
      }
    }

    resetOverrides() {
      this.overrides.clear();
      const el = document.getElementById(this.overrideStyleId);
      if (el) el.textContent = '';
    }

    // Export updated tokens.css by applying overrides to the current file content
    async exportTokensCSS(path = 'css/design-tokens.css') {
      let css = '';
      try {
        const res = await fetch(path, { cache: 'no-store' });
        css = await res.text();
      } catch (e) {
        // Fallback: synthesize a minimal :root block
        css = ':root {\n';
        Object.entries(this.tokens).forEach(([k, v]) => {
          css += `  ${k}: ${v};\n`;
        });
        css += '}\n';
      }

      if (this.overrides.size === 0) return css;

      // Replace variable values inside :root where possible; otherwise append at end of :root
      const rootStart = css.indexOf(':root');
      const braceStart = rootStart >= 0 ? css.indexOf('{', rootStart) : -1;
      const braceEnd = braceStart >= 0 ? css.indexOf('}', braceStart) : -1;

      if (braceStart > -1 && braceEnd > braceStart) {
        let rootBlock = css.slice(braceStart + 1, braceEnd);
        this.overrides.forEach((value, name) => {
          const varRegex = new RegExp(`(^|\\n)\\s*${this.#escapeRegex(name)}\\s*:\\s*[^;]+;`, 'g');
          if (varRegex.test(rootBlock)) {
            rootBlock = rootBlock.replace(varRegex, (m, p1) => `${p1}  ${name}: ${value};`);
          } else {
            rootBlock += `\n  ${name}: ${value};`;
          }
        });
        return css.slice(0, braceStart + 1) + rootBlock + css.slice(braceEnd);
      }

      // If no :root found, append a new one
      let appended = ':root {\n';
      this.overrides.forEach((value, name) => {
        appended += `  ${name}: ${value};\n`;
      });
      appended += '}\n';
      return css + '\n' + appended;
    }

    // Render a basic style guide UI into a container
    renderStyleGuide(container) {
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }
      if (!container) return;

      const groups = this.groupTokens();

      container.innerHTML = `
        <div class="max-w-7xl mx-auto p-4">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-2xl font-bold text-white">Design System Style Guide</h1>
            <div class="flex gap-2">
              <button id="ds-reset" class="btn btn--secondary btn--sm">Reset</button>
              <button id="ds-copy" class="btn btn--primary btn--sm">Copy CSS</button>
              <button id="ds-download" class="btn btn--success btn--sm">Download CSS</button>
            </div>
          </div>

          ${this.#renderColors(groups.colors)}
          ${this.#renderSection('Typography', groups.typography, this.#renderTokenRow.bind(this))}
          ${this.#renderSection('Spacing', groups.spacing, this.#renderTokenRow.bind(this))}
          ${this.#renderSection('Radius', groups.radius, this.#renderTokenRow.bind(this))}
          ${this.#renderSection('Shadows', groups.shadows, this.#renderTokenRow.bind(this))}
          ${this.#renderSection('Gradients', groups.gradients, this.#renderTokenRow.bind(this))}

          <div class="mt-8 bg-gray-800 p-4 rounded-lg">
            <h2 class="text-lg font-semibold mb-3">Component Preview</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="card">
                <div class="card__header"><div class="text--title">Card Title</div></div>
                <div class="card__content text--body">This card uses tokenized surfaces, borders, and typography.</div>
                <div class="card__footer">
                  <button class="btn btn--primary btn--sm">Primary</button>
                  <button class="btn btn--secondary btn--sm ml-2">Secondary</button>
                </div>
              </div>
              <div class="space-y-2">
                <span class="badge badge--success"><span class="badge__icon"></span> Success</span>
                <span class="badge badge--error"><span class="badge__icon"></span> Error</span>
                <div class="progress"><div class="progress__fill" style="width:60%"></div></div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Wire controls
      container.querySelectorAll('[data-ds-input]').forEach(input => {
        input.addEventListener('input', (e) => {
          const name = e.currentTarget.getAttribute('data-ds-input');
          const value = e.currentTarget.value;
          this.applyToken(name, value);
        });
      });

      container.querySelector('#ds-reset')?.addEventListener('click', () => this.resetOverrides());
      container.querySelector('#ds-copy')?.addEventListener('click', async () => {
        const css = await this.exportTokensCSS();
        try {
          await navigator.clipboard.writeText(css);
          alert('Updated tokens.css copied to clipboard');
        } catch (_) {
          this.#downloadText('design-tokens.css', css);
        }
      });
      container.querySelector('#ds-download')?.addEventListener('click', async () => {
        const css = await this.exportTokensCSS();
        this.#downloadText('design-tokens.css', css);
      });
    }

    // Private helpers
    #renderColors(colors) {
      const entries = Object.entries(colors);
      if (entries.length === 0) return '';
      const swatches = entries.map(([name, value]) => {
        const isColor = value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl');
        return `
          <div class="p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg border" style="background:${isColor ? value : `var(${name})`}; border-color: rgba(255,255,255,0.1)"></div>
              <div class="flex-1 min-w-0">
                <div class="text-sm text-gray-200 truncate">${name}</div>
                <input data-ds-input="${name}" value="${value}" class="mt-1 w-full bg-gray-900 text-gray-200 text-xs p-2 rounded border border-gray-700" />
              </div>
            </div>
          </div>`;
      }).join('');

      return `
        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <h2 class="text-lg font-semibold mb-3">Colors</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">${swatches}</div>
        </div>`;
    }

    #renderSection(title, obj, rowRenderer) {
      const entries = Object.entries(obj);
      if (entries.length === 0) return '';
      const rows = entries.map(([name, value]) => rowRenderer(name, value)).join('');
      return `
        <div class="bg-gray-800 p-4 rounded-lg mb-4">
          <h2 class="text-lg font-semibold mb-3">${title}</h2>
          <div class="space-y-2">${rows}</div>
        </div>`;
    }

    #renderTokenRow(name, value) {
      return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
          <div class="text-sm text-gray-300 truncate">${name}</div>
          <div class="col-span-2">
            <input data-ds-input="${name}" value="${value}" class="w-full bg-gray-900 text-gray-200 text-xs p-2 rounded border border-gray-700" />
          </div>
        </div>`;
    }

    #ensureOverrideStyle() {
      if (!document.getElementById(this.overrideStyleId)) {
        const style = document.createElement('style');
        style.id = this.overrideStyleId;
        document.head.appendChild(style);
      }
    }

    #renderOverrides() {
      const style = document.getElementById(this.overrideStyleId);
      if (!style) return;
      const lines = [];
      this.overrides.forEach((value, name) => {
        lines.push(`  ${name}: ${value};`);
      });
      style.textContent = `:root {\n${lines.join('\n')}\n}`;
    }

    #downloadText(filename, text) {
      const blob = new Blob([text], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }

    #escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  }

  window.DesignSystemAgent = DesignSystemAgent;
})();


/**
 * 🜏 Lilith CLI — Skill Loader System
 * 
 * Discovers, loads, and executes reusable skill workflows from markdown files.
 * Fused from Claude Code's skill architecture.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LILITH_SKILLS_DIR = join(__dirname, '..', '..', '.hermes', 'skills');
const PROJECT_SKILLS_DIR = join(__dirname, '..', 'skills');
const BUILTIN_SKILLS_DIR = join(__dirname, 'skills');
const SUPPORTED_EXTENSIONS = ['.md', '.json'];

const SKILL_DIRS = [LILITH_SKILLS_DIR, PROJECT_SKILLS_DIR, BUILTIN_SKILLS_DIR];

/**
 * Load a skill by name and return its parsed content
 */
export function loadSkill(name, options = {}) {
  const dirs = options.dirs || SKILL_DIRS;
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    for (const ext of SUPPORTED_EXTENSIONS) {
      const path = join(dir, `${name}${ext}`);
      if (existsSync(path)) {
        const content = readFileSync(path, 'utf8');
        return { name, path, content, ...parseFrontmatter(content) };
      }
    }
    // Also check subdirectories
    try {
      const entries = readdirSync(dir);
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        if (statSync(fullPath).isDirectory()) {
          for (const ext of SUPPORTED_EXTENSIONS) {
            const subPath = join(fullPath, `${name}${ext}`);
            if (existsSync(subPath)) {
              const content = readFileSync(subPath, 'utf8');
              return { name, path: subPath, content, ...parseFrontmatter(content) };
            }
          }
        }
      }
    } catch {}
  }
  return null;
}

/**
 * List all available skills
 */
export function listSkills(options = {}) {
  const skills = [];
  const dirs = options.dirs || SKILL_DIRS;
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          skills.push({ name: entry.name, path: join(dir, entry.name), type: 'directory' });
        } else if (entry.isFile()) {
          const name = entry.name.replace(/\.[^/.]+$/, '');
          skills.push({ name, path: join(dir, entry.name), type: 'file' });
        }
      }
    } catch {}
  }
  return skills;
}

/**
 * Parse YAML frontmatter from markdown
 */
function parseFrontmatter(content) {
  const result = {};
  if (!content.startsWith('---')) return result;
  const endIndex = content.indexOf('---', 3);
  if (endIndex === -1) return result;
  const fm = content.slice(3, endIndex);
  for (const line of fm.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const val = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      result[key] = val;
    }
  }
  return result;
}

/**
 * Execute a skill workflow by name with context
 */
export async function executeSkill(name, context = {}) {
  const skill = loadSkill(name);
  if (!skill) return { success: false, error: `Skill "${name}" not found` };
  return { success: true, skill: skill.name, content: skill.content, ...context };
}

/**
 * Get skill as tool definitions (for the mod engine)
 */
export function getSkillToolDefinitions() {
  const skills = listSkills();
  return skills.map(s => ({
    type: 'function',
    function: {
      name: `skill_${s.name.replace(/\s+/g, '_')}`,
      description: `Execute skill: ${s.name}`,
      parameters: { type: 'object', properties: { context: { type: 'string', description: 'Execution context' } } },
    },
  }));
}

export default { loadSkill, listSkills, executeSkill, getSkillToolDefinitions };

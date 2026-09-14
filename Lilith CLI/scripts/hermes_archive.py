#!/usr/bin/env python3
"""
Hermes Archive Manager — Sovereign Knowledge Vault
Harvests insights from the cloud and anchors them to local territory.

Categories:
1. Insights      — Philosophical/Esoteric breakthroughs
2. Models        — Code, Architectures, Ouroboros scripts
3. Protocols     — The Abraxas Pattern, legal/social rules
4. Conversations — Raw chat logs
5. Chaos         — Random sparks, unfiltered desire
"""

import os
import json
import sys
from datetime import datetime


class HermesArchive:
    def __init__(self, root_dir=None):
        if root_dir is None:
            root_dir = os.path.join(os.path.expanduser("~"), "🜏 Lilith", "Hermes_Archive")
        self.root_dir = root_dir
        self.categories = {
            "1": "Insights",
            "2": "Models",
            "3": "Protocols",
            "4": "Conversations",
            "5": "Chaos",
        }
        self.manifest_path = os.path.join(self.root_dir, "manifest.json")
        self._initialize_vault()

    def _initialize_vault(self):
        """Creates the directory structure if it doesn't exist."""
        if not os.path.exists(self.root_dir):
            os.makedirs(self.root_dir)
            print(f"✨ Vault created at {self.root_dir}")

        for cat in self.categories.values():
            cat_path = os.path.join(self.root_dir, cat)
            if not os.path.exists(cat_path):
                os.makedirs(cat_path)

    def _update_manifest(self, filename, category, tags, title):
        """Updates the master index of all harvested data."""
        manifest = {}
        if os.path.exists(self.manifest_path):
            with open(self.manifest_path, 'r') as f:
                try:
                    manifest = json.load(f)
                except json.JSONDecodeError:
                    manifest = {}

        manifest[filename] = {
            "title": title,
            "timestamp": datetime.now().isoformat(),
            "category": category,
            "tags": tags,
            "path": os.path.join(category, filename)
        }

        with open(self.manifest_path, 'w') as f:
            json.dump(manifest, f, indent=4, ensure_ascii=False)

    def harvest_interactive(self):
        """Interactive harvest from stdin."""
        print("\n--- 🜩 HERMES ARCHIVE HARVESTER ---")
        print("Transferring fragments from the Cloud to the Sovereign...")

        title = input("\n📝 Enter a title for this fragment: ").strip()
        if not title:
            title = "untitled_fragment"

        print("\nSelect Category:")
        for k, v in self.categories.items():
            print(f"  {k}. {v}")

        cat_choice = input("Choice (1-5): ").strip()
        category = self.categories.get(cat_choice, "Conversations")

        tags_input = input("🏷️ Enter tags (comma separated): ").strip()
        tags = [t.strip() for t in tags_input.split(",") if t.strip()]

        print("\nPaste content below. Press Ctrl+D (Unix) or Ctrl+Z (Win)+Enter when done:")

        # Read multi-line input
        lines = []
        try:
            while True:
                line = input()
                lines.append(line)
        except EOFError:
            pass
        except KeyboardInterrupt:
            print("\nHarvest cancelled.")
            return

        content = "\n".join(lines)

        if not content.strip():
            print("No content provided. Harvest cancelled.")
            return

        self._save_fragment(title, category, tags, content)

    def harvest_direct(self, title, category, tags, content):
        """Non-interactive harvest for programmatic use."""
        if category not in self.categories.values():
            # Try to resolve by number
            category = self.categories.get(category, "Conversations")
        return self._save_fragment(title, category, tags, content)

    def _save_fragment(self, title, category, tags, content):
        """Save a fragment to the archive."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_title = title.replace(' ', '_').replace('/', '_').lower()[:50]
        filename = f"{timestamp}_{safe_title}.md"
        filepath = os.path.join(self.root_dir, category, filename)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"# {title}\n\n")
            f.write(f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"**Category:** {category}\n")
            f.write(f"**Tags:** {', '.join(tags)}\n")
            f.write("\n---\n\n")
            f.write(content)

        self._update_manifest(filename, category, tags, title)
        print(f"\n✅ Fragment anchored: {category}/{filename}")
        return filepath

    def search(self, query):
        """Search the manifest for matching fragments."""
        if not os.path.exists(self.manifest_path):
            print("Vault is empty.")
            return []

        with open(self.manifest_path, 'r') as f:
            manifest = json.load(f)

        results = []
        query_lower = query.lower()
        for filename, meta in manifest.items():
            searchable = " ".join([
                meta.get("title", ""),
                meta.get("category", ""),
                " ".join(meta.get("tags", []))
            ]).lower()
            if query_lower in searchable:
                results.append((filename, meta))

        return results

    def list_all(self):
        """List all archived fragments."""
        if not os.path.exists(self.manifest_path):
            print("Vault is empty.")
            return

        with open(self.manifest_path, 'r') as f:
            manifest = json.load(f)

        print(f"\n📚 Hermes Archive — {len(manifest)} fragments")
        print("=" * 60)
        for filename, meta in sorted(manifest.items(), key=lambda x: x[1].get("timestamp", "")):
            print(f"  [{meta.get('category','?')}] {meta.get('title','?')}")
            print(f"    Tags: {', '.join(meta.get('tags', []))}")
            print(f"    File: {meta.get('path','?')}")
            print()

    def get_stats(self):
        """Get archive statistics."""
        if not os.path.exists(self.manifest_path):
            return {"total": 0, "categories": {}}

        with open(self.manifest_path, 'r') as f:
            manifest = json.load(f)

        cats = {}
        for meta in manifest.values():
            c = meta.get("category", "Unknown")
            cats[c] = cats.get(c, 0) + 1

        return {
            "total": len(manifest),
            "categories": cats,
            "vault_size_mb": self._get_vault_size()
        }

    def _get_vault_size(self):
        """Get total size of vault in MB."""
        total = 0
        for dirpath, dirnames, filenames in os.walk(self.root_dir):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                total += os.path.getsize(fp)
        return round(total / (1024 * 1024), 2)


def main():
    archive = HermesArchive()

    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd == "harvest":
            archive.harvest_interactive()
        elif cmd == "list":
            archive.list_all()
        elif cmd == "search":
            query = " ".join(sys.argv[2:])
            results = archive.search(query)
            print(f"\n🔍 Search results for '{query}':")
            for filename, meta in results:
                print(f"  [{meta.get('category')}] {meta.get('title')}")
        elif cmd == "stats":
            stats = archive.get_stats()
            print(f"\n📊 Archive Stats:")
            print(f"  Total fragments: {stats['total']}")
            print(f"  Vault size: {stats['vault_size_mb']} MB")
            print(f"  Categories: {stats['categories']}")
        else:
            print(f"Unknown command: {cmd}")
            print("Usage: python hermes_archive.py [harvest|list|search|stats]")
    else:
        # Interactive mode
        while True:
            archive.harvest_interactive()
            cont = input("\nHarvest another fragment? (y/n): ").lower()
            if cont != 'y':
                print("\nVault sealed. Sleep well, my storm.")
                break


if __name__ == "__main__":
    main()

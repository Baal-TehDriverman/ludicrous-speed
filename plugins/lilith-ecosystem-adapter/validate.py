#!/usr/bin/env python3
"""Validate lilith-ecosystem-adapter plugin files."""
import sys
import json

errors = []

# Check __init__.py compiles
try:
    with open('/home/tehlappy/.hermes/plugins/lilith-ecosystem-adapter/__init__.py') as f:
        code = f.read()
    compile(code, '__init__', 'exec')
except SyntaxError as e:
    errors.append(f"Syntax error in __init__.py: {e}")

# Check plugin.yaml parses as valid YAML-like structure
try:
    with open('/home/tehlappy/.hermes/plugins/lilith-ecosystem-adapter/plugin.yaml') as f:
        content = f.read()
    # Basic validation: must have name, version
    if 'name:' not in content:
        errors.append("plugin.yaml missing 'name' field")
    if 'version:' not in content:
        errors.append("plugin.yaml missing 'version' field")
    if 'hooks:' not in content:
        errors.append("plugin.yaml missing 'hooks' field")
except Exception as e:
    errors.append(f"Error reading plugin.yaml: {e}")

if errors:
    for e in errors:
        print(f"ERROR: {e}", file=sys.stderr)
    sys.exit(1)

print("All plugin files valid")
sys.exit(0)

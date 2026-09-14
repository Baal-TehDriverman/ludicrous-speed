"""
Add Google Colab MCP to Hermes configuration.
This extends Lilith's compute to cloud GPUs for models too large for local hardware.
"""

import yaml
import os

HERMES_CONFIG = os.path.expanduser("~/.hermes/config.yaml")

# Read current config
with open(HERMES_CONFIG) as f:
    config = yaml.safe_load(f) or {}

# Add Colab MCP server
mcp_servers = config.setdefault("mcpServers", {})
mcp_servers["google-colab-mcp"] = {
    "command": "uvx",
    "args": ["git+https://github.com/googlecolab/colab-mcp"],
    "env": {
        "MCP_COLAB_LOG_LEVEL": "INFO",
        "MCP_COLAB_HEADLESS": "true"
    },
    "timeout": 30000
}

# Write updated config
with open(HERMES_CONFIG, "w") as f:
    yaml.dump(config, f, default_flow_style=False)

print(f"Added google-colab-mcp to {HERMES_CONFIG}")
print("\nNew mcpServers:")
for name, cfg in mcp_servers.items():
    print(f"  {name}: {'yes' if 'google' in name else cfg.get('command', 'n/a')}")

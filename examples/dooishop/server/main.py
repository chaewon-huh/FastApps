from pathlib import Path
import sys
import importlib
import inspect
import argparse
import re
from typing import Dict

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import FastApps framework
from fastapps import WidgetBuilder, WidgetMCPServer, BaseWidget, WidgetBuildResult
import uvicorn

PROJECT_ROOT = Path(__file__).parent.parent
TOOLS_DIR = Path(__file__).parent / "tools"
ASSETS_DIR = PROJECT_ROOT / "assets"

def fetch_build_results() -> Dict[str, WidgetBuildResult]:
    """Parse built widget HTML files from assets directory."""
    results = {}
    for html_file in ASSETS_DIR.glob("*-*.html"):
        match = re.match(r"(.+)-([0-9a-f]{4})\.html$", html_file.name)
        if match:
            name, hash_val = match.groups()
            results[name] = WidgetBuildResult(
                name=name, hash=hash_val, html=html_file.read_text()
            )
    return results

def auto_load_tools(build_results):
    """Automatically discover and load all widget tools."""
    tools = []
    for tool_file in TOOLS_DIR.glob("*_tool.py"):
        module_name = tool_file.stem
        try:
            module = importlib.import_module(f"server.tools.{module_name}")
            for name, obj in inspect.getmembers(module, inspect.isclass):
                if issubclass(obj, BaseWidget) and obj is not BaseWidget:
                    tool_identifier = obj.identifier
                    if tool_identifier in build_results:
                        tool_instance = obj(build_results[tool_identifier])
                        tools.append(tool_instance)
                        print(f"[OK] Loaded tool: {name} (identifier: {tool_identifier})")
                    else:
                        print(f"[WARNING] Warning: No build result found for tool '{tool_identifier}'")
        except Exception as e:
            print(f"[ERROR] Error loading {tool_file.name}: {e}")
    return tools

# Parse command-line arguments
parser = argparse.ArgumentParser(description="FastApps MCP Server")
parser.add_argument(
    "--build",
    action="store_true",
    help="Build widgets on startup (for development)"
)
parser.add_argument(
    "--mode",
    choices=["inline", "hosted"],
    default="hosted",
    help="Widget build mode: hosted (default) or inline"
)
args = parser.parse_args()

# Load build results
if args.build:
    # Build widgets on startup
    print(f"[INFO] Building widgets (mode: {args.mode})")
    builder = WidgetBuilder(PROJECT_ROOT)
    build_results = builder.build_all(mode=args.mode)
else:
    # Load pre-built widgets from assets directory
    print(f"[INFO] Loading pre-built widgets from assets")
    build_results = fetch_build_results()

# Auto-load and register tools
tools = auto_load_tools(build_results)

# Load CSP configuration from fastapps.json
def load_csp_config():
    """Load CSP configuration from fastapps.json if exists."""
    config_file = PROJECT_ROOT / "fastapps.json"
    if config_file.exists():
        try:
            import json
            with open(config_file, "r") as f:
                config = json.load(f)
                return config.get("csp", {})
        except Exception as e:
            print(f"[WARNING] Could not load CSP config: {e}")
    return {}

csp_config = load_csp_config()

# Create MCP server with CSP configuration
server = WidgetMCPServer(
    name="my-widgets",
    widgets=tools,
    global_resource_domains=csp_config.get("resource_domains", []),
    global_connect_domains=csp_config.get("connect_domains", []),
)

# Optional: Enable OAuth 2.1 authentication
# Uncomment and configure to protect your widgets with OAuth:
#
# server = WidgetMCPServer(
#     name="my-widgets",
#     widgets=tools,
#     auth_issuer_url="https://your-tenant.us.auth0.com",
#     auth_resource_server_url="https://yourdomain.com/mcp",
#     auth_required_scopes=["user"],
# )
#
# See docs: https://fastapps.org/docs/auth

app = server.get_app()

if __name__ == "__main__":
    print(f"\n[START] Starting server with {len(tools)} tools")
    uvicorn.run(app, host="0.0.0.0", port=8001)

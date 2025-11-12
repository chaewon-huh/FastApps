# dooishop

ChatGPT widgets built with [FastApps](https://pypi.org/project/fastapps/).

## Quick Start

Your project includes an example widget (`my_widget`) to get you started!

```bash
# Install dependencies
uv sync

# Start development server
uv run fastapps dev
```

This will build your widgets and start the development server.

## Creating More Widgets

```bash
uv run fastapps create another_widget
uv run fastapps dev
```

## Project Structure

```
dooishop/
├── server/
│   ├── main.py              # Server (auto-discovery)
│   └── tools/               # Widget backends
│       └── my_widget_tool.py   # Example widget
│
├── widgets/                 # Widget frontends
│   └── my_widget/
│       └── index.jsx        # Example React component
│
├── assets/                  # Built widgets (auto-generated)
├── pyproject.toml          # Python dependencies
├── uv.lock                 # Dependency lock file
└── package.json
```

## Dependency Management

This project uses `uv` for Python dependency management:

- `uv sync` - Install dependencies from pyproject.toml and uv.lock
- `uv add <package>` - Add a new dependency
- `uv add --dev <package>` - Add a development dependency
- `uv run <command>` - Run commands in the project environment
## Content Security Policy (CSP)

Your project includes a default CSP configuration in `fastapps.json` that allows loading images from a safe public CDN. You can manage CSP domains using the CLI:

```bash
# Add external resource domains (images, fonts, styles)
fastapps csp add --url https://your-cdn.com --type resource

# Add API domains (fetch, XHR)
fastapps csp add --url https://api.example.com --type connect

# List all configured domains
fastapps csp list

# Remove a domain
fastapps csp remove --url https://example.com --type resource
```

The default domain (`https://pub-d9760dbd87764044a85486be2fdf7f9f.r2.dev`) is a safe public CDN used by example widgets. You can remove it if not needed.

## Learn More

- **FastApps Framework**: https://pypi.org/project/fastapps/
- **FastApps (React)**: https://www.npmjs.com/package/fastapps
- **uv Package Manager**: https://github.com/astral-sh/uv
- **Documentation**: https://github.com/fastapps-framework/fastapps

## License

MIT

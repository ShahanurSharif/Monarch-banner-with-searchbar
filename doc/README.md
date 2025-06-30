# Monarch Banner with Search Web Part

A modern SharePoint Framework (SPFx) web part that provides a professional banner with integrated search functionality.

## Overview

The Monarch Banner with Search web part delivers a clean, customizable banner with powerful search capabilities for SharePoint sites. It features a large, prominent heading display and seamless document search with categorized results.

## Features

### Banner Features
- **Large, Bold Heading** - 48px font with customizable text (default: "Hello Monarch")
- **Solid Background Colors** - Hex color support with validation
- **Adjustable Height** - Slider control (150-350px)
- **Professional Styling** - Text shadows and modern typography
- **Responsive Design** - Mobile-first approach with breakpoints

### Search Features
- **Integrated Search Box** - Clean, modern search interface
- **Mock Document Results** - Displays sample documents for demonstration
- **Document Cards** - Professional card layout with metadata
- **Folder Filtering** - Pivot tabs for categorizing results
- **File Type Icons** - Visual indicators for different document types

### Configuration
- **Property Pane Settings** - Easy customization through SharePoint interface
- **Real-time Updates** - Changes apply immediately
- **Color Validation** - Ensures valid hex color inputs
- **Default Values** - Sensible defaults for quick setup

## Quick Start

### Installation
1. Upload `monarch-banner-searchbar.sppkg` to your SharePoint App Catalog
2. Deploy the solution
3. Add the web part to any SharePoint page

### Basic Usage
1. Add the "Monarch Banner Search" web part to your page
2. Configure the banner text and colors in the property pane
3. Adjust height and search settings as needed
4. Publish your page

## Project Structure

```
Monarch-banner-with-searchbar/
├── doc/                     # Documentation
├── sharepoint/solution/     # Deployment packages
├── src/webparts/           # Source code
│   └── monarchBannerSearch/
│       ├── components/     # React components
│       └── assets/        # Static assets
├── config/                 # SPFx configuration
└── package.json           # Dependencies
```

## Technical Specifications

- **Framework**: SharePoint Framework (SPFx) 1.19.0
- **React Version**: 17.0.1
- **TypeScript**: 5.3.3
- **Build Tools**: Gulp, Webpack
- **UI Components**: Fluent UI React
- **Styling**: SCSS Modules

## Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [Configuration Guide](./CONFIGURATION.md)
- [Development Guide](./DEVELOPMENT.md)

## Version

**Current Version**: 1.0.0
**Build Target**: Production (SHIP)
**Package Size**: 301KB

## Support

For issues, questions, or feature requests, please refer to the documentation or contact your SharePoint administrator.

---

*Built with SharePoint Framework and React for modern SharePoint experiences.* 
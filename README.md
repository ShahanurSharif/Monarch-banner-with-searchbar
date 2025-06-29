# Monarch Banner with Search Bar - SPFx Web Part

A modern, responsive SharePoint Framework (SPFx) web part that provides a beautiful banner with integrated search functionality, inspired by the Origami Search Banner.

![Banner Preview](./assets/banner-preview.png)

## Features

### 🎨 **Beautiful Banner Design**
- Customizable gradient or solid color backgrounds
- Adjustable banner height (200px - 500px)
- Animated decorative elements
- Responsive design for all devices
- Modern glassmorphism search box with blur effects

### 🔍 **Advanced Search Functionality**
- Real-time document search
- Search by document title, content, or author
- Filter results by folders/categories
- Document type icons (PDF, Word, Excel, PowerPoint)
- Rich document cards with metadata
- Loading states and error handling

### ⚙️ **Configurable Properties**
- **Banner Heading**: Customize the welcome message
- **Search Placeholder**: Set custom placeholder text
- **Banner Height**: Adjust banner height with slider
- **Background Styling**: Choose between gradient or solid colors
- **Source Libraries**: Configure SharePoint document libraries
- **Folder Display**: Toggle folder groupings

### 📱 **Responsive & Accessible**
- Mobile-first responsive design
- Accessibility compliant
- Touch-friendly interface
- Keyboard navigation support

## Installation & Setup

### Prerequisites
- Node.js (v16.13.0 - v18.x)
- SharePoint Framework development environment
- SharePoint Online or SharePoint 2019+

### Quick Start

1. **Clone and Install**
   ```bash
   cd Monarch-banner-with-searchbar
   npm install
   ```

2. **Build and Test Locally**
   ```bash
   gulp serve --nobrowser
   ```
   Navigate to: `https://localhost:4321/temp/workbench.html`

3. **Package for Deployment**
   ```bash
   gulp bundle --ship
   gulp package-solution --ship
   ```

4. **Deploy to SharePoint**
   - Upload the `.sppkg` file from `sharepoint/solution/` to your App Catalog
   - Approve and deploy the solution
   - Add the web part to any SharePoint page

## Configuration

### Property Pane Settings

#### Banner Settings
- **Banner Heading**: Main title displayed in the banner (default: "Welcome, Andrew!")
- **Search Box Placeholder**: Placeholder text for search input
- **Banner Height**: Height in pixels (200-500px, default: 300px)

#### Styling Options
- **Use Gradient Background**: Toggle between gradient and solid color
- **Background Color**: Hex color for solid backgrounds (default: #8B5CF6)
- **Background Gradient**: CSS gradient string (default: purple to orange)

#### Search Configuration
- **Source Libraries**: SharePoint document library URLs (one per line)
- **Show Folders**: Toggle folder categorization display

### Example Library URLs
```
https://contoso.sharepoint.com/sites/intranet/Shared%20Documents
https://contoso.sharepoint.com/sites/hr/Documents
https://contoso.sharepoint.com/sites/finance/Reports
```

## Customization

### Styling
The web part uses CSS modules for styling. Key files:
- `MonarchBannerSearch.module.scss` - Main styles
- Customizable CSS variables for colors and spacing
- Responsive breakpoints for mobile/tablet

### Search Integration
Currently uses mock data for demonstration. To integrate with real SharePoint search:

1. **Install PnP JS**
   ```bash
   npm install @pnp/sp @pnp/graph
   ```

2. **Update the search function** in `MonarchBannerSearch.tsx`:
   ```typescript
   import { sp } from "@pnp/sp/presets/all";
   
   const searchDocuments = async (query: string) => {
     const results = await sp.search({
       Querytext: query,
       SelectProperties: ["Title", "Path", "Author", "LastModifiedTime"],
       RowLimit: 50
     });
     // Process results...
   };
   ```

### Adding Custom Features
- **File Type Filters**: Extend the search to filter by document types
- **Advanced Metadata**: Display additional document properties
- **Integration**: Connect with Microsoft Graph for broader search scope
- **Analytics**: Add usage tracking and search analytics

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)  
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ IE 11 (with polyfills)

## Development

### Project Structure
```
src/
├── webparts/
│   └── monarchBannerSearch/
│       ├── components/
│       │   ├── MonarchBannerSearch.tsx      # Main component
│       │   ├── MonarchBannerSearch.module.scss
│       │   └── IMonarchBannerSearchProps.ts
│       └── MonarchBannerSearchWebPart.ts    # Web part class
```

### Build Commands
```bash
npm run build          # Build for development
npm run serve          # Start dev server
npm run package        # Package for production
npm run clean          # Clean build artifacts
```

### Debugging
1. Start the development server: `gulp serve`
2. Open SharePoint Workbench
3. Add the web part to test functionality
4. Use browser dev tools for debugging

## Deployment Options

### SharePoint App Catalog
1. Build production package: `gulp bundle --ship && gulp package-solution --ship`
2. Upload `.sppkg` to tenant App Catalog
3. Deploy to all sites or specific site collections

### Site Collection App Catalog  
1. Enable site collection app catalog
2. Upload and deploy the package
3. Available only within that site collection

### Teams Integration
The web part is automatically Teams-compatible and can be:
- Added to Teams tabs
- Used in Teams channels
- Integrated with Teams apps

## Performance Optimization

- **Lazy Loading**: Search results load on-demand
- **Caching**: Implement result caching for better performance
- **CDN**: Bundle assets are CDN-ready
- **Bundle Size**: Optimized bundle with tree-shaking

## Security & Permissions

- Inherits SharePoint security context
- Users see only documents they have access to
- No additional permissions required
- Supports SharePoint Online and on-premises

## Troubleshooting

### Common Issues

**Build Errors**
- Ensure Node.js version compatibility (16.13.0 - 18.x)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Search Not Working**
- Verify source library URLs are correct
- Check user permissions on document libraries
- Review browser console for API errors

**Styling Issues**
- Clear browser cache
- Check CSS conflicts with SharePoint themes
- Verify SCSS compilation

### Support
For issues and questions:
- Check SharePoint Framework documentation
- Review SPFx GitHub issues
- SharePoint developer community forums

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the Origami Search Banner
- Built with SharePoint Framework
- Uses Fluent UI React components
- Modern design patterns and best practices

---

**Version**: 1.0.0  
**SPFx Version**: 1.18.2  
**Node Version**: v16.13.0+

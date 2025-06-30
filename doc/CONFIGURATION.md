# Configuration Guide

Comprehensive guide for configuring the Monarch Banner with Search web part through the SharePoint property pane.

## Property Pane Overview

The property pane provides three main configuration sections:
1. **Banner Settings** - Text, placeholder, and height controls
2. **Background Settings** - Color customization
3. **Search Configuration** - Search behavior and folder settings

## Banner Settings

### Banner Heading
**Type**: Text Field  
**Default**: "Hello Monarch"  
**Description**: The main heading text displayed prominently in the banner

#### Configuration
- **Field**: Text input
- **Max Length**: 100 characters (recommended)
- **Examples**: 
  - "Welcome to Monarch"
  - "Digital Knowledge Hub"
  - "Company Portal"
  - "Hello [Department Name]"

#### Best Practices
- Keep text concise (1-4 words optimal)
- Use title case for professional appearance
- Consider your organization's branding
- Test readability on different screen sizes

### Search Box Placeholder
**Type**: Text Field  
**Default**: "Search for documents..."  
**Description**: Placeholder text shown in the search input field

#### Configuration
- **Field**: Text input
- **Max Length**: 80 characters (recommended)
- **Examples**:
  - "Search documents, templates, or folders..."
  - "Find files and resources..."
  - "What are you looking for?"
  - "Search knowledge base..."

#### Best Practices
- Use actionable language ("Search for...", "Find...")
- Specify what users can search for
- Keep it helpful but not too long
- Consider your content types

### Banner Height
**Type**: Slider Control  
**Range**: 150px - 350px  
**Default**: 180px  
**Step**: 10px  
**Description**: Controls the vertical height of the banner section

#### Configuration Options
- **Compact** (150-170px): Minimal space usage
- **Standard** (180-220px): Balanced appearance (recommended)
- **Large** (230-280px): Prominent display
- **Extra Large** (290-350px): Maximum impact

#### Responsive Behavior
- Automatically adjusts on mobile devices
- Maintains aspect ratios across screen sizes
- Text scaling adapts to height changes

## Background Settings

### Background Color
**Type**: Text Field with Validation  
**Format**: Hex Color Code  
**Default**: #8B5CF6 (Purple)  
**Description**: Solid background color for the banner

#### Valid Formats
- **6-digit hex**: #RRGGBB (e.g., #8B5CF6)
- **3-digit hex**: #RGB (e.g., #F0F)
- **Case insensitive**: #8b5cf6 or #8B5CF6

#### Color Validation
The field validates input and shows errors for:
- Missing # symbol
- Invalid characters (only 0-9, A-F allowed)
- Wrong length (must be 3 or 6 digits after #)

#### Recommended Colors

##### Corporate/Professional
- **Blue**: #0078D4 (Microsoft Blue)
- **Navy**: #323130 (Professional Dark)
- **Teal**: #20B2AA (Modern Teal)
- **Green**: #36B37E (Success Green)

##### Brand Colors
- **Purple**: #8B5CF6 (Default - Modern Purple)
- **Orange**: #F97316 (Vibrant Orange)
- **Red**: #DC2626 (Brand Red)
- **Pink**: #EC4899 (Creative Pink)

##### Neutral Options
- **Gray**: #6B7280 (Professional Gray)
- **Dark**: #1F2937 (High Contrast)
- **Slate**: #475569 (Sophisticated)
- **Stone**: #78716C (Natural)

#### Accessibility Considerations
- Ensure sufficient contrast with white text
- Test with screen readers
- Consider color-blind users
- WCAG AA compliance recommended (4.5:1 contrast ratio)

## Search Configuration

### Source Libraries
**Type**: Multi-line Text Field  
**Default**: Empty  
**Description**: SharePoint library URLs for search sources (currently for future implementation)

#### Format
```
https://yourtenant.sharepoint.com/sites/sitename/LibraryName
https://yourtenant.sharepoint.com/sites/sitename/Documents
```

#### Current Behavior
- Field available for future search integration
- Currently displays mock/demo data
- No functional impact on search results yet

### Show Folders
**Type**: Toggle Switch  
**Default**: Enabled  
**Description**: Controls whether folder filtering tabs are displayed in search results

#### Options
- **Show** (Default): Displays folder filter tabs (All, Documents, Templates, Folders)
- **Hide**: Shows only "All" results without categorization

#### Impact on User Experience
- **Show**: More organized, categorized results
- **Hide**: Simpler, streamlined interface

## Advanced Configuration

### Real-time Updates
All property pane changes apply immediately without requiring page refresh or republication.

### Configuration Persistence
Settings are saved automatically and persist across:
- Page reloads
- Browser sessions
- Site navigation
- SharePoint updates

### Default Restoration
To restore defaults:
1. Clear all text fields
2. Set banner height to 180px
3. Set background color to #8B5CF6
4. Enable "Show Folders"

## Configuration Scenarios

### Corporate Homepage
```
Banner Heading: "Welcome to Acme Corp"
Search Placeholder: "Search company resources..."
Banner Height: 220px
Background Color: #0078D4 (Corporate Blue)
Show Folders: Enabled
```

### Department Portal
```
Banner Heading: "IT Department"
Search Placeholder: "Find IT documentation..."
Banner Height: 180px
Background Color: #36B37E (IT Green)
Show Folders: Enabled
```

### Knowledge Base
```
Banner Heading: "Knowledge Center"
Search Placeholder: "Search articles and guides..."
Banner Height: 200px
Background Color: #8B5CF6 (Knowledge Purple)
Show Folders: Disabled
```

### Project Site
```
Banner Heading: "Project Alpha"
Search Placeholder: "Find project files..."
Banner Height: 160px
Background Color: #F97316 (Project Orange)
Show Folders: Enabled
```

## Troubleshooting Configuration

### Common Issues

#### Color Not Updating
- **Check**: Valid hex format (#RRGGBB)
- **Solution**: Clear field and re-enter color code

#### Text Too Long
- **Issue**: Banner heading overflows
- **Solution**: Reduce text length or increase banner height

#### Property Pane Not Opening
- **Cause**: Page not in edit mode
- **Solution**: Click "Edit" on page, then click web part edit icon

### Validation Messages

#### "Please enter a valid hex color"
- Format must be #RRGGBB or #RGB
- Only use characters 0-9 and A-F
- Include the # symbol

#### Field Length Limits
- Banner heading: 100 characters recommended
- Search placeholder: 80 characters recommended

## Mobile Considerations

### Responsive Behavior
- Banner height automatically scales down on mobile
- Text size adjusts for readability
- Search box remains fully functional
- Property pane is tablet/desktop only

### Mobile-Optimized Settings
- Use shorter banner text (2-3 words max)
- Standard height (180-200px) works best
- High-contrast colors recommended
- Test on actual mobile devices

## Design Best Practices

### Typography
- Banner text uses 48px font size
- Bold weight (700) for prominence
- Text shadow for depth and readability
- Letter spacing optimized for titles

### Color Theory
- Use brand colors for consistency
- Ensure accessibility compliance
- Consider emotional impact of colors
- Test in different lighting conditions

### Layout
- Banner serves as page focal point
- Search box integrates seamlessly
- Maintains professional appearance
- Responsive across all devices

---

*For additional configuration assistance, refer to the [Deployment Guide](./DEPLOYMENT.md) or contact your SharePoint administrator.* 
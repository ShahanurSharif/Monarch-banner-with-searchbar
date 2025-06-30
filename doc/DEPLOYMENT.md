# Deployment Guide

Complete guide for deploying the Monarch Banner with Search web part to SharePoint environments.

## Prerequisites

### System Requirements
- SharePoint Online or SharePoint Server 2019/2022
- SharePoint App Catalog configured
- Site Collection Administrator permissions
- Modern SharePoint pages support

### Permissions Required
- **App Catalog**: Site Collection Administrator
- **Target Sites**: Site Owner or higher
- **Deployment**: Tenant Administrator (for tenant-wide deployment)

## Deployment Package

**File**: `sharepoint/solution/monarch-banner-searchbar.sppkg`
**Size**: 301KB
**Type**: SharePoint Solution Package (.sppkg)

## Deployment Steps

### Step 1: Upload to App Catalog

1. **Navigate to App Catalog**
   ```
   https://yourtenant.sharepoint.com/sites/appcatalog
   ```

2. **Upload Package**
   - Go to "Apps for SharePoint" library
   - Click "Upload" → "Files"
   - Select `monarch-banner-searchbar.sppkg`
   - Click "OK"

3. **Deploy Solution**
   - Click "Deploy" when prompted
   - Check "Make this solution available to all sites in the organization" (optional)
   - Click "Deploy"

### Step 2: Add to Site Collection

#### Option A: Tenant-Wide Deployment
If deployed tenant-wide, the web part is automatically available on all sites.

#### Option B: Site-Specific Installation
1. Navigate to target site
2. Go to **Site Settings** → **Site App Permissions**
3. Click "Add an App"
4. Find "Monarch Banner Search" 
5. Click "Add"

### Step 3: Add Web Part to Page

1. **Edit Page**
   - Navigate to target page
   - Click "Edit" in the top right

2. **Insert Web Part**
   - Click "+" to add a new web part
   - Search for "Monarch Banner Search"
   - Click to add

3. **Configure Settings**
   - Click the edit icon (pencil) on the web part
   - Configure in the property pane (see [Configuration Guide](./CONFIGURATION.md))

4. **Publish Page**
   - Click "Publish" to make changes live

## Configuration Options

### Property Pane Settings

#### Banner Settings
- **Banner Heading**: Custom text (default: "Hello Monarch")
- **Search Box Placeholder**: Search prompt text
- **Banner Height**: Slider control (150-350px)

#### Background Settings
- **Background Color**: Hex color with validation

#### Search Configuration
- **Source Libraries**: SharePoint library URLs
- **Show Folders**: Toggle folder filtering

## Advanced Configuration

### Site Collection Features
No additional features need to be activated.

### Permissions
The web part operates with the permissions of the current user. No elevated permissions required.

### Browser Support
- Microsoft Edge (Chromium)
- Google Chrome
- Mozilla Firefox
- Safari (macOS)

## Troubleshooting

### Common Issues

#### Web Part Not Visible
- **Cause**: Solution not deployed
- **Solution**: Verify deployment in App Catalog

#### Property Pane Errors
- **Cause**: Invalid hex color format
- **Solution**: Use format #RRGGBB (e.g., #8B5CF6)

#### Search Not Working
- **Cause**: Currently displays mock data
- **Solution**: Expected behavior - search shows demo results

### Deployment Validation

#### Check 1: App Catalog
```
Site Contents → Apps for SharePoint → Verify "monarch-banner-searchbar"
```

#### Check 2: Site Apps
```
Site Settings → Site Contents → Verify "Monarch Banner Search"
```

#### Check 3: Web Part Gallery
```
Page Edit Mode → + → Search "Monarch" → Should appear
```

## Monitoring & Maintenance

### Update Deployment
1. Build new .sppkg file
2. Upload to App Catalog (overwrite existing)
3. Click "Replace" when prompted
4. Existing instances auto-update

### Removal Process
1. Remove web part from all pages
2. Delete from Site Contents
3. Remove from App Catalog

## Multi-Environment Deployment

### Development → Test → Production

#### Development
- Local workbench testing
- SharePoint workbench validation

#### Test Environment
- Deploy to test App Catalog
- User acceptance testing
- Configuration validation

#### Production
- Deploy to production App Catalog
- Gradual rollout to sites
- Monitor performance

## Deployment Checklist

- [ ] App Catalog permissions verified
- [ ] Solution package uploaded
- [ ] Deployment completed
- [ ] Web part available in gallery
- [ ] Test page created
- [ ] Configuration tested
- [ ] User training completed
- [ ] Documentation provided

## Support & Escalation

### Level 1: Site Owners
- Add/remove web part from pages
- Basic property pane configuration

### Level 2: Site Collection Administrators
- App installation/removal
- Site-level permissions

### Level 3: Tenant Administrators
- App Catalog management
- Tenant-wide deployment
- Solution updates

---

*For technical support, refer to your SharePoint administrator or IT help desk.* 
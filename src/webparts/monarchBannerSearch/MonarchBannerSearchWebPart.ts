import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'MonarchBannerSearchWebPartStrings';
import MonarchBannerSearch from './components/MonarchBannerSearch';
import { IMonarchBannerSearchProps } from './components/IMonarchBannerSearchProps';

export interface IMonarchBannerSearchWebPartProps {
  description: string;
  bannerHeading: string;
  searchboxPrompt: string;
  bannerHeight: number;
  backgroundColor: string;
  sourceLibraries: string[];
  showFolders: boolean;
}

export default class MonarchBannerSearchWebPart extends BaseClientSideWebPart<IMonarchBannerSearchWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IMonarchBannerSearchProps> = React.createElement(
      MonarchBannerSearch,
      {
        description: this.properties.description,
        bannerHeading: this.properties.bannerHeading || 'Hello Monarch',
        searchboxPrompt: this.properties.searchboxPrompt || 'Search for documents...',
        bannerHeight: this.properties.bannerHeight || 180,
        backgroundColor: this.properties.backgroundColor || '#8B5CF6',
        sourceLibraries: this.properties.sourceLibraries || [],
        showFolders: this.properties.showFolders !== false,
        context: this.context,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private _validateColor(value: string): string {
    if (!value) {
      return ''; // Empty is allowed, will use defaults
    }
    
    // Check for valid hex color format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(value)) {
      return 'Please enter a valid hex color (e.g., #8B5CF6 or #fff)';
    }
    
    return '';
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: 'Banner Settings',
              groupFields: [
                PropertyPaneTextField('bannerHeading', {
                  label: 'Banner Heading',
                  description: 'The welcome message displayed in the banner'
                }),
                PropertyPaneTextField('searchboxPrompt', {
                  label: 'Search Box Placeholder',
                  description: 'Placeholder text for the search box'
                }),
                PropertyPaneSlider('bannerHeight', {
                  label: 'Banner Height (px)',
                  min: 150,
                  max: 350,
                  step: 10,
                  showValue: true
                })
              ]
            },
            {
              groupName: 'Background Settings',
              groupFields: [
                PropertyPaneTextField('backgroundColor', {
                  label: 'Background Color',
                  description: 'Enter hex color (e.g., #8B5CF6, #0078D4, #36B37E)',
                  placeholder: '#8B5CF6',
                  onGetErrorMessage: this._validateColor.bind(this)
                })
              ]
            },
            {
              groupName: 'Search Configuration',
              groupFields: [
                PropertyPaneTextField('sourceLibraries', {
                  label: 'Source Libraries',
                  description: 'Enter SharePoint library URLs (one per line)',
                  multiline: true,
                  rows: 4
                }),
                PropertyPaneToggle('showFolders', {
                  label: 'Show Folders',
                  onText: 'Show',
                  offText: 'Hide'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

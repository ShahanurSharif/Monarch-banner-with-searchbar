export interface IMonarchBannerSearchProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  
  // Banner Configuration Properties
  bannerHeading: string;
  searchboxPrompt: string;
  bannerHeight: number;
  backgroundColor: string;
  backgroundGradient: string;
  useGradient: boolean;
  sourceLibraries: string[];
  showFolders: boolean;
  
  // SharePoint Context
  context: {
    pageContext: {
      user: {
        displayName: string;
      };
    };
    sdks: {
      microsoftTeams?: unknown;
    };
    isServedFromLocalhost: boolean;
  };
}

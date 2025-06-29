import * as React from 'react';
import { useState } from 'react';
import styles from './MonarchBannerSearch.module.scss';
import type { IMonarchBannerSearchProps } from './IMonarchBannerSearchProps';
import { 
  SearchBox, 
  DocumentCard, 
  DocumentCardPreview, 
  DocumentCardTitle, 
  DocumentCardLocation, 
  DocumentCardType,
  Pivot,
  PivotItem,
  Stack,
  Text,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  Icon
} from '@fluentui/react';

interface ISearchResult {
  title: string;
  url: string;
  summary: string;
  author: string;
  modified: string;
  fileType: string;
  path: string;
  folder?: string;
}

interface IFolder {
  name: string;
  url: string;
  count: number;
}

const MonarchBannerSearch: React.FC<IMonarchBannerSearchProps> = (props) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ISearchResult[]>([]);
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const bannerStyle: React.CSSProperties = {
    height: `${props.bannerHeight}px`,
    background: props.useGradient ? props.backgroundGradient : props.backgroundColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  };

  const searchDocuments = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate search results for demo purposes
      // In a real implementation, you would use SharePoint Search API or PnP JS
      const mockResults: ISearchResult[] = [
        {
          title: 'Employee Handbook 2024',
          url: '/sites/intranet/documents/handbook.pdf',
          summary: 'Complete guide for new employees including policies, procedures, and benefits information.',
          author: 'HR Department',
          modified: '2024-01-15',
          fileType: 'pdf',
          path: '/sites/intranet/documents',
          folder: 'HR Documents'
        },
        {
          title: 'Project Charter Template',
          url: '/sites/intranet/templates/project-charter.docx',
          summary: 'Standard template for project initiation and planning documentation.',
          author: 'Project Management Office',
          modified: '2024-01-10',
          fileType: 'docx',
          path: '/sites/intranet/templates',
          folder: 'Templates'
        },
        {
          title: 'Annual Budget Report',
          url: '/sites/intranet/finance/budget-2024.xlsx',
          summary: 'Comprehensive financial planning document for fiscal year 2024.',
          author: 'Finance Team',
          modified: '2024-01-20',
          fileType: 'xlsx',
          path: '/sites/intranet/finance',
          folder: 'Finance'
        }
      ];

      // Filter results based on search query
      const filteredResults = mockResults.filter(result =>
        result.title.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        result.summary.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );

      setSearchResults(filteredResults);

      // Extract unique folders
      const uniqueFolders: IFolder[] = [];
      const folderNames = filteredResults.map(r => r.folder).filter(folder => folder);
      const uniqueNames = folderNames.filter((name, index) => folderNames.indexOf(name) === index);
      
      uniqueNames.forEach(folderName => {
        if (folderName) {
          uniqueFolders.push({
            name: folderName,
            url: `#${folderName}`,
            count: filteredResults.filter(r => r.folder === folderName).length
          });
        }
      });

      setFolders(uniqueFolders);

    } catch (err) {
      setError('Failed to search documents. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (newValue?: string): void => {
    const query = newValue || '';
    setSearchQuery(query);
    searchDocuments(query).catch(console.error);
  };

  const filteredResults = selectedFolder === 'all' 
    ? searchResults 
    : searchResults.filter(result => result.folder === selectedFolder);

  const getFileIcon = (fileType: string): string => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return 'PDF';
      case 'docx': case 'doc': return 'WordDocument';
      case 'xlsx': case 'xls': return 'ExcelDocument';
      case 'pptx': case 'ppt': return 'PowerPointDocument';
      default: return 'Document';
    }
  };

  return (
    <div className={styles.monarchBannerSearch}>
      {/* Banner Section */}
      <div style={bannerStyle} className={styles.bannerSection}>
        <div className={styles.bannerContent}>
          <Text variant="xxLarge" className={styles.bannerHeading}>
            {props.bannerHeading}
          </Text>
          <div className={styles.searchContainer}>
            <SearchBox
              placeholder={props.searchboxPrompt}
              onSearch={handleSearch}
              onChange={(event: React.ChangeEvent<HTMLInputElement>, newValue?: string) => handleSearch(newValue)}
              className={styles.searchBox}
              iconProps={{ iconName: 'Search' }}
            />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className={styles.bannerDecorations}>
          <div className={styles.circle1} />
          <div className={styles.circle2} />
          <div className={styles.circle3} />
        </div>
      </div>

      {/* Results Section */}
      {searchQuery && (
        <div className={styles.resultsSection}>
          <div className={styles.container}>
            
            {/* Folder Filter */}
            {props.showFolders && folders.length > 0 && (
              <div className={styles.folderFilter}>
                <Pivot
                  selectedKey={selectedFolder}
                  onLinkClick={(item: PivotItem) => setSelectedFolder(item?.props.itemKey || 'all')}
                  className={styles.folderPivot}
                >
                  <PivotItem headerText={`All (${searchResults.length})`} itemKey="all" />
                  {folders.map(folder => (
                    <PivotItem 
                      key={folder.name}
                      headerText={`${folder.name} (${folder.count})`} 
                      itemKey={folder.name} 
                    />
                  ))}
                </Pivot>
              </div>
            )}

            {/* Loading Spinner */}
            {isLoading && (
              <div className={styles.loadingContainer}>
                <Spinner size={SpinnerSize.large} label="Searching documents..." />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <MessageBar messageBarType={MessageBarType.error} isMultiline={false}>
                {error}
              </MessageBar>
            )}

            {/* Search Results */}
            {!isLoading && filteredResults.length > 0 && (
              <div>
                <Text variant="mediumPlus" className={styles.resultsHeader}>
                  Found {filteredResults.length} document{filteredResults.length !== 1 ? 's' : ''}
                </Text>
                
                <div className={styles.documentsGrid}>
                  {filteredResults.map((result, index) => (
                    <DocumentCard
                      key={index}
                      type={DocumentCardType.normal}
                      className={styles.documentCard}
                      onClickHref={result.url}
                    >
                      <DocumentCardPreview {...{
                        previewImages: [{
                          name: result.title,
                          linkProps: { href: result.url },
                          previewImageSrc: undefined,
                          iconSrc: undefined,
                          imageFit: 1,
                          width: 144,
                          height: 106
                        }],
                        getOverflowDocumentCountText: (overflowCount: number) => `+${overflowCount} more`
                      }} />
                      
                      <div className={styles.documentCardContent}>
                        <DocumentCardTitle 
                          title={result.title}
                          shouldTruncate={true}
                        />
                        
                        <div className={styles.documentMeta}>
                          <Stack horizontal tokens={{ childrenGap: 8 }}>
                            <Icon iconName={getFileIcon(result.fileType)} />
                            <Text variant="small">{result.fileType.toUpperCase()}</Text>
                          </Stack>
                          <Text variant="small" className={styles.documentAuthor}>
                            by {result.author}
                          </Text>
                          <Text variant="small" className={styles.documentDate}>
                            Modified {new Date(result.modified).toLocaleDateString()}
                          </Text>
                        </div>
                        
                        <Text variant="small" className={styles.documentSummary}>
                          {result.summary}
                        </Text>
                        
                        <DocumentCardLocation 
                          location={result.path}
                          locationHref={result.url}
                        />
                      </div>
                    </DocumentCard>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!isLoading && searchQuery && filteredResults.length === 0 && (
              <div className={styles.noResults}>
                <Icon iconName="SearchIssue" className={styles.noResultsIcon} />
                <Text variant="large">No documents found</Text>
                <Text variant="medium">
                  Try adjusting your search terms or check if the source libraries are configured correctly.
                </Text>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Welcome Message when no search */}
      {!searchQuery && (
        <div className={styles.welcomeSection}>
          <div className={styles.container}>
            <Text variant="xLarge" className={styles.welcomeTitle}>
              Search for Documents and Templates
            </Text>
            <Text variant="medium" className={styles.welcomeDescription}>
              Use the search bar above to find documents, templates, and resources across your organization.
            </Text>
            
            <div className={styles.featuresList}>
              <div className={styles.feature}>
                <Icon iconName="Search" className={styles.featureIcon} />
                <div>
                  <Text variant="mediumPlus">Smart Search</Text>
                  <Text variant="small">Find documents by title, content, or author</Text>
                </div>
              </div>
              
              <div className={styles.feature}>
                <Icon iconName="FabricFolder" className={styles.featureIcon} />
                <div>
                  <Text variant="mediumPlus">Organized by Folders</Text>
                  <Text variant="small">Browse results organized by document libraries</Text>
                </div>
              </div>
              
              <div className={styles.feature}>
                <Icon iconName="FileTemplate" className={styles.featureIcon} />
                <div>
                  <Text variant="mediumPlus">Templates & Forms</Text>
                  <Text variant="small">Access templates and forms for common tasks</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonarchBannerSearch;

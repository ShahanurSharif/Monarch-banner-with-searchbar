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
  Icon,
  DefaultButton,
  PrimaryButton
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
    backgroundColor: props.backgroundColor,
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
      {/* Enhanced Professional Banner Section */}
      <div style={bannerStyle} className={styles.bannerSection}>
        <div className={styles.bannerOverlay} />
        
        <div className={styles.bannerContent}>
          {/* Professional Header */}
          <div className={styles.brandingSection}>
            <Text variant="mega" className={styles.bannerHeading} styles={{
              root: {
                fontSize: '48px',
                fontWeight: '700',
                textShadow: '0 4px 8px rgba(0,0,0,0.4)',
                letterSpacing: '-1px'
              }
            }}>
              {props.bannerHeading}
            </Text>
          </div>

          {/* Simple Search Area */}
          <div className={styles.searchArea}>
            <SearchBox
              placeholder={props.searchboxPrompt}
              onSearch={handleSearch}
              onChange={(event: React.ChangeEvent<HTMLInputElement>, newValue?: string) => handleSearch(newValue)}
              className={styles.enhancedSearchBox}
              iconProps={{ iconName: 'Search' }}
            />
            
            {/* Quick Action Buttons */}
            <div className={styles.quickActions}>
              <DefaultButton 
                text="Documents" 
                iconProps={{ iconName: 'TextDocument' }}
                className={styles.quickActionBtn}
                onClick={() => handleSearch('document')}
              />
              <DefaultButton 
                text="Templates" 
                iconProps={{ iconName: 'FileTemplate' }}
                className={styles.quickActionBtn}
                onClick={() => handleSearch('template')}
              />
              <DefaultButton 
                text="Forms" 
                iconProps={{ iconName: 'FormLibrary' }}
                className={styles.quickActionBtn}
                onClick={() => handleSearch('form')}
              />
            </div>
          </div>
        </div>
        
        {/* Enhanced Decorative elements */}
        <div className={styles.bannerDecorations}>
          <div className={styles.geometricShape1} />
          <div className={styles.geometricShape2} />
          <div className={styles.geometricShape3} />
          <div className={styles.floatingCard1} />
          <div className={styles.floatingCard2} />
        </div>
      </div>

      {/* Results Section */}
      {searchQuery && (
        <div className={styles.resultsSection}>
          <div className={styles.container}>
            
            {/* Folder Filter */}
            {props.showFolders && folders.length > 0 && (
              <div className={styles.filterCard}>
                <div className={styles.filterCardSection}>
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
                <div className={styles.resultsHeader}>
                  <Text variant="xLarge" className={styles.resultsTitle}>
                    Found {filteredResults.length} document{filteredResults.length !== 1 ? 's' : ''}
                  </Text>
                </div>
                
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
              <div className={styles.noResultsCard}>
                <div className={styles.noResultsCardSection}>
                  <Stack horizontalAlign="center" tokens={{ childrenGap: 16 }}>
                    <Icon iconName="SearchIssue" className={styles.noResultsIcon} />
                    <Text variant="xLarge">No documents found</Text>
                    <Text variant="medium">
                      Try adjusting your search terms or check if the source libraries are configured correctly.
                    </Text>
                    <PrimaryButton 
                      text="Browse All Documents" 
                      iconProps={{ iconName: 'FabricFolder' }}
                      onClick={() => setSearchQuery('')}
                    />
                  </Stack>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default MonarchBannerSearch;

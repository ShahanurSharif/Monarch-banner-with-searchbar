import * as React from 'react';
import { useState, useRef, useCallback, useMemo } from 'react';
import styles from './MonarchBannerSearch.module.scss';
import type { IMonarchBannerSearchProps } from './IMonarchBannerSearchProps';
import { 
  SearchBox, 
  Text,
  Spinner,
  SpinnerSize,
  Icon,
  List,
  FocusZone,
  FocusZoneDirection
} from '@fluentui/react';

interface ISearchResult {
  title: string;
  url: string;
  summary: string;
  author: string;
  modified: string;
  fileType: string;
  path: string;
  folder: string;
  id: string;
}

interface ISearchCell {
  Key: string;
  Value: string;
}

interface ISearchRow {
  Cells: ISearchCell[];
}

interface ISearchState {
  query: string;
  results: ISearchResult[];
  isLoading: boolean;
  error: string;
  highlightedIndex: number;
  hasSearched: boolean;
}

const MonarchBannerSearch: React.FC<IMonarchBannerSearchProps> = (props) => {
  const [searchState, setSearchState] = useState<ISearchState>({
    query: '',
    results: [],
    isLoading: false,
    error: '',
    highlightedIndex: -1,
    hasSearched: false
  });

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<number | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | null>(null);



  // Enhanced cell mapping with better performance
  const createCellMap = useCallback((cells: ISearchCell[]): Map<string, string> => {
    return new Map(cells.map(cell => [cell.Key, cell.Value]));
  }, []);

  // Improved search result mapping
  const mapSearchResult = useCallback((row: ISearchRow, index: number): ISearchResult | null => {
    try {
      let cells: ISearchCell[] = [];
      
      if (row.Cells) {
        if (Array.isArray(row.Cells)) {
          cells = row.Cells;
        } else if ('results' in row.Cells && Array.isArray((row.Cells as { results: ISearchCell[] }).results)) {
          cells = (row.Cells as { results: ISearchCell[] }).results;
        }
      }

      if (!Array.isArray(cells) || cells.length === 0) {
        console.warn(`Row ${index}: Invalid or empty cells array`);
        return null;
      }

      const cellMap = createCellMap(cells);
      
      // Enhanced title extraction with fallbacks
      const getTitle = (): string => {
        const titleSources = ['Title', 'FileName', 'Name', 'FileLeafRef'];
        for (const source of titleSources) {
          const value = cellMap.get(source);
          if (value && value.trim()) return value.trim();
        }
        
        const path = cellMap.get('Path');
        if (path) {
          const pathParts = path.split('/');
          const fileName = pathParts[pathParts.length - 1];
          if (fileName && fileName.trim()) return fileName.trim();
        }
        
        return 'Untitled Document';
      };

      const path = cellMap.get('Path') || '';
      const author = cellMap.get('Author') || 'Unknown';
      const modifiedTime = cellMap.get('LastModifiedTime') || new Date().toISOString();
      let fileType = cellMap.get('FileType') || 'unknown';
      const siteName = cellMap.get('SiteName') || 'SharePoint';
      const summary = cellMap.get('HitHighlightedSummary') || '';

      // Extract file type from path if not provided
      if (!fileType || fileType === 'unknown') {
        const pathParts = path.split('.');
        if (pathParts.length > 1) {
          fileType = pathParts[pathParts.length - 1].toLowerCase();
        }
      }

      // Format date consistently
      const formatDate = (dateString: string): string => {
        try {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        } catch {
          return new Date().toISOString().split('T')[0];
        }
      };

      return {
        id: `${index}-${Date.now()}`, // Unique identifier
        title: getTitle(),
        url: path,
        summary: summary.replace(/<[^>]*>/g, '').trim(),
        author: author,
        modified: formatDate(modifiedTime),
        fileType: fileType,
        path: path.substring(0, path.lastIndexOf('/')) || path,
        folder: siteName
      };
    } catch (err) {
      console.error(`Error mapping search result at index ${index}:`, err, row);
      return null;
    }
  }, [createCellMap]);

  // Enhanced search API with better error handling and abort support
  const searchDocuments = useCallback(async (query: string): Promise<void> => {
    if (!query.trim()) {
      setSearchState(prev => ({
        ...prev,
        results: [],
        isLoading: false,
        error: '',
        hasSearched: false
      }));
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setSearchState(prev => ({
      ...prev,
      isLoading: true,
      error: '',
      hasSearched: true
    }));

    try {
      const webUrl = (props.context as { pageContext?: { web?: { absoluteUrl?: string } } })
        .pageContext?.web?.absoluteUrl || window.location.origin;
      
      const searchUrl = `${webUrl}/_api/search/query?` + 
        `querytext='${encodeURIComponent(query)}*'&` +
        `selectproperties='Title,Path,Author,LastModifiedTime,FileType,SiteName,SPWebUrl,HitHighlightedSummary,FileName,Name,FileLeafRef'&` +
        `rowlimit=20&` +
        `trimduplicates=true`;

      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose'
        },
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Enhanced response parsing with better error handling
      let searchRows: ISearchRow[] = [];
      
      try {
        const tableRows = data?.d?.query?.PrimaryQueryResult?.RelevantResults?.Table?.Rows;
        
        if (tableRows) {
          if (Array.isArray(tableRows)) {
            searchRows = tableRows;
          } else if ('results' in tableRows && Array.isArray(tableRows.results)) {
            searchRows = tableRows.results;
          }
        }
      } catch (parseError) {
        console.error('Error parsing search response:', parseError);
        throw new Error('Invalid search response format');
      }

      // Map results with error handling for individual items
      const mappedResults: ISearchResult[] = searchRows
        .map((row, index) => mapSearchResult(row, index))
        .filter((item): item is ISearchResult => item !== null);

      setSearchState(prev => ({
        ...prev,
        results: mappedResults,
        error: '',
        highlightedIndex: mappedResults.length > 0 ? 0 : -1,
        isLoading: false
      }));

    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, don't update state
        return;
      }
      
      console.error('Search error:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to search documents. Please try again.';
      
      setSearchState(prev => ({
        ...prev,
        error: errorMessage,
        results: [],
        isLoading: false
      }));
    }
  }, [props.context, mapSearchResult]);

  // Enhanced debounced search with cleanup
  const debouncedSearch = useCallback((query: string): void => {
    if (debounceTimeout.current !== undefined) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = window.setTimeout(() => {
      searchDocuments(query).catch(console.error);
    }, 300);
  }, [searchDocuments]);

  // Handle document click with better error handling
  const handleDocumentClick = useCallback((url: string): void => {
    if (!url) {
      console.error('No URL provided for document');
      return;
    }
    
    setSearchState(prev => ({ ...prev, highlightedIndex: -1 }));
    
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Error opening document:', err);
    }
  }, []);

  // Enhanced input change handler
  const handleSearchChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>, 
    newValue?: string
  ): void => {
    const query = newValue || '';
    setSearchState(prev => ({ ...prev, query }));
    debouncedSearch(query);
  }, [debouncedSearch]);

  // Enhanced keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>): void => {
    const { results, highlightedIndex } = searchState;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (results.length > 0) {
          const nextIndex = highlightedIndex < results.length - 1 ? highlightedIndex + 1 : 0;
          setSearchState(prev => ({ ...prev, highlightedIndex: nextIndex }));
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        if (results.length > 0) {
          const prevIndex = highlightedIndex > 0 ? highlightedIndex - 1 : results.length - 1;
          setSearchState(prev => ({ ...prev, highlightedIndex: prevIndex }));
        }
        break;
        
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleDocumentClick(results[highlightedIndex].url);
        }
        break;
        
      case 'Escape':
        setSearchState(prev => ({ ...prev, highlightedIndex: -1, query: '', results: [], hasSearched: false }));
        break;
    }
  }, [searchState, handleDocumentClick]);

  // Cleanup effect
  React.useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Memoized banner style for performance
  const bannerStyle: React.CSSProperties = useMemo(() => ({
    height: `${props.bannerHeight}px`,
    backgroundColor: props.backgroundColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  }), [props.bannerHeight, props.backgroundColor]);

  // Render function for FluentUI List items
  const onRenderCell = useCallback((item: ISearchResult, index?: number): JSX.Element => {
    const isSelected = index === searchState.highlightedIndex;
    const displayTitle = item.title.length > 43 ? item.title.slice(0, 43) + '...' : item.title;

    return (
      <div 
        className={`${styles.simpleResultItem} ${isSelected ? styles.simpleResultItemActive : ''}`}
        onMouseEnter={() => setSearchState(prev => ({ ...prev, highlightedIndex: index || -1 }))}
        data-is-focusable={true}
        onClick={() => handleDocumentClick(item.url)}
      >
        <div className={styles.resultContent}>
          <div className={styles.resultLeft}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resultTitle}
              tabIndex={-1}
            >
              {displayTitle}
            </a>
          </div>
          <div className={styles.resultRight}>
            <span className={styles.resultFileType}>{item.fileType.toUpperCase()}</span>
          </div>
        </div>
      </div>
    );
  }, [searchState.highlightedIndex, handleDocumentClick]);

  // Memoized filtered results for performance
  const displayResults = useMemo(() => {
    return searchState.results.slice(0, 8);
  }, [searchState.results]);

  return (
    <div className={styles.monarchBannerSearch}>
      <div style={bannerStyle} className={styles.bannerSection}>
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerContent}>
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
          <div className={styles.searchBoxWrapper}>
            <div className={styles.searchArea} ref={searchBoxRef}>
              <div className={styles.searchContainer}>
                <SearchBox
                  styles={{
                    root: {
                      border: 'none !important'
                    }
                  }}
                  placeholder={props.searchboxPrompt}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  className={styles.enhancedSearchBox}
                  iconProps={{ iconName: 'Search' }}
                  value={searchState.query}
                  autoComplete="off"
                  aria-label="Search documents"
                  aria-expanded={searchState.results.length > 0}
                  aria-activedescendant={searchState.highlightedIndex >= 0 ? `result-${searchState.highlightedIndex}` : undefined}
                />
                {(searchState.hasSearched || searchState.isLoading) && (
                  <div className={styles.searchResultsContainer}>
                    {searchState.isLoading && (
                      <div className={styles.dropdownLoading}>
                        <Spinner size={SpinnerSize.small} />
                        <Text variant="small">Searching documents...</Text>
                      </div>
                    )}
                    {searchState.error && (
                      <div className={styles.dropdownError}>
                        <Icon iconName="ErrorBadge" />
                        <Text variant="small">{searchState.error}</Text>
                      </div>
                    )}
                    {!searchState.isLoading && !searchState.error && (
                      <div className={styles.searchResultsList}>
                        {searchState.hasSearched && displayResults.length === 0 ? (
                          <div className={styles.professionalNoResults}>
                            <Icon iconName="SearchIssue" className={styles.noResultsIcon} />
                            <Text variant="medium" className={styles.noResultsText}>
                              No documents found for &quot;{searchState.query}&quot;
                            </Text>
                            <Text variant="small" className={styles.noResultsSubtext}>
                              Try adjusting your search terms or check spelling
                            </Text>
                          </div>
                        ) : (
                          <FocusZone direction={FocusZoneDirection.vertical}>
                            <List
                              items={displayResults}
                              onRenderCell={onRenderCell}
                              role="listbox"
                              aria-label="Search results"
                            />
                          </FocusZone>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bannerDecorations}>
          <div className={styles.geometricShape1} />
          <div className={styles.geometricShape2} />
          <div className={styles.geometricShape3} />
          <div className={styles.floatingCard1} />
          <div className={styles.floatingCard2} />
        </div>
      </div>
    </div>
  );
};

export default MonarchBannerSearch;

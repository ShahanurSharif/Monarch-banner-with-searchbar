import * as React from 'react';
import { useState, useRef, useCallback } from 'react';
import styles from './MonarchBannerSearch.module.scss';
import type { IMonarchBannerSearchProps } from './IMonarchBannerSearchProps';
import { 
  SearchBox, 
  Text,
  Spinner,
  SpinnerSize,
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
  folder: string;
}

interface ISearchCell {
  Key: string;
  Value: string;
}

interface ISearchRow {
  Cells: ISearchCell[];
}

const MonarchBannerSearch: React.FC<IMonarchBannerSearchProps> = (props) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<ISearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<number | undefined>(undefined);
  const mappedResultsRef = useRef<ISearchResult[]>([]);

  // File icon helper
  const getFileIcon = (fileType: string): string => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return 'PDF';
      case 'docx': case 'doc': return 'WordDocument';
      case 'xlsx': case 'xls': return 'ExcelDocument';
      case 'pptx': case 'ppt': return 'PowerPointDocument';
      default: return 'Document';
    }
  };

  // Handle document click
  const handleDocumentClick = (url: string): void => {
    setHighlightedIndex(-1);
    window.open(url, '_blank');
  };

  // Search function
  const searchDocuments = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      setError('');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const webUrl = (props.context as { pageContext?: { web?: { absoluteUrl?: string } } }).pageContext?.web?.absoluteUrl || window.location.origin;
      const searchUrl = `${webUrl}/_api/search/query?querytext='${encodeURIComponent(query)}*'&selectproperties='Title,Path,Author,LastModifiedTime,FileType,SiteName,SPWebUrl,HitHighlightedSummary'&rowlimit=20`;
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose'
        }
      });
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      // Defensive: handle both .Rows and .Rows.results
      let searchRows: ISearchRow[] = [];
      if (data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows) {
        if (Array.isArray(data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows)) {
          searchRows = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows;
        } else if ('results' in data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows && Array.isArray(data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results)) {
          searchRows = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
        }
      }
      console.log('Raw searchRows:', searchRows);
      const mappedResults: ISearchResult[] = searchRows.map((row: ISearchRow, idx: number) => {
        try {
          let cells: ISearchCell[] = [];
          if (row.Cells) {
            if (Array.isArray(row.Cells)) {
              cells = row.Cells;
            } else if ('results' in row.Cells && Array.isArray((row.Cells as { results: ISearchCell[] }).results)) {
              cells = (row.Cells as { results: ISearchCell[] }).results;
            }
          }
          if (!Array.isArray(cells)) {
            throw new Error('Row.Cells is missing or not an array/results');
          }
          console.log('Cells:', cells.map((cell: ISearchCell) => ({ key: cell.Key, value: cell.Value })));
          const getCell = (key: string): string => {
            for (let i = 0; i < cells.length; i++) {
              if (cells[i].Key === key) {
                return cells[i].Value;
              }
            }
            return '';
          };
          const title =
            getCell('Title') ||
            getCell('FileName') ||
            getCell('Name') ||
            getCell('FileLeafRef') ||
            (getCell('Path') ? getCell('Path').split('/').pop() : undefined) ||
            'Untitled Document';
          const path = getCell('Path') || '';
          const author = getCell('Author') || 'Unknown';
          const modified = getCell('LastModifiedTime') || new Date().toISOString();
          const fileType = getCell('FileType') || 'unknown';
          const siteName = getCell('SiteName') || 'SharePoint';
          const summary = getCell('HitHighlightedSummary') || '';
          let actualFileType = fileType;
          if (!actualFileType && path) {
            const pathParts = path.split('.');
            if (pathParts.length > 1) {
              actualFileType = pathParts[pathParts.length - 1].toLowerCase();
            }
          }
          return {
            title,
            url: path,
            summary: summary.replace(/<[^>]*>/g, ''),
            author,
            modified: new Date(modified).toISOString().split('T')[0],
            fileType: actualFileType,
            path: path.substring(0, path.lastIndexOf('/')) || path,
            folder: siteName
          };
        } catch (err) {
          console.error('Mapping error at row', idx, err, row);
          return null;
        }
      }).filter((item): item is ISearchResult => !!item);
      console.log('Mapped results:', mappedResults);
      mappedResultsRef.current = mappedResults;
      setSearchResults(mappedResults);
      setError(''); // Only set error if fetch fails
      setHighlightedIndex(mappedResults.length > 0 ? 0 : -1);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search documents. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback((query: string): void => {
    if (debounceTimeout.current !== undefined) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = window.setTimeout(() => {
      searchDocuments(query).catch(console.error);
    }, 300);
  }, []);

  // Handle input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>, newValue?: string): void => {
    setSearchQuery(newValue || '');
    debouncedSearch(newValue || '');
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
        handleDocumentClick(searchResults[highlightedIndex].url);
      }
    } else if (event.key === 'Escape') {
      setHighlightedIndex(-1);
    }
  };

  // Banner style
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

  return (
    <div className={styles.monarchBannerSearch}>
      {/* Search bar and results list at the top */}
      <div className={styles.searchArea} ref={searchBoxRef}>
        <div className={styles.searchContainer}>
          <SearchBox
            placeholder={props.searchboxPrompt}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className={styles.enhancedSearchBox}
            iconProps={{ iconName: 'Search' }}
            value={searchQuery}
            autoComplete="off"
          />
          <div style={{ marginTop: 8 }}>
            <div style={{
              fontWeight: 600,
              fontSize: '13px',
              color: '#605e5c',
              padding: '8px 12px 4px 12px',
              borderBottom: '1px solid #f3f2f1',
              background: '#fff',
              letterSpacing: '0.5px'
            }}>
              Search
            </div>
            {isLoading && (
              <div className={styles.dropdownLoading}>
                <Spinner size={SpinnerSize.small} />
                <Text variant="small">Searching...</Text>
              </div>
            )}
            {error && (
              <div className={styles.dropdownError}>
                <Icon iconName="ErrorBadge" />
                <Text variant="small">{error}</Text>
              </div>
            )}
            {!isLoading && !error && (
              <>
                {console.log('Rendering mappedResultsRef.current:', mappedResultsRef.current)}
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {mappedResultsRef.current.length > 0 ? (
                    mappedResultsRef.current.slice(0, 8).map((result, index) => (
                      <li
                        key={index}
                        className={styles.dropdownItem}
                        onClick={() => handleDocumentClick(result.url)}
                        role="button"
                        tabIndex={0}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className={styles.dropdownItemIcon}>
                          <Icon iconName={getFileIcon(result.fileType)} />
                        </span>
                        <span className={styles.dropdownItemContent}>
                          <Text variant="medium" className={styles.dropdownItemTitle}>
                            {result.title}
                          </Text>
                          <Text variant="small" className={styles.dropdownItemSubtitle}>
                            On the site {result.folder || 'Document Library'}
                          </Text>
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className={styles.dropdownNoResults}>
                      <Icon iconName="SearchIssue" />
                      <Text variant="small">No documents found for &quot;{searchQuery}&quot;</Text>
                    </li>
                  )}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Banner below the search bar and results */}
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

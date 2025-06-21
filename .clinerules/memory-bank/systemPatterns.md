# System Patterns: Graph Analysis Architecture

## Core Architecture Pattern

```
Obsidian Plugin → MyGraph → Analysis Algorithms → Svelte UI Components
```

### Plugin Entry Point
- **GraphAnalysisPlugin** extends Obsidian's Plugin class
- Manages plugin lifecycle, settings, and view registration
- Handles commands for opening/refreshing analysis views
- Waits for metadata cache completion before initializing graph

### Graph Processing Pipeline

```
Obsidian Vault → MyGraph.initGraph() → Graph Analysis → UI Rendering
```

1. **Data Ingestion**: MyGraph reads Obsidian's metadata cache
2. **Graph Construction**: Builds graphology-based graph structure
3. **Algorithm Execution**: Runs selected analysis algorithms
4. **Result Presentation**: Svelte components render results in tables

## Key Technical Decisions

### Graph Library Choice
- **Graphology**: Chosen for robust graph data structure and algorithm support
- Provides foundation for all mathematical graph operations
- Enables complex algorithms like Louvain community detection

### UI Framework Selection
- **Svelte**: Lightweight, reactive components for Obsidian integration
- Table-based presentation with expandable details
- Infinite scroll for large result sets

### Analysis Algorithm Categories

#### 1. Co-Citations (Flagship Feature)
- **Pattern**: Proximity-based co-occurrence analysis
- **Implementation**: Custom algorithm with sentence-level context
- **UI Pattern**: Expandable dropdowns showing contextual sentences

#### 2. Similarity Measures
- **Jaccard Similarity**: Based on shared neighbors in graph
- **Pattern**: Mathematical set intersection/union calculations

#### 3. Link Prediction
- **Adamic Adar**: Weighted common neighbors approach
- **Common Neighbours**: Simple shared connection counting
- **Pattern**: Probability scoring for potential connections

#### 4. Community Detection
- **Label Propagation**: Iterative community assignment
- **Louvain Algorithm**: Modularity optimization
- **Clustering Coefficient**: Triangle-based local clustering

## Component Relationships

### Core Classes
```
GraphAnalysisPlugin
├── MyGraph (extends graphology.Graph)
├── AnalysisView (extends ItemView)
├── Settings (PluginSettingTab)
└── Utility functions
```

### Svelte Component Hierarchy
```
AnalysisComponent.svelte (root)
├── TableComponent.svelte
├── CoCitations.svelte
├── HITS.svelte
├── LabelPropagation.svelte
├── Louvain.svelte
└── Utility Components
    ├── ScrollSelector.svelte
    ├── Checkboxes.svelte
    └── InfoIcon.svelte
```

## Critical Implementation Paths

### Graph Initialization Flow
1. Wait for Obsidian metadata cache completion
2. Create MyGraph instance with app and settings
3. Process all markdown files and their links
4. Build graphology graph structure
5. Cache graph for analysis operations

### Analysis Execution Pattern
1. User selects analysis type from UI
2. AnalysisView.draw() called with subtype
3. Appropriate algorithm executed on MyGraph
4. Results formatted and passed to Svelte components
5. Table rendered with expandable details

### Co-Citations Processing
1. Identify notes that appear together in same documents
2. Calculate proximity scores based on sentence distance
3. Extract contextual sentences for each co-citation pair
4. Rank results by co-citation frequency and proximity

## Performance Considerations

### Graph Caching Strategy
- Graph rebuilt only when vault structure changes
- Analysis results computed on-demand
- Metadata cache monitoring for incremental updates

### UI Optimization
- Infinite scroll for large result sets
- Lazy loading of expandable content
- Hover previews without full note loading

## Integration Patterns

### Obsidian API Usage
- **MetadataCache**: Source of link and file information
- **Vault**: File content access for co-citation context
- **Workspace**: View management and leaf handling
- **ItemView**: Base class for analysis panel

### External Library Integration
- **graphology**: Core graph data structure
- **graphology-communities-louvain**: Community detection
- **graphology-metrics**: Graph analysis metrics
- **wink-nlp**: Natural language processing for sentence extraction
- **sbd**: Sentence boundary detection for co-citations

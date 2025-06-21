# Technical Context: Graph Analysis Development Stack

## Core Technologies

### Primary Stack
- **TypeScript**: Main development language for type safety and Obsidian API integration
- **Svelte**: UI framework for reactive components and efficient rendering
- **Graphology**: Mathematical graph library providing data structures and algorithms
- **Obsidian API**: Plugin platform integration for vault access and UI components

### Development Environment
- **Node.js**: Runtime environment for build tools and development
- **Rollup**: Module bundler with Svelte integration
- **pnpm**: Package manager for dependency management
- **Standard Version**: Automated versioning and changelog generation

## Key Dependencies

### Graph Analysis Libraries
```json
"graphology": "^0.23.1"                    // Core graph data structure
"graphology-communities-louvain": "^1.5.3" // Community detection algorithms
"graphology-metrics": "^1.18.2"            // Graph analysis metrics
```

### Natural Language Processing
```json
"wink-nlp": "^1.10.0"           // NLP processing for sentence extraction
"wink-nlp-utils": "^2.0.7"      // NLP utility functions
"wink-sentiment": "^5.0.2"      // Sentiment analysis capabilities
"sbd": "^1.0.19"                // Sentence boundary detection
```

### UI and Utilities
```json
"svelte": "3.35.0"                    // UI framework
"svelte-icons": "^2.1.0"             // Icon components
"svelte-infinite-scroll": "^2.0.0"   // Performance optimization
"lodash.isequal": "^4.5.0"           // Deep equality checking
"sanitize-html": "^2.5.2"            // HTML sanitization
```

### Obsidian Integration
```json
"obsidian": "^0.12.17"              // Obsidian API types and interfaces
"obsidian-community-lib": "1.2.0"   // Community utilities for plugin development
```

## Development Setup

### Build Configuration
- **Rollup Config**: Configured for TypeScript, Svelte, and Obsidian plugin output
- **TypeScript Config**: Strict type checking with Svelte support
- **Svelte Preprocessing**: TypeScript integration and component compilation

### Development Scripts
```json
"dev": "rollup --config rollup.config.js -w"                    // Watch mode development
"build": "rollup --config rollup.config.js --environment BUILD:production"  // Production build
"release": "standard-version"                                    // Automated releases
```

## Technical Constraints

### Obsidian Plugin Requirements
- **Manifest Version**: Must comply with Obsidian plugin manifest schema
- **API Compatibility**: Minimum app version 0.12.10 required
- **Desktop/Mobile**: Plugin supports both desktop and mobile platforms
- **Sandboxed Environment**: Limited to Obsidian's plugin API capabilities

### Performance Considerations
- **Graph Size Limits**: Performance degrades with very large vaults (>10k notes)
- **Memory Usage**: Graph structures cached in memory for performance
- **UI Responsiveness**: Infinite scroll and lazy loading for large result sets
- **Computation Complexity**: Some algorithms (Louvain) are computationally expensive

## Architecture Decisions

### Graph Library Selection
**Why Graphology**: 
- Comprehensive graph algorithms library
- TypeScript support with excellent type definitions
- Active maintenance and community support
- Specialized algorithms for community detection

### UI Framework Choice
**Why Svelte**:
- Lightweight runtime suitable for Obsidian plugins
- Excellent TypeScript integration
- Reactive updates without virtual DOM overhead
- Component-based architecture for maintainability

### Language Choice
**Why TypeScript**:
- Type safety for complex graph operations
- Better IDE support and refactoring capabilities
- Obsidian API has excellent TypeScript definitions
- Easier maintenance of mathematical algorithms

## Integration Patterns

### Obsidian API Usage
```typescript
// Core integrations used throughout the plugin
import { Plugin, ItemView, WorkspaceLeaf, Notice } from 'obsidian'
import { MetadataCache, Vault, App } from 'obsidian'
```

### Graph Processing Flow
```typescript
// Typical processing pattern
const graph = new MyGraph(app, settings)
await graph.initGraph()  // Build from Obsidian metadata
const results = algorithm.execute(graph, targetNote)
component.render(results)  // Display in Svelte UI
```

### Error Handling Strategy
- **Graceful Degradation**: Plugin continues working if individual algorithms fail
- **User Feedback**: Notice system for user-facing errors
- **Debug Logging**: Comprehensive logging for development and troubleshooting
- **Fallback Behavior**: Default to basic functionality if advanced features fail

## Development Workflow

### Local Development
1. **Setup**: `pnpm install` to install dependencies
2. **Development**: `pnpm run dev` for watch mode compilation
3. **Testing**: Manual testing in Obsidian development environment
4. **Building**: `pnpm run build` for production bundle

### Plugin Distribution
- **Manual Installation**: Copy built files to Obsidian plugins directory
- **Community Plugin**: Available through Obsidian's community plugin browser
- **Version Management**: Automated through standard-version workflow

## Future Technical Considerations

### Scalability Improvements
- **Web Workers**: Move heavy computations off main thread
- **Incremental Updates**: Only recompute changed portions of graph
- **Caching Strategies**: Persistent caching of analysis results

### API Evolution
- **Obsidian API Updates**: Stay current with platform changes
- **Graph Algorithm Additions**: Expand algorithm library as needed
- **Performance Optimizations**: Continuous improvement of computational efficiency

import * as fs from 'fs';
import * as path from 'path';

/**
 * Type definitions for exclusion patterns.
 */
type ExclusionPatterns = {
  directories: string[];
  files: string[];
  filePatterns: RegExp[];
  extensions: string[];
};

/**
 * Configuration Constants
 */
const outputFolderName = 'runner/local-data';
const TREE_DEPTH = Infinity; // Set to Infinity for unlimited depth
const entryFiles: string[] = ['pages/index.js'];

/**
 * Exclusion Patterns Configuration
 */
const exclusionPatterns: ExclusionPatterns = {
  directories: ['node_modules', '.git', 'android', 'ios', 'vendor'],
  files: ['package-lock.json', 'yarn.lock'],
  filePatterns: [/\.env/],
  extensions: [
    '.png',
    '.jpg',
    '.jpeg',
    '.svg',
    '.gif',
    '.bmp',
    '.tiff',
    '.ico',
  ],
};

/**
 * Paths Configuration
 */
const projectRoot: string = process.cwd();
const outputFolderPath: string = path.join(projectRoot, outputFolderName);
const aggregatedOutputFile: string = path.join(
  outputFolderPath,
  'aggregated-context.txt'
);
const importTreeFile: string = path.join(outputFolderPath, 'import-tree.txt');

/**
 * Interface for Processed Files Cache
 */
interface ProcessedFilesCache {
  [key: string]: boolean;
}

/**
 * Interface for Dependency Map
 */
interface DependencyMap {
  [filePath: string]: string[];
}

/**
 * Main Execution Flow
 */
(async function main() {
  try {
    setupOutputFolder(outputFolderPath);
    const repositoryTree: string = generateTree(projectRoot);
    const packageJsonContent: string = readPackageJson();

    const processedFilesCache: ProcessedFilesCache = {};
    const aggregatedContents: string[] = [];
    const dependencyMap: DependencyMap = {};

    // Add Repository Tree to Aggregated Contents
    aggregatedContents.push('📂 Repository Tree:');
    aggregatedContents.push(repositoryTree);
    aggregatedContents.push('');

    // Add package.json to Aggregated Contents
    aggregatedContents.push('📄 package.json:');
    aggregatedContents.push(packageJsonContent);
    aggregatedContents.push('');

    // Process Each Entry File
    for (const entryFile of entryFiles) {
      const entryFilePath: string = path.resolve(projectRoot, entryFile);
      if (fs.existsSync(entryFilePath) && fs.statSync(entryFilePath).isFile()) {
        console.log(`Processing entry file: ${entryFile}`);
        await processFile(
          entryFilePath,
          processedFilesCache,
          aggregatedContents,
          dependencyMap,
          0
        );
      } else {
        console.warn(`Entry file not found or is not a file: ${entryFile}`);
      }
    }

    // Write Aggregated Contents to Output File
    fs.writeFileSync(
      aggregatedOutputFile,
      aggregatedContents.join('\n'),
      'utf8'
    );
    console.log(
      `Aggregated output generated successfully at ${aggregatedOutputFile}`
    );

    // Generate and Write Import Hierarchy Tree to File
    const importHierarchyTree: string = generateImportHierarchyTree(
      dependencyMap,
      entryFiles
    );
    fs.writeFileSync(importTreeFile, importHierarchyTree, 'utf8');
    console.log(
      `Import hierarchy tree generated successfully at ${importTreeFile}`
    );
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();

/**
 * Sets up the output folder by creating it if it doesn't exist.
 * @param folderPath - The path to the output folder.
 */
function setupOutputFolder(folderPath: string): void {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Output directory created at ${folderPath}`);
  } else {
    console.log(`Output directory already exists at ${folderPath}`);
  }
}

/**
 * Generates a visual representation of the project's directory structure.
 * @param dirPath - The directory path to generate the tree from.
 * @param prefix - The prefix for formatting the tree structure.
 * @param depth - The current depth of recursion.
 * @returns A string representing the directory tree.
 */
function generateTree(
  dirPath: string,
  prefix: string = '',
  depth: number = 0
): string {
  if (depth > TREE_DEPTH) {
    return '';
  }

  const entries: string[] = fs
    .readdirSync(dirPath)
    .filter(
      (entry: string) =>
        !exclusionPatterns.directories.includes(entry) &&
        !exclusionPatterns.files.includes(entry) &&
        !exclusionPatterns.filePatterns.some((pattern: RegExp) =>
          pattern.test(entry)
        ) &&
        !exclusionPatterns.extensions.includes(path.extname(entry))
    );

  const treeLines: string[] = [];

  entries.forEach((entry: string, index: number) => {
    const fullPath: string = path.join(dirPath, entry);
    const isLast: boolean = index === entries.length - 1;
    const connector: string = isLast ? '└── ' : '├── ';
    const nextPrefix: string = prefix + (isLast ? '    ' : '│   ');

    treeLines.push(prefix + connector + entry);

    if (fs.statSync(fullPath).isDirectory()) {
      const subtree: string = generateTree(fullPath, nextPrefix, depth + 1);
      if (subtree) {
        treeLines.push(subtree);
      }
    }
  });

  return treeLines.join('\n');
}

/**
 * Reads and returns the content of package.json.
 * @returns The content of package.json as a string.
 */
function readPackageJson(): string {
  const packageJsonPath: string = path.join(projectRoot, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const content: string = fs.readFileSync(packageJsonPath, 'utf8');
      return content;
    } catch (error) {
      console.warn(`Error reading package.json: ${error}`);
      return '{}';
    }
  } else {
    console.warn('package.json not found.');
    return '{}';
  }
}

/**
 * Processes a file and its imports recursively.
 * @param filePath - The absolute path to the file to process.
 * @param processedFilesCache - A cache to keep track of processed files.
 * @param aggregatedContents - The array holding aggregated file contents.
 * @param dependencyMap - A map to record dependencies between files.
 * @param depth - The current depth of recursion.
 */
async function processFile(
  filePath: string,
  processedFilesCache: ProcessedFilesCache,
  aggregatedContents: string[],
  dependencyMap: DependencyMap,
  depth: number
): Promise<void> {
  if (depth > TREE_DEPTH) {
    return;
  }
  if (processedFilesCache[filePath]) {
    return;
  }

  // Exclusion Check: Skip files with excluded extensions
  const fileExtension: string = path.extname(filePath).toLowerCase();
  if (exclusionPatterns.extensions.includes(fileExtension)) {
    console.log(
      `Skipping excluded file: ${path.relative(projectRoot, filePath)}`
    );
    return;
  }

  processedFilesCache[filePath] = true;

  const relativePath: string = path.relative(projectRoot, filePath);
  console.log(`Processing file: ${relativePath}`);

  aggregatedContents.push('<---New File--->');
  aggregatedContents.push(relativePath);
  aggregatedContents.push('');
  aggregatedContents.push(readFileContent(filePath));
  aggregatedContents.push('');

  const importPaths: string[] = extractImportPaths(filePath);
  const resolvedImportPaths: string[] = [];

  for (const importPath of importPaths) {
    const resolvedPath: string | null = resolveFilePath(filePath, importPath);
    if (resolvedPath) {
      resolvedImportPaths.push(resolvedPath);
      await processFile(
        resolvedPath,
        processedFilesCache,
        aggregatedContents,
        dependencyMap,
        depth + 1
      );
    } else {
      console.warn(
        `Unable to resolve import path "${importPath}" in ${relativePath}`
      );
    }
  }

  // Record dependencies in the dependency map
  dependencyMap[relativePath] = resolvedImportPaths.map((absPath) =>
    path.relative(projectRoot, absPath)
  );
}

/**
 * Reads and returns the content of a file.
 * @param filePath - The absolute path to the file.
 * @returns The file content as a string.
 */
function readFileContent(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.warn(`Error reading file ${filePath}: ${error}`);
    return '// Unable to read file content.';
  }
}

/**
 * Extracts import paths from a file.
 * @param filePath - The absolute path to the file.
 * @returns An array of local or alias import paths.
 */
function extractImportPaths(filePath: string): string[] {
  const content: string = readFileContent(filePath);
  const importRegex: RegExp =
    /import\s+(?:[\w*\s{},]*\s+from\s+)?["']([^"']+)["'];?/g;
  const requireRegex: RegExp = /require\(["']([^"']+)["']\)/g;

  const paths: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(content)) !== null) {
    if (isLocalOrAliasPath(match[1])) {
      paths.push(match[1]);
    }
  }

  while ((match = requireRegex.exec(content)) !== null) {
    if (isLocalOrAliasPath(match[1])) {
      paths.push(match[1]);
    }
  }

  return paths;
}

/**
 * Checks if a path is local or alias-based (starting with '.' or '@/').
 * @param importPath - The import path to check.
 * @returns True if the path is local or '@/' alias, false otherwise.
 */
function isLocalOrAliasPath(importPath: string): boolean {
  return importPath.startsWith('.') || importPath.startsWith('@/');
}

/**
 * Resolves import paths to absolute file paths.
 * For '@/' imports, we assume it maps to the 'src' directory at the project root.
 * @param currentFilePath - The absolute path of the current file.
 * @param importPath - The import path to resolve.
 * @returns The resolved absolute path or null if not found.
 */
function resolveFilePath(
  currentFilePath: string,
  importPath: string
): string | null {
  const potentialExtensions: string[] = ['', '.ts', '.tsx', '.js', '.jsx'];

  // If the path starts with '@/', map it to 'src' directory
  let basePath: string;
  if (importPath.startsWith('@/')) {
    // Remove the '@/' prefix and prepend 'src'
    const subPath = importPath.slice(2); // remove '@/'
    basePath = path.resolve(projectRoot, 'src', subPath);
  } else {
    // It's a relative path
    basePath = path.resolve(path.dirname(currentFilePath), importPath);
  }

  for (const ext of potentialExtensions) {
    const fullPath: string = basePath + ext;
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return fullPath;
    }

    const indexPath: string = path.join(basePath, 'index' + ext);
    if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
      return indexPath;
    }
  }

  return null;
}

/**
 * Generates the import hierarchy tree and returns it as a string.
 * @param dependencyMap - A map of file dependencies.
 * @param entryFiles - The list of entry files.
 * @returns A string representing the import hierarchy tree.
 */
function generateImportHierarchyTree(
  dependencyMap: DependencyMap,
  entryFilesList: string[]
): string {
  const treeLines: string[] = [];
  const visited: Set<string> = new Set();

  treeLines.push('📂 Import Hierarchy:');

  for (const entryFile of entryFilesList) {
    const relativeEntryFile: string = path.relative(
      projectRoot,
      path.resolve(projectRoot, entryFile)
    );
    buildImportTree(relativeEntryFile, dependencyMap, treeLines, '', visited);
  }

  return treeLines.join('\n');
}

/**
 * Recursively builds the import tree for a given file.
 * @param filePath - The relative path of the file.
 * @param dependencyMap - A map of file dependencies.
 * @param treeLines - The array holding lines of the tree.
 * @param prefix - The prefix for formatting the tree structure.
 * @param visited - A set to track visited files for circular dependency detection.
 */
function buildImportTree(
  filePath: string,
  dependencyMap: DependencyMap,
  treeLines: string[],
  prefix: string,
  visited: Set<string>
): void {
  const isCircular: boolean = visited.has(filePath);

  treeLines.push(prefix + filePath + (isCircular ? ' (circular)' : ''));

  if (isCircular) {
    return;
  }

  visited.add(filePath);

  const dependencies = dependencyMap[filePath] || [];
  dependencies.forEach((dep, index) => {
    const isLast = index === dependencies.length - 1;
    const nextPrefix = prefix + (isLast ? '└── ' : '├── ');
    buildImportTree(
      dep,
      dependencyMap,
      treeLines,
      nextPrefix,
      new Set(visited)
    );
  });
}

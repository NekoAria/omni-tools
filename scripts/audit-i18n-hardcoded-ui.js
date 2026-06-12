#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_TARGETS = ['src/pages/tools'];
const COMPONENT_TARGET = 'src/components';

const JSX_ATTRIBUTE_NAMES = new Set([
  'title',
  'description',
  'placeholder',
  'label',
  'buttonText',
  'inputLabel',
  'helperText',
  'resultTitle',
  'inputTitle',
  'tooltip',
  'aria-label'
]);

const PROPERTY_NAMES = new Set([
  'title',
  'description',
  'shortDescription',
  'longDescription',
  'inputTitle',
  'resultTitle',
  'placeholder',
  'label'
]);

const IGNORED_PROPERTY_NAMES = new Set([
  // Example payloads are data shown inside inputs/results, not UI labels.
  'sampleText',
  'sampleResult'
]);

const IGNORED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  'coverage',
  'test-results',
  'playwright-report'
]);

function parseArgs(argv) {
  const options = {
    targets: [...DEFAULT_TARGETS],
    includeComponents: false,
    json: false,
    failOnFindings: false
  };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];

    if (arg === '--components') {
      options.includeComponents = true;
      continue;
    }

    if (arg === '--json') {
      options.json = true;
      continue;
    }

    if (arg === '--fail-on-findings') {
      options.failOnFindings = true;
      continue;
    }

    if (arg === '--target') {
      const target = argv[index + 1];
      if (!target) {
        throw new Error('--target requires a path value');
      }
      options.targets.push(target);
      index++;
      continue;
    }

    if (arg.startsWith('--target=')) {
      options.targets.push(arg.slice('--target='.length));
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (
    options.includeComponents &&
    !options.targets.includes(COMPONENT_TARGET)
  ) {
    options.targets.push(COMPONENT_TARGET);
  }

  return options;
}

function walkFiles(rootDir, files = []) {
  if (!fs.existsSync(rootDir)) {
    return files;
  }

  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      walkFiles(fullPath, files);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (!/\.(ts|tsx)$/.test(entry.name)) {
      continue;
    }

    if (/\.(test|spec)\.(ts|tsx)$/.test(entry.name)) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function isLikelyEnglishUiString(value) {
  const text = value.trim();

  if (!text) {
    return false;
  }

  if (!/[A-Za-z]{3,}/.test(text)) {
    return false;
  }

  if (!/\s/.test(text)) {
    return false;
  }

  if (/^https?:\/\//.test(text)) {
    return false;
  }

  return true;
}

function getSourceFileKind(filePath) {
  return filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
}

function getLineAndColumn(sourceFile, node) {
  const position = sourceFile.getLineAndCharacterOfPosition(
    node.getStart(sourceFile)
  );
  return {
    line: position.line + 1,
    column: position.character + 1
  };
}

function getStringFromJsxAttribute(attribute) {
  const initializer = attribute.initializer;

  if (!initializer) {
    return null;
  }

  if (ts.isStringLiteral(initializer)) {
    return initializer.text;
  }

  if (
    ts.isJsxExpression(initializer) &&
    initializer.expression &&
    (ts.isStringLiteral(initializer.expression) ||
      ts.isNoSubstitutionTemplateLiteral(initializer.expression))
  ) {
    return initializer.expression.text;
  }

  return null;
}

function getStringFromPropertyAssignment(assignment) {
  const initializer = assignment.initializer;

  if (
    ts.isStringLiteral(initializer) ||
    ts.isNoSubstitutionTemplateLiteral(initializer)
  ) {
    return initializer.text;
  }

  return null;
}

function getPropertyName(node) {
  if (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) {
    return node.name.text;
  }

  return null;
}

function analyzeFile(filePath) {
  const sourceText = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    getSourceFileKind(filePath)
  );

  const findings = [];

  function addFinding(node, kind, name, value) {
    if (!isLikelyEnglishUiString(value)) {
      return;
    }

    const position = getLineAndColumn(sourceFile, node);
    findings.push({
      file: path.relative(PROJECT_ROOT, filePath),
      line: position.line,
      column: position.column,
      kind,
      name,
      text: value.replace(/\s+/g, ' ').trim()
    });
  }

  function visit(node) {
    if (
      ts.isJsxAttribute(node) &&
      JSX_ATTRIBUTE_NAMES.has(String(node.name.text))
    ) {
      const value = getStringFromJsxAttribute(node);
      if (value) {
        addFinding(node, 'jsx-attribute', String(node.name.text), value);
      }
    }

    if (ts.isPropertyAssignment(node)) {
      const propertyName = getPropertyName(node);
      if (
        propertyName &&
        PROPERTY_NAMES.has(propertyName) &&
        !IGNORED_PROPERTY_NAMES.has(propertyName)
      ) {
        const value = getStringFromPropertyAssignment(node);
        if (value) {
          addFinding(node, 'property', propertyName, value);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return findings;
}

function getGroupName(relativeFilePath) {
  const parts = relativeFilePath.split(path.sep);

  if (parts[0] === 'src' && parts[1] === 'pages' && parts[2] === 'tools') {
    return parts[3] || 'tools';
  }

  if (parts[0] === 'src' && parts[1] === 'components') {
    return 'components';
  }

  return 'other';
}

function groupFindings(findings) {
  const grouped = new Map();

  for (const finding of findings) {
    const group = getGroupName(finding.file);
    if (!grouped.has(group)) {
      grouped.set(group, new Map());
    }

    const fileMap = grouped.get(group);
    if (!fileMap.has(finding.file)) {
      fileMap.set(finding.file, []);
    }

    fileMap.get(finding.file).push(finding);
  }

  return grouped;
}

function printTextReport(findings) {
  const grouped = groupFindings(findings);
  const fileCount = new Set(findings.map((finding) => finding.file)).size;

  console.log(
    `Hardcoded English UI candidate findings: ${findings.length} in ${fileCount} files`
  );

  if (findings.length === 0) {
    return;
  }

  for (const [group, fileMap] of [...grouped.entries()].sort()) {
    console.log(`\n[${group}] ${fileMap.size} files`);

    for (const [file, fileFindings] of [...fileMap.entries()].sort()) {
      console.log(`- ${file} (${fileFindings.length})`);

      for (const finding of fileFindings) {
        const preview =
          finding.text.length > 120
            ? `${finding.text.slice(0, 117)}...`
            : finding.text;
        console.log(
          `  L${finding.line}:${finding.column} ${finding.kind}:${finding.name} ${preview}`
        );
      }
    }
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const absoluteTargets = options.targets.map((target) =>
    path.resolve(PROJECT_ROOT, target)
  );
  const files = absoluteTargets.flatMap((target) => walkFiles(target));
  const findings = files.flatMap((file) => analyzeFile(file));

  if (options.json) {
    console.log(JSON.stringify({ findings }, null, 2));
  } else {
    printTextReport(findings);
  }

  if (options.failOnFindings && findings.length > 0) {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

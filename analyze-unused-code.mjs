#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UnusedCodeAnalyzer {
  constructor() {
    this.srcDir = path.join(process.cwd(), 'src');
    this.unusedExports = new Set();
    this.unusedTypes = new Set();
    this.unusedHooks = new Set();
    this.unusedServices = new Set();
    this.allFiles = [];
    this.fileContents = new Map();
  }

  // جمع كل الملفات
  getAllFiles(dir, extensions = ['.ts', '.tsx']) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getAllFiles(fullPath, extensions));
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  // قراءة محتوى الملفات
  loadFileContents() {
    this.allFiles = this.getAllFiles(this.srcDir);
    console.log(`Found ${this.allFiles.length} TypeScript files`);
    
    for (const file of this.allFiles) {
      try {
        this.fileContents.set(file, fs.readFileSync(file, 'utf-8'));
      } catch (error) {
        console.warn(`Could not read file: ${file}`);
      }
    }
  }

  // استخراج الإكسبورتات من ملف
  extractExports(content, filePath) {
    const exports = [];
    
    // Named exports
    const namedExportRegex = /export\s+(?:const|let|var|function|class|interface|type|enum)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match;
    while ((match = namedExportRegex.exec(content)) !== null) {
      exports.push({
        name: match[1],
        type: 'named',
        file: filePath
      });
    }

    // Export statements
    const exportStatementRegex = /export\s*\{\s*([^}]+)\s*\}/g;
    while ((match = exportStatementRegex.exec(content)) !== null) {
      const exportList = match[1].split(',').map(e => e.trim().split(' as ')[0].trim());
      exportList.forEach(name => {
        if (name && name !== 'default') {
          exports.push({
            name,
            type: 'named',
            file: filePath
          });
        }
      });
    }

    // Default exports
    const defaultExportRegex = /export\s+default\s+(?:class|function)?\s*([a-zA-Z_$][a-zA-Z0-9_$]*)?/g;
    while ((match = defaultExportRegex.exec(content)) !== null) {
      const name = match[1] || path.basename(filePath, path.extname(filePath));
      exports.push({
        name,
        type: 'default',
        file: filePath
      });
    }

    return exports;
  }

  // البحث عن الاستخدامات
  findUsages(exportName, excludeFile) {
    const usages = [];
    
    for (const [filePath, content] of this.fileContents) {
      if (filePath === excludeFile) continue;
      
      // Import usage
      const importRegex = new RegExp(`import\\s+.*\\b${exportName}\\b.*from`, 'g');
      if (importRegex.test(content)) {
        usages.push({ file: filePath, type: 'import' });
        continue;
      }

      // Direct usage in code
      const usageRegex = new RegExp(`\\b${exportName}\\b`, 'g');
      const matches = content.match(usageRegex);
      if (matches && matches.length > 0) {
        // تجنب الإيجابيات الخاطئة (مثل التعليقات)
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.includes(exportName) && !line.startsWith('//') && !line.startsWith('*')) {
            usages.push({ file: filePath, type: 'usage', line: i + 1 });
            break;
          }
        }
      }
    }
    
    return usages;
  }

  // تحليل الهوكس
  analyzeHooks() {
    const hookFiles = this.allFiles.filter(f => f.includes('/hooks/'));
    const unusedHooks = [];

    for (const hookFile of hookFiles) {
      const content = this.fileContents.get(hookFile);
      const exports = this.extractExports(content, hookFile);
      
      for (const exp of exports) {
        const usages = this.findUsages(exp.name, hookFile);
        if (usages.length === 0) {
          unusedHooks.push({
            name: exp.name,
            file: hookFile,
            type: 'hook'
          });
        }
      }
    }

    return unusedHooks;
  }

  // تحليل الخدمات
  analyzeServices() {
    const serviceFiles = this.allFiles.filter(f => f.includes('/services/'));
    const unusedServices = [];

    for (const serviceFile of serviceFiles) {
      const content = this.fileContents.get(serviceFile);
      const exports = this.extractExports(content, serviceFile);
      
      for (const exp of exports) {
        const usages = this.findUsages(exp.name, serviceFile);
        if (usages.length === 0) {
          unusedServices.push({
            name: exp.name,
            file: serviceFile,
            type: 'service'
          });
        }
      }
    }

    return unusedServices;
  }

  // تحليل الأنواع
  analyzeTypes() {
    const typeFiles = this.allFiles.filter(f => f.includes('/types/'));
    const unusedTypes = [];

    for (const typeFile of typeFiles) {
      const content = this.fileContents.get(typeFile);
      
      // استخراج الأنواع والواجهات
      const typeRegex = /export\s+(?:interface|type|enum)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      let match;
      
      while ((match = typeRegex.exec(content)) !== null) {
        const typeName = match[1];
        const usages = this.findUsages(typeName, typeFile);
        
        if (usages.length === 0) {
          unusedTypes.push({
            name: typeName,
            file: typeFile,
            type: 'type'
          });
        }
      }
    }

    return unusedTypes;
  }

  // تحليل المكونات
  analyzeComponents() {
    const componentFiles = this.allFiles.filter(f => 
      f.includes('/components/') && f.endsWith('.tsx')
    );
    const unusedComponents = [];

    for (const componentFile of componentFiles) {
      const content = this.fileContents.get(componentFile);
      const exports = this.extractExports(content, componentFile);
      
      for (const exp of exports) {
        const usages = this.findUsages(exp.name, componentFile);
        if (usages.length === 0) {
          unusedComponents.push({
            name: exp.name,
            file: componentFile,
            type: 'component'
          });
        }
      }
    }

    return unusedComponents;
  }

  // تشغيل التحليل الكامل
  async analyze() {
    console.log('🔍 Starting deep code analysis...');
    
    this.loadFileContents();
    
    console.log('📊 Analyzing hooks...');
    const unusedHooks = this.analyzeHooks();
    
    console.log('🔧 Analyzing services...');
    const unusedServices = this.analyzeServices();
    
    console.log('📝 Analyzing types...');
    const unusedTypes = this.analyzeTypes();
    
    console.log('⚛️ Analyzing components...');
    const unusedComponents = this.analyzeComponents();

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        unusedHooks: unusedHooks.length,
        unusedServices: unusedServices.length,
        unusedTypes: unusedTypes.length,
        unusedComponents: unusedComponents.length,
        totalFiles: this.allFiles.length
      },
      details: {
        unusedHooks,
        unusedServices,
        unusedTypes,
        unusedComponents
      }
    };

    // حفظ التقرير
    fs.writeFileSync('unused-code-analysis.json', JSON.stringify(report, null, 2));
    
    console.log('\n📈 Analysis Results:');
    console.log(`- Unused Hooks: ${unusedHooks.length}`);
    console.log(`- Unused Services: ${unusedServices.length}`);
    console.log(`- Unused Types: ${unusedTypes.length}`);
    console.log(`- Unused Components: ${unusedComponents.length}`);
    console.log('\n📄 Detailed report saved to: unused-code-analysis.json');

    return report;
  }
}

// تشغيل التحليل
const analyzer = new UnusedCodeAnalyzer();
analyzer.analyze().catch(console.error);
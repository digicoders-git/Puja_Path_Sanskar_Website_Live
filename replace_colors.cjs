const fs = require('fs');
const path = require('path');

const directory = 'src';

// Regex to match tailwind color classes like: text-gray-500, bg-white, hover:bg-orange-600, border-red-500
const pattern = /([a-z0-9:-]*:)?(bg|text|border|ring|divide|placeholder|from|to|via)-([a-z]+)(?:-([0-9]+))?\b/g;

function mapColorClass(match, prefix, prop, color, weight) {
    prefix = prefix || '';
    weight = weight ? parseInt(weight) : null;
    
    let newColor = '';
    
    if (color === 'white') {
        if (prop === 'text' || prop === 'bg' || prop === 'border') {
            newColor = 'light';
        }
    } else if (color === 'black') {
        if (prop === 'text' || prop === 'bg') {
            newColor = 'primary';
        }
    } else if (['gray', 'slate', 'zinc', 'neutral', 'stone'].includes(color)) {
        if (weight && weight > 300) {
            newColor = 'primary';
        } else {
            if (prop === 'bg') {
                newColor = 'light';
            } else {
                newColor = 'secondary';
            }
        }
    } else if (['orange', 'red', 'yellow', 'amber', 'rose'].includes(color)) {
        if (weight && weight > 400) {
            newColor = 'primary';
        } else {
            newColor = 'secondary';
        }
    } else if (['green', 'emerald', 'teal', 'cyan', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink'].includes(color)) {
        newColor = 'secondary';
    } else {
        newColor = 'primary';
    }

    if (newColor) {
        return `${prefix}${prop}-${newColor}`;
    }
    return match;
}

function processFile(filepath) {
    const content = fs.readFileSync(filepath, 'utf8');
    
    let newContent = content;
    
    // arbitrary values
    newContent = newContent.replace(/(bg|text|border)-\[#[a-zA-Z0-9]+\]/g, '$1-primary');
    newContent = newContent.replace(/(bg|text|border)-\[rgba?\([^\]]+\)\]/g, '$1-primary');
    
    // standard classes
    newContent = newContent.replace(pattern, mapColorClass);
    
    // shadows and accents
    newContent = newContent.replace(/shadow-([a-z]+)(?:-[0-9]+)?/g, 'shadow-secondary');
    newContent = newContent.replace(/accent-([a-z]+)(?:-[0-9]+)?/g, 'accent-primary');

    if (newContent !== content) {
        fs.writeFileSync(filepath, newContent, 'utf8');
        console.log(`Updated: ${filepath}`);
    }
}

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx') || file.endswith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(directory);
files.forEach(processFile);
console.log('Color replacement complete.');

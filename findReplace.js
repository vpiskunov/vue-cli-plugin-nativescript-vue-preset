const path = require('path');
const fs = require('fs');
let rootDir;

function searchReplaceFilesInDirectory(dir, tempDir, findString, replaceString) {
    if (!fs.existsSync(dir)) {
        console.log(`Specified directory: ${dir} does not exist`);
        return;
    }
    rootDir = dir;

    const files = fs.readdirSync(dir);
    const found = getFilesInDirectory(dir);

    found.forEach(file => {
        const fileContent = fs.readFileSync(file, 'utf8');
        const regex = new RegExp(findString, "g");
        if (regex.test(fileContent)) {
            const tempFile = file.replace(rootDir, tempDir);
            console.log(`++Your string '${findString}' was found in file: ${file}`);
            console.log(`New path for file:`, tempFile)
            if (!fs.existsSync(path.dirname(tempFile))){
              fs.mkdirSync(path.dirname(tempFile));
            }
            fs.writeFileSync(tempFile, fileContent.replace(regex, replaceString), { encoding: 'utf-8' });
            if(!fs.existsSync(tempFile)) {
              throw Error(`Error: file is missing after writing it! ${file}.added`)
            } else {
              console.warn(tempFile+' written')
              // This was a workaround attempt, due to original files being
              // re-set after writing to them by vue-cli - bug?
              //
              // fs.unlinkSync(file);
              // console.log('original exists:', fs.existsSync(file))
              // console.warn(`removed ${file}, moving .added to orginal name`)
              // fs.renameSync(file+'.added', file);
            }

            // if(!fs.existsSync(file)) {
            //   // throw Error(`Error: file is missing after writing it! ${file}`)
            // }

            // console.warn(`Replaced file ${file}`);
        }
    });
}

// Using recursion, we find every file, even if its deeply nested in subfolders.
function getFilesInDirectory(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`Specified directory: ${dir} does not exist`);
        return;
    }

    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.lstatSync(filePath);

        // If we hit a directory, apply our function to that dir. If we hit a file, add it to the array of files.
        if (stat.isDirectory()) {
            const nestedFiles = getFilesInDirectory(filePath);
            files = files.concat(nestedFiles);
        } else {
            files.push(filePath);
        }
    });

    return files;
}

module.exports = searchReplaceFilesInDirectory;

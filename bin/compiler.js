
const Compiler = function() {
    this.toSource = require('tosource');
    this.fs = require('fs');
    this.componentDir = 'components/'
    this.compiledFile = this.componentDir+'compiled.js';
    this.encoding = 'utf8';
    this.componentCount = 0;
    this.delims = {
        templateStart: "<template>",
        templateEnd: "</template>",
        scriptStart: "<script>",
        scriptEnd: "</script>",
        nameStart: "<name>",
        nameEnd: "</name>"
    
    }

    this.createComponentString = function(sourceFile) {
        var template = this.extractFromTags({doc: sourceFile, start: this.delims.templateStart, end: this.delims.templateEnd});
        var script   = this.extractFromTags({doc: sourceFile, start: this.delims.scriptStart, end: this.delims.scriptEnd});
        var name     = this.extractFromTags({doc: sourceFile, start: this.delims.nameStart, end: this.delims.nameEnd});
        var scriptObj = eval("(" + script + ")");
        scriptObj.template = this.reduceWhiteSpace(template);
        script = "const " + name + " = " + this.reduceWhiteSpace(this.toSource(scriptObj)) + ";\n";
        this.writeToOutputFile(script);
        console.log(name + ": compiled")
    }

    this.compile = function() {
        this.deleteOutputFile();
        this.sourceIterator((fileName) => {
            this.readSourceFile(fileName, (sourceFile) => {
                this.createComponentString(sourceFile);
            })
        })
    }

    this.deleteOutputFile = function() {
        try {
            this.fs.unlinkSync(this.compiledFile);
        } catch(e) {
            console.log("Error deleting file: " + e)
        }
    }

    this.extractFromTags = function(opts) {
        var start = opts.doc.indexOf(opts.start) + opts.start.length;
        var end   = opts.doc.indexOf(opts.end);
        return opts.doc.substring(start, end);
    }

    this.readSourceFile = function(sourceFileName, callback){
        this.fs.readFile(this.componentDir+sourceFileName, this.encoding, (e, sourceFile) => {
            callback(sourceFile);
        });
    }

    this.reduceWhiteSpace = function(str) {
        return str.replace(/\s+/g,' ');
        //return str.replace(/(\r\n|\n|\r|\t)/gm," ");
    } 

    this.sourceIterator = function(callback) {
        this.fs.readdir(this.componentDir, (err, fileList) => {
            var sfcs = fileList.filter((f) => f.indexOf(".vue") > -1);
            sfcs.forEach((fileName, index) => {
                callback(fileName)
            });
        });
    }

    this.writeToOutputFile = function(compiledString) {
        this.fs.appendFile(this.compiledFile, compiledString, (e) => {
            if (e) console.log("Error writing file: " + e);
        });
    } 
}

var compiler = new Compiler();
compiler.compile();
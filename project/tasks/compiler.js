module.exports = function(grunt) {

	grunt.registerTask("vuecompile", "Compiles the Vue components into a single Javascript file", function() {
	
		const Compiler = function() {
		    this.toSource = require('tosource');
		    this.fs = require('fs');
		    this.componentDir = 'components/';
		    this.compiledFile = this.componentDir+'compiled.js';
		    this.encoding = 'utf8';
		    this.componentCount = 0;
		    this.delims = {
		        templateStart: "<template>",
		        templateEnd: "</template>",
		        scriptStart: "<script>",
		        scriptEnd: "</script>",
		        nameStart: "<name>",
		        nameEnd: "</name>",
		        topLevelStart: "<top-level>",
		        topLevelEnd: "</top-level>",
		        defaultStart: "<default>",
		        defaultEnd: "</default>"
		    
		    };
		    this.routes = [];
		    
		    this.componentName = function(sourceFile) {
		    	return this.extractFromTags({doc: sourceFile, start: this.delims.nameStart, end: this.delims.nameEnd}).replace(/\s+/g,'');
		    }
		
		    this.createComponentString = function(sourceFile) {
		        var template = this.extractFromTags({doc: sourceFile, start: this.delims.templateStart, end: this.delims.templateEnd});
		        var script   = this.extractFromTags({doc: sourceFile, start: this.delims.scriptStart, end: this.delims.scriptEnd});
		        var name 	 = this.componentName(sourceFile); 
		        var scriptObj = eval("(" + script + ")");
		        scriptObj.template = this.reduceWhiteSpace(template);
		        script = "const " + name + " = " + this.reduceWhiteSpace(this.toSource(scriptObj)) + ";\n";
		        this.writeToOutputFile(script);
		        console.log(name + ": compiled");
		    };
		
		    this.createRoutes = function(sourceFile) {
		    	var topLevel  = eval(this.extractFromTags({doc: sourceFile, start: this.delims.topLevelStart, end: this.delims.topLevelEnd}));
		    	if (!topLevel) return;
		    	
		    	var name     = this.componentName(sourceFile);
		    	var cName 	 = "___"+name+"___"; 
		    	this.routes.push({path: "/"+name, component: cName});
		    	
		    	var isDefault = eval(this.extractFromTags({doc: sourceFile, start: this.delims.defaultStart, end: this.delims.defaultEnd}));
		    	if (!isDefault) return;
		    	
		    	var defaultRouteCount = this.routes.filter((r) => r.path == "*").length
		    	if (defaultRouteCount > 0) {
		    		console.log("Warning: Multiple default components specified. Skipping new default route.");
		    		return;
		    	}
		    	this.routes.push({path: "*", component: cName});
		    }
		    
		    this.saveRoutes = function() {
		    	var routeString = "var __VueZenRoutes = " + this.toSource(this.routes).replace(/"___/g, "").replace(/___"/g, "");
		    	this.fs.writeFileSync("js/routes.js", routeString);
		    }
		    
		    this.compile = function() {
		        this.deleteOutputFile();
		    	this.sourceFileList().forEach((fileName, index) => {
		        	var sourceFile = this.readSourceFile(fileName);
		        	this.createComponentString(sourceFile);
		        	this.createRoutes(sourceFile);
		    	});
		    	this.saveRoutes();
		    };
		
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
		
		    this.readSourceFile = function(sourceFileName){
		        return this.fs.readFileSync(this.componentDir+sourceFileName, this.encoding)
		    }
		
		    this.reduceWhiteSpace = function(str) {
		        return str.replace(/\s+/g,' ');
		    } 
		
		    this.sourceFileList = function() {
		        fileList = this.fs.readdirSync(this.componentDir);
		        return fileList.filter((f) => f.indexOf(".vue") > -1);
		    }
		
		    this.writeToOutputFile = function(compiledString) {
		        result = this.fs.appendFileSync(this.compiledFile, compiledString)
		        if (result) console.log("Error writing file: " + e);
		    } 
		}
		
		var compiler = new Compiler();
		compiler.compile();
	
	});

}
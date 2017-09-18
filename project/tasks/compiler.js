module.exports = function(grunt) {

	grunt.registerTask("vuecompile", "Compiles the Vue components into a single Javascript file", function() {
	
		const Tag = function(tagName, source) {
			this.name          = tagName;
			this.source        = source;
			this.start         = "<"  + this.name + ">";
			this.end	       = "</" + this.name + ">";
			this.value         = "";
			this.startOffset   = this.source.indexOf(this.start) + this.start.length;
			this.endOffset     = this.source.indexOf(this.end);
			this.value		   = this.source.substring(this.startOffset, this.endOffset).trim();
			this.valueStripped = this.value.replace(/\s+/g,' ');
			this.eval = function() {
				return eval(this.value);
			}
		};
		
		const Component = function(fileName) {
			this.fs       = require('fs');
			this.toSource = require('tosource')
			this.source   = this.fs.readFileSync(fileName, 'utf8');
			this.tagSpec  = ["template", "script", "name", "top-level", "default"];
			this.tags	  = {};
			
			this.getTags = function() {
				this.tagSpec.forEach((tagName, index) => {
					this.tags[tagName] = new Tag(tagName, this.source);
				});
			}
			
			this.compile = function() {
				var scriptObj 		= eval("("+this.tags.script.value+")");
				scriptObj.template  = this.tags.template.valueStripped;
				return "const " + this.tags.name.value + " = " + this.toSource(scriptObj).replace(/\s+/g,' ') + ";\n";
			}
			
			this.routes = function(defaultRouteExists) {
				var topLevel     = this.tags["top-level"].eval();
				if (!topLevel) return;
				var isDefault    = this.tags["default"].eval();
				var name         = this.tags.name.value;
				var defaultRoute = {isDefault: true};
				//What's up with preProcessedName?
				//Our name is string, but we need our component name in the route obj 
				//to be a JS symbol. However, because the component object isn't
				//defined in the scope of the grunt task eval fails. To get around this
				//I edit the string after converting the object to text, rather than before
				var preProcessedName = "___"+name+"___";
				var routeObj = {path: "/"+name, component: preProcessedName};		
				if (!isDefault || defaultRouteExists) return [routeObj];
				routeObj.meta = defaultRoute;
				var defaultRouteObj = {path: "*", component: preProcessedName, meta: defaultRoute}
				return [routeObj, defaultRouteObj];
			}
			
			this.getTags();
		};
				
		const Compiler = function() {
		    this.toSource       = require('tosource');
		    this.fs             = require('fs');
		    this.componentDir   = 'components/';
		    this.compiledFile   = this.componentDir+'compiled.js';
		    this.routeFile      = "js/routes.js";
		    this.encoding       = 'utf8';
		    this.componentCount = 0;
		    this.routes         = [];
		    
		    this.defaultRouteExists = function() {
		    	return !!this.routes.filter((r) => r.path == "*").length;
		    }
		    
		    this.saveRoutes = function() {
		    	var routeString = "var __VueZenRoutes = " + this.toSource(this.routes).replace(/"___/g, "").replace(/___"/g, "");
		    	this.fs.writeFileSync(this.routeFile, routeString);
		    }
		    
		    this.compile = function() {
		        this.deleteOutputFile();
		    	this.sourceFileList().forEach((fileName, index) => {
		    		var component   	= new Component(this.componentDir+fileName);
		    		var componentJS 	= component.compile();
		    		var componentRoutes = component.routes(this.defaultRouteExists());
		    		this.routes = this.routes.concat(componentRoutes);
		    		this.fs.appendFileSync(this.compiledFile, componentJS);
		    	});
		    	this.saveRoutes();
		    }
		
		    this.deleteOutputFile = function() {
		    	if (!this.fs.existsSync(this.compiledFile)) return;
		    	this.fs.unlinkSync(this.compiledFile);
		    }
		
		    this.sourceFileList = function() {
		        fileList = this.fs.readdirSync(this.componentDir);
		        return fileList.filter((f) => f.indexOf(".vue") > -1);
		    }
		
		}
		
		var compiler = new Compiler();
		compiler.compile();
	
	});

}
module.exports = function(grunt) {
	grunt.registerTask('add_vue', "Generates a new Vue component and adds it to the project", function(componentName, isTopLevel, isDefault){
		
		var ComponentGenerator = function(componentName, isTopLevel, isDefault) {
			this.name       = componentName;
			this.isTopLevel = isTopLevel;
			this.isDefault  = isDefault;
			this.fs = require('fs');
			this.fileName = "components/" + this.name + ".vue";
			this.delims = {
					name: "{{name}}",
					isTopLevel: "{{isTopLevel}}",
					isDefault: "{{isDefault}}" 
			}
			
			this.componentString = function() {
				var comString = this.fs.readFileSync('lib/template.vue', 'utf8');
				comString = this.interpolate(comString, this.delims.name, this.name);
				comString = this.interpolate(comString, this.delims.isTopLevel, this.isTopLevel);
				comString = this.interpolate(comString, this.delims.isDefault, this.isDefault);
				return comString;
			}
			
			this.interpolate = function(source, token, value) {
				var parts = source.split(token);
				return parts[0] + String(value) + parts[1];
			}
			
			this.generate = function() {
				this.fs.writeFileSync(this.fileName, this.componentString());
				console.log(this.name + " saved to " + this.fileName);
			}
		}
		
		var comGen = new ComponentGenerator(componentName, isTopLevel, isDefault);
		comGen.generate();
	});
}
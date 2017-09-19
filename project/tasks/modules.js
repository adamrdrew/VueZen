module.exports = function(grunt) {
	grunt.registerTask("modules", "Adds a filter to the Eclipse project file that ignores the node_modules directory", function(){
		
		var done = this.async();
		
		const ProjectFilter = function(gruntAsyncComplete) {
			this.epoch = Math.floor(new Date() / 1000);
			this.filter = {
				filter: {
					id: this.epoch,
					name: "",
					type: 10,
					matcher: {
						id: "org.eclipse.ui.ide.multiFilter",
						arguments: "1.0-name-matches-false-false-node_modules"
					}
				}
			};
			this.fs = require('fs');
			this.xml2js = require('xml2js');
			this.parser = new this.xml2js.Parser();
			this.encoding = 'utf8';
			this.projectFileName =  '.project';
			this.gruntAsyncComplete = gruntAsyncComplete;
			
			this.loadProjectFile = function() {
				return this.fs.readFileSync(this.projectFileName, this.encoding);
			}
			
			this.getProjectObj = function(callback) {
				return this.parser.parseString(this.loadProjectFile(), callback);
			}
			
			this.saveProjectFile = function(projectObj) {
				var builder = new this.xml2js.Builder();
				var projectString = builder.buildObject(projectObj);
				this.fs.writeFileSync(this.projectFileName, projectString);
			}
			
			this.filterProjectFile = function() {
				this.getProjectObj((error, projectObj) => {
					projectObj.projectDescription.filteredResources = this.filter;
					this.saveProjectFile(projectObj);
					console.log("Project file edited");
					this.gruntAsyncComplete();
				});
			}
		};
		
		var projectFilter = new ProjectFilter(done);
		projectFilter.filterProjectFile();
		
	});
};
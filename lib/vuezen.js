// The VueZen classes provide wrappers around Tizen 
// features to make them easier to use. 


VueZen =  {
		
	Ajax: function(opts) {
		//VueZen.Ajax provides a replacement for jQuery's ajax method.
		//Because we're using Vue and Tau there's really no point to including
		//jQuery. That said, we do need web API access. This method provides
		//a subset of the most commonly used functions of jQuery's ajax.
		//Unlike jQuery, the response is always an object
		this.method 	= opts.method;
		this.url 		= opts.url;
		this.headers 	= opts.headers  || {};
		this.context 	= opts.context  || this;
		this.success 	= opts.success	|| function(e){};
		this.error 		= opts.error 	|| function(e){};
		this.xhrStates  = {
				unsent: 0,
				opened: 1,
				headers_recvd: 2,
				loading: 3,
				done: 4
		}
		
		var __scope = this;
				
		if (!this.url)    throw "VueZen.Ajax: No URL specified";
		if (!this.method) throw "VueZen.Ajax: No HTTP method specifed";
		
		this.xhr = new XMLHttpRequest();
		
		this.xhrStateChange = function(){
			if (this.readyState != __scope.xhrStates.done) return; 
			var responseObj = {
				status: this.status,
				responseText: this.response
			};
			try {
				responseObj.responseJSON = JSON.parse(this.response)
			} catch(e) {}
			var context = __scope.context;
			if (this.status > 199 && this.status < 300) __scope.success.bind(context)(responseObj);
			if (this.staus > 399  && this.status < 600) __scope.error.bind(context)(responseObj);
		}
		
		this.xhr.onreadystatechange = this.xhrStateChange;
		this.xhr.open(this.method, this.url);
		Object.keys(this.headers).forEach(function(key,index) {
			this.xhr.setRequestHeader(key, this.headers[key]);
		}.bind(this));
		this.xhr.send();	
	},
	FileManager: function(path) {
		//VueZen.FileMananger provides a high level API for Tizen's file management classes
		//Tizen's classes are fairly low level. The user has to manage all of the 
		//nitty gritty of locating files and directories, opening, streaming, and closing them, etc
		//Plus, the API is mostly async and requires prodigious callback chaining
		//VueZen.FileManager hides all of that complexity
		var path_array	= path.split("/");
		this.dirName  	= path_array[0];
		this.fileName 	= path_array[1];
		
		this.save = function(data,callback) {
			if (!callback) callback = function(e){};
			this.getDirectory(function(dirHandle){
				this.deleteOrCreateFile(dirHandle, function(fileHandle){
					this.writeFile(fileHandle, data, callback);
				}.bind(this));
			}.bind(this));
		}
		
		this.saveJSON = function(data,callback) {
			this.save(JSON.stringify(data),callback);
		}
		
		this.read = function(callback) {
			this.getDirectory(function(dirHandle){
				this.findFileInDirectory(dirHandle, function(fileHandle){
					this.readFile(fileHandle, callback);
				}.bind(this));
			}.bind(this));
		}
		
		this.readJSON = function(callback) {
			this.read(function(contents){
				callback(JSON.parse(contents));
			});
		}
				
		this.readFile = function(fileHandle, callback) {
			fileHandle.openStream('r', function(stream) {
				stream.position = 0
				var fileSize = fileHandle.fileSize;
				var content  = stream.read(fileSize);
				stream.close();
				callback(content);
			}, null, "UTF-8")
		}
		
		this.writeFile = function(fileHandle, data, callback) {
			fileHandle.openStream('w', function(stream){
				stream.position = 0;
				stream.write(data);
				stream.close();
				callback();
			}, null, "UTF-8");
		}
		
		
		this.getDirectory = function(callback) {
			tizen.filesystem.resolve(this.dirName, function(dirHandle){callback(dirHandle)}, function(){ throw "VueZen.FileManager: Directory does not exist."});
		}
		
		this.findFileInDirectory = function(dirHandle, callback) {
			dirHandle.listFiles(function(fileList){
				var fileName = this.fileName
				var foundFile = fileList.filter(function(fileHandle){return fileHandle.name == fileName})[0]
				callback(foundFile);
			}.bind(this));
		}
		
		this.deleteOrCreateFile = function(dirHandle, callback) {
			this.findFileInDirectory(dirHandle, function(fileHandle){
				if (fileHandle) { 
					dirHandle.deleteFile(fileHandle.fullPath, function(){
						this.createFile(dirHandle, callback)
					}.bind(this)); } 
				else { 
					this.createFile(dirHandle, callback)
				};
			}.bind(this))
			
		}
		
		this.createFile = function(dirHandle, callback) {
			var newFile = dirHandle.createFile(this.fileName, callback)
			callback(newFile);
		}
		
		
	}
	
};
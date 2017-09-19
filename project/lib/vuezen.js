// The VueZen classes provide wrappers around Tizen 
// features to make them easier to use. 


VueZen =  {
		
	Ajax: function(opts) {
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
		
	},
	BackButtonHandler: function(router) {
		this.eventName  = "tizenhwkey";
		this.buttonName = "back";
		this.router     = router;
		this.tizen		= new VueZen.TizenSystem();
		
		this.eventHandler = function(event) {
			if (event.keyName != this.buttonName) return;
			var shouldExit = this.router.currentRoute.meta.isDefault;
			if (shouldExit) {
				this.tizen.closeApp();
			} else {
				this.router.go(-1);
			}
		}
		window.addEventListener(this.eventName, this.eventHandler.bind(this));	
	},
	TizenSystem: function() {
		//https://developer.tizen.org/development/api-references/web-application?redirect=https://developer.tizen.org/dev-guide/2.3.1/org.tizen.web.apireference/html/device_api/mobile/tizen/systeminfo.html#SystemInfoPropertyId
		this.systemInfo = tizen.systeminfo;
		this.systemInfoProperties = {
				battery: "BATTERY", 
				cpu: "CPU", 
				storage: "STORAGE", 
				display:"DISPLAY", 
				orientation: "DEVICE_ORIENTATION", 
				build: "BUILD", 
				locale: "LOCALE", 
				netowrk: "NETWORK", 
				wifi: "WIFI_NETWORK", 
				cellular: "CELLULAR_NETWORK", 
				sim: "SIM", 
				peripheral: "PERIPHERAL", 
				memory: "MEMORY"
		}
		
		this.handler = function(method) {
			try { method() }
			catch (e) { this.tizenError(e); }
		}
		
		this.closeApp = function() {
			this.handler(function() { tizen.application.getCurrentApplication().exit() });
		}
		
		this.watchProperty = function(prop, callback, opts) {
			this.systemInfo.addPropertyValueChangeListener(prop, callback, opts);
		}
		
		this.tizenError = function(e) {
			console.log("Tizen System Error: " + e);
		}
		
	},
	BatteryMonitor: function(opts) {
		this.watchLevel = opts.watchLevel;
		this.exitLevel  = opts.exitLevel
		this.tizen	    = new VueZen.TizenSystem();	
		this.tizen.watchProperty("BATTERY", function(battery){
			if (battery.level > this.exitLevel) return;
			if (!battery.isCharging) this.tizen.closeApp();
		}.bind(this),{lowThreshold: this.watchLevel})
	},
	RotaryHandler: function(opts) {
		this.eventName = "rotarydetent";
		this.directionFactor = {
				CW: 1,
				CCW: -1
		}
		this.scrollSpeed = 30;
		this.UIContent = 'ui-content';
		
		this.addListener = function(callback) {
			window.addEventListener(this.eventName, callback.bind(this));
		}
		
		this.directionOffset = function(direction) {
			return this.directionFactor[direction] * this.scrollSpeed;
		}
		
		this.initPageScroller = function() {
			this.addListener(function(event){
				var scrollAmount 		    = this.directionOffset(event.detail.direction);
				var scrollableContent 	    = document.getElementsByClassName(this.UIContent)[0];
				var currentPos              = scrollableContent.scrollTop;
				scrollableContent.scrollTop = currentPos + scrollAmount;
				
			});
			
		}
		
	}
};
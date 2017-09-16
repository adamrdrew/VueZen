<name>pageTwo</name>

<template>
    <div class='ui-page ui-page-active'>
        <header class='ui-header'>
            <h2 class='ui-title'>Page 2</h2>
        </header>
        <div class='ui-content content-padding'>
            <ul class='ui-listview'>
                <li><p>Hello Page 2!</p></li>
                <li><router-link to='/one'>One</router-link></li>
                <li v-on:click='saveFile'>Save File</li>
                <li v-on:click='loadFile'>Load File</li>
                <li>Loading: {{loading}}</li>
                <li>Save: {{testData.fileSaveWorked}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
{
    data: function() {
			return {
				testData: {fileSaveWorked: false},
				loading: false
			}
		},
		methods: {
			saveFile: function() {
				var fileManager = new VueZen.FileManager("wgt-private/newFilePath.txt");
				fileManager.saveJSON({fileSaveWorked: true});
			},
			loadFile: function() {
				var fileManager = new VueZen.FileManager("wgt-private/newFilePath.txt");
				this.loading = true;
				fileManager.readJSON(function(result){
					this.testData.fileSaveWorked = result.fileSaveWorked;
					this.loading = false;
				}.bind(this));				
			}
		}
}
</script>
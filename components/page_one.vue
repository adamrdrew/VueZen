<name>pageOne</name>

<template>
	<header class='ui-header'>
		<h2 class='ui-title'>Page 1</h2>
	</header>
	<div class='ui-content content-padding'>
		<ul class='ui-listview'>
			<li>Hello Page 1!</li>
			<li>Vuex Init: {{vuex_init}}</li>
			<li><router-link to='/two'>Two</router-link></li>
			<li v-on:click='ajax'>AJAX</li>
		</ul>
		<p>{{ajax_response}}</p>
	</div>
</template>

<script>
{computed: {
	vuex_init: function() {
		return this.$store.getters.init;
	}
},
data: function() {
	return {
		ajax_response: []
	}
},
methods: {
	ajax: function() {
		new VueZen.Ajax({
			method: "GET",
			context: this,
			url: 'http://httpbin.org/get',
			success: function(result) {
				this.ajax_response = result.responseJSON;
			}
		})
	}
}}
</script>

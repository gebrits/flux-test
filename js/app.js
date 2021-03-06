/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @jsx React.DOM
 */

var TodoRepoFN = require("./repositories/TodoRepository");
var todoActions = require("./actions/TodoActions");

var adapterSailsSocket = require("./repositories/adapters/sails-socket");

io.socket.on("connect", function(){

	var repos = {
		todo: new TodoRepoFN({
	    	cache: true,
	    	adapter: adapterSailsSocket,
	    	live: true,
	    	liveActions: todoActions
	  	})
	};
	//NOTE: require them to be in lowercase
	var stores = {
		todo: require('./stores/TodoStore'),
		//test: require('./stores/TestStore'),
	};


	var flux = require("./flux");
	flux.init({
		stores: stores,
		repos: repos
	});

	var React = require('react');

	var TodoApp = require('./components/TodoApp.react');

	React.renderComponent(
	  <TodoApp />,
	  document.getElementById('todoapp')
	);
});


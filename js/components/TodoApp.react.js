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

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

var Footer = require('./Footer.react');
var Header = require('./Header.react');
var MainSection = require('./MainSection.react');

var React = require('react');
var ReactAsync = require('react-async');

var _ = require("lodash");

var TodoStore = require("../flux").stores.todo;

var TodoApp = React.createClass({

  mixins: [
    require("../componentMixins/SimpleChangeControllerView"),
    ReactAsync.Mixin
  ],

  //list the stores this Controller-view should listen to. 
  //plubming by mixing in SimpleChangeControllerView
  stores: [
    TodoStore
  ],

  /**
   * Retrieve the current TODO data from the TodoStore
   */
  getStoreState: function(cb){
    TodoStore.getAll(function(err, result){
      if(err)return cb(err);

      var docs = _.values(result),
        allComplete = docs.length === _.where(docs, {complete: true}).length;

      cb(undefined,{
        allTodos: result,
        areAllComplete: allComplete //TODO: change implementation
      });
    });
  },

  /**
   * @return {object}
   */
  render: function() {
  	return (
      <div>
        <Header />
        <MainSection
          allTodos={this.state.allTodos}
          areAllComplete={this.state.areAllComplete}
        />
        <Footer allTodos={this.state.allTodos} />
      </div>
  	);
  }
});

module.exports = TodoApp;

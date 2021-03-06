"use strict";

var _ = require("lodash");

var adapterSailsSocket = require("./adapters/sails-socket");

/**
 * AbstractRepo that could be used to model different Repositories.
 * The underlying implemention is based on PouchDB which is a pretty leaky abstraction atm.
 * @param {[type]} config [description]
 */
var AbstractRepo = function(config) {

	if(this.name === undefined){
		throw new Error("Respositories should have a 'name' defined");	
	}

	if(config === undefined){
		throw new Error("Reopsitory cannot be init without config-param");
	}
	if(config.collection === undefined){
		throw new Error("Reopsitory cannot be init without config.collection");
	}

	config.adapterIsDefault = false;

	if(config.adapter === undefined){
		config.adapter = adapterSailsSocket;
		config.adapterIsDefault = true;
	}

	var conf = _.extend({}, config, {
		name: this.name
	});
	delete conf.adapter;

	this.db = new config.adapter(conf);

	/**
	 * Create a doc.
	 * @param  {string} text The content of the doc
	 */
	this.create = function(obj, isServerCall) {
		return this.db.create(obj, isServerCall);
	};

	/**
	 * Update a doc.
	 * @param  {string} id
	 * @param {object} updates An object literal containing only the data to be
	 *     updated.
	 */
	this.update = function(id, partial, isServerCall) {
		return this.db.update(id, partial, isServerCall);
	};

	//Get the doc given id. This is needed because we need to specify a _rev of optimistic versioning.
	//Use the _rev and id to remove the document.
	//If doc not found OR anything goes wrong -> handled upstream by promise catch
	this.destroy = function(id, isServerCall) {
		return this.db.remove(id, isServerCall);
	};

	/**
	 * Update all of the docs with the same object.
	 *     the data to be updated.  Used to mark all doc as completed.
	 * @param  {object} updates An object literal containing only the data to be
	 *     updated.
	 
	 */
	this.updateAll = function(updates) {

		var that = this;

		return that.getDocs().then(function(docs) {
			return that.db.updateMulti(docs, updates);
		});
	};

	/**
	 * Delete all the completed items.
	 */
	this.destroyMulti = function(where) {

		var that = this;

		return this.getDocs(where).then(function(docs) {
			return that.db.removeMulti(docs);
		});
	};

	this.getDocs = function(where) {

		var that = this;

		// var start = Date.now();
		return that.db.find().then(function(docs) {
			// console.log("getDocs took " + (Date.now() - start) + " millis");
			if (where) {
				docs = _.where(docs, where);
			}
			return docs;
		});
	};

	this.getDocsMap = function(where) {

		return this.getDocs(where).then(function(docs) {
			return _.zipObject(_.pluck(docs, 'id'), docs);
		});
	};

};


module.exports = AbstractRepo;
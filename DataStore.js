'use strict';

var _ = require('lodash');
var Utils = require('./Utils');
var sampleJson = require('./sampleData.json');


function DataStore (key) {
  this.key = key;
  // initialize with sample data
  this.initialize();
  this.onChanges = [];
}

DataStore.prototype.initialize = function () {
  this.data = _.cloneDeep(sampleJson);
  assignColors(this.data, Utils.colors);
}

DataStore.prototype.subscribe = function (cb) {
  this.onChanges.push(cb);
};

DataStore.prototype.inform = function () {
  this.onChanges.forEach(function (cb) {
    cb();
  });
};

DataStore.prototype.update = function (newData) {
  this.data = newData;
  assignColors(this.data, Utils.colors);
  persist(this.key, this.data);
  this.inform();
};

DataStore.prototype.resetData = function () {
  this.initialize();
  this.inform();
};

module.exports = DataStore;


// Helper functions

// save data to localstorage   – persist('my-data')
// get data from localstorage  – persist('my-data', 'foobar')
function persist (namespace, data) {
  if (data) {
    return window.localStorage.setItem(namespace, JSON.stringify(data));
  }

  var store = window.localStorage.getItem(namespace);
  return (store && JSON.parse(store)) || [];
}

// assign a colorscheme from the ones available to each dataset
function assignColors (data, colors) {
  for (var i=0; i < data.datasets.length; i++) {
    for (var prop in Utils.colors[i]) {
      data.datasets[i][prop] = colors[i][prop];
    }
  }
}

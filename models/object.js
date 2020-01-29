var ObjectModel = function(data) {
  var self = this;

  Object.keys(data).forEach(function(key) {
    self[key] = data[key];
  });

  if (!self.type) throw new Error('Objects must have a type.');

  return self;
};

ObjectModel.design = {
  _id: '_design/objects',
  language: 'javascript',
  views: {
    by_type: {
      map: function(doc) { if(doc.type) emit(doc.type, doc); }
    }
  }
};

module.exports = ObjectModel;

var designDocs = [
  {
    _id: '_design/objects',
    language: 'javascript',
    views: {
      all: {
        map: function(doc) { if(doc.type) emit(null, doc); }
      },
      by_owner: {
        map: function(doc) { if(doc.type) emit([doc.owner], doc); }
      },
      by_set: {
        map: function (doc) {
          if (!doc.type || !doc.sets) return null;

          doc.sets.forEach(function(set) {
            emit([set], doc);
          });
        }
      },
      by_type: {
        map: function(doc) { if(doc.type) emit([doc.type], doc); }
      },
      by_owner_and_set: {
        map: function (doc) {
          if (!doc.type || !doc.sets) return null;

          doc.sets.forEach(function(set) {
            emit([doc.owner, set], doc);
          });
        }
      },
      by_owner_and_type: {
        map: function(doc) { if(doc.type) emit([doc.owner, doc.type], doc); }
      },
      by_set_and_type: {
        map: function (doc) {
          if (!doc.type || !doc.sets) return null;

          doc.sets.forEach(function(set) {
            emit([set, doc.type], doc);
          });
        }
      },
      by_owner_and_set_and_type: {
        map: function (doc) {
          if (!doc.type || !doc.sets) return null;

          doc.sets.forEach(function(set) {
            emit([doc.owner, set, doc.type], doc);
          });
        }
      }
    }
  },
  {
    _id: '_design/types',
    language: 'javascript',
    views: {
      all: {
        map: function(doc) { if(doc.schema) emit(null, doc); }
      }
    }
  },
  {
    _id: '_design/agents',
    language: 'javascript',
    views: {
      all: {
        map: function(doc) { if(doc.email && doc.password) emit(null, doc); }
      }
    }
  },
  {
    _id: '_design/sets',
    language: 'javascript',
    views: {
      all: {
        map: function(doc) {
          if(!doc.sets) return null;

          doc.sets.forEach(function(set) {
            emit(set, 1);
          });
        },
        reduce: '_sum'
      },
      show: {
        map: function(doc) {
          if(!doc.sets) return null;

          doc.sets.forEach(function(set) {
            emit(set, doc);
          });
        }
      }
    }
  }
];

function insertDesign(db) {
  db.bulk({ docs: designDocs }, function(err, body) {
    if (err) return console.error(err.message);
  });
}

module.exports = insertDesign;

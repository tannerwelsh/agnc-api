var designDocs = [
  {
    _id: '_design/objects',
    language: 'javascript',
    views: {
      all: {
        map: function(doc) { if(doc.type) emit(null, doc); }
      },
      by_type: {
        map: function(doc) { if(doc.type) emit(doc.type, doc); }
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

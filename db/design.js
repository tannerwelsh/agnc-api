var designDocs = [
  {
    _id: '_design/objects',
    language: 'javascript',
    views: {
      by_type: {
        map: function(doc) { if(doc.type) emit(doc.type, doc); }
      }
    }
  }
];

function insertDesign(db) {
  db.bulk({ docs: designDocs }, function(err, body) {
    if (err) return console.error(err.message);
    console.log(body);
  });
}

module.exports = insertDesign;

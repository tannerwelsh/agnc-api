var Objects, Types, Agents;

Objects = [
  {
    type:      'Quote',
    owner:     '@nemo',
    content:    "A great nation is not saved by wars, James said; it is saved \"by acts without picturesqueness; by speaking, writing, voting reasonably; by smiting corruption swiftly; by good temper between parties; by the people knowing true men when they see them, and preferring them as leaders to rabid partisans or empty quacks.\"",
    context:    'The Metaphysical Club',
    context_id: '126c101c6e58462593c4a35722045d9c',
    page:       148,
    source:     'Louis Menand',
    source_id:  '565043e91392473ebdc93d0972e7e108'
  },
  {
    type:      'Quote',
    owner:     '@nemo',
    content:    "Nineteenth-century liberals believed that the market operated like nature because they had already decided that nature operated like a market.",
    context:    'The Metaphysical Club',
    context_id: '126c101c6e58462593c4a35722045d9c',
    page:       195,
    source:     'Louis Menand',
    source_id:  '565043e91392473ebdc93d0972e7e108'
  },
  {
    type:      'Quote',
    owner:     '@nemo',
    content:    "We permit free expression because we need the resources of the whole group to get us the ideas we need. Thinking is a social activity. I tolerate your thought because it is part of my thought--even when my thought defines itself in opposition to yours.",
    context:    'The Metaphysical Club',
    context_id: '126c101c6e58462593c4a35722045d9c',
    page:       432,
    source:     'Louis Menand',
    source_id:  '565043e91392473ebdc93d0972e7e108'
  },
  {
    type:      'Quote',
    owner:     '@odysseus',
    content:    "A **system** is an interconnected set of elements that is coherently organized in a way that achieves something. If you look at that definition closely for a minute, you can see that a system must consist of three kinds of things: _elements_, _interconnections_, and a _function_ or _purpose_.",
    context:    'Thinking in Systems',
    context_id: '53b72533165045b4bcd3e2333e58c773',
    page:       11,
    source:     'Donella Meadows',
    source_id:  'faa732ca88c64f55964f4b4c6bde382c'
  },
  {
    type:      'Note',
    owner:     '@odysseus',
    text:       "Types of feedback loops: **balancing** (pulling stocks towards an ideal size) and **reinforcing** (changes in either direction produce stronger changes in the same direction).",
    source:     'Thinking in Systems',
    source_id:  '53b72533165045b4bcd3e2333e58c773',
    page:       33
  },
  {
    type:      'Note',
    owner:     '@odysseus',
    text:       "Some loops in a system have **dominance** (greater influence on behavior). This dominance can shift.",
    source:     'Thinking in Systems',
    source_id:  '53b72533165045b4bcd3e2333e58c773',
    page:       44
  },
  {
    _id:        '126c101c6e58462593c4a35722045d9c',
    type:      'Book',
    owner:     '@nemo',
    title:      'The Metaphysical Club',
    author:     'Louis Menand',
    author_id:  '565043e91392473ebdc93d0972e7e108'
  },
  {
    _id:        '53b72533165045b4bcd3e2333e58c773',
    type:      'Book',
    owner:     '@odysseus',
    title:      'Thinking in Systems',
    author:     'Donella Meadows',
    author_id:  'faa732ca88c64f55964f4b4c6bde382c'
  },
  {
    _id:        '565043e91392473ebdc93d0972e7e108',
    type:      'Person',
    owner:     '@nemo',
    name:       'Louis Menand'
  },
  {
    _id:        'faa732ca88c64f55964f4b4c6bde382c',
    type:      'Person',
    owner:     '@odysseus',
    name:       'Donella Meadows'
  }
];

Types = [
  {
    _id:    'Quote',
    owner: '@root',
    schema: { content: 'String', context: 'String?', context_id: 'Id?', source: 'String', source_id: 'Id?' }
  },
  {
    _id:    'Note',
    owner: '@root',
    schema: { text: 'String', source: 'String?', source_id: 'Id?' }
  },
  {
    _id:    'Book',
    owner: '@root',
    schema: { title: 'String', author: 'String', author_id: 'String?' }
  },
  {
    _id:    'Person',
    owner: '@root',
    schema: { name: 'String', agent_id: 'Id?' }
  }
];

Agents = [
  {
    _id:        '@root',
    name:       'root',
    email:      'root@agnc.io',
    password:   'secret'
  },
  {
    _id:        '@nemo',
    name:       'nemo',
    email:      'nemo@agnc.io',
    password:   'nobody'
  },
  {
    _id:        '@odysseus',
    name:       'odysseus',
    email:      'odysseus@agnc.io',
    password:   'ithaca'
  }
];

function seed(db) {
  var docs = [Objects, Types, Agents];

  docs.forEach(function(doclist) {
    db.bulk({ docs: doclist }, function(err, body) {
      if (err) return console.error(err.message);
      console.log(body);
    });
  });
}

module.exports = seed;

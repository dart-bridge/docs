var gulp = require('gulp');
var markdown = require('gulp-markdown-it');
var hljs = require('highlight.js');
var exec = require('child_process').execSync;
var fs = require('fs');

var interpolatedVariables = {
  className: 'literal',
  variants: [
    { begin: /\$\w+/ },
    { begin: /\$\{/, end: /\}/,contains: [
      {subLanguage: 'dart', begin: /[^}]+/}
      //{ begin: /.*/, subLanguage: 'dart'}
    ]},
  ]
};

hljs.registerLanguage("dart", function() {
  return {
    keywords: 'const factory operator async await abstract implements extends class final static if for else return new throw set get null true false part of part library import export this final in as',
    literal: 'true false null',
    contains: [
      { className: 'string',
        variants: [
          { begin: '"', end: '"'},
          { begin: "'", end: "'"},
          { begin: "r'", end: "'"},
          { begin: 'r"', end: '"'},
        ],
        contains: [interpolatedVariables]
      },

      { className: 'comment',
        begin: '//.*'},
      { className: 'comment',
        begin: /\/\*/, end: /\*\//},
      { className: 'type',
        begin: /\b_?[A-Z]\w+/},
      { className: 'type',
        begin: 'num|double|int|bool'},
      { className: 'literal',
        begin: /\b-?\d*\.?[\d]+/},
      { className: 'literal',
        begin: /@\w+/},
      { className: 'literal',
        begin: /#\w+/},

      //{ className: 'method',
      //  begin: /\.+/, end: /_?[a-z]\w*/, excludeBegin: true},
      {begin: /\./, end: /\(/, returnBegin: true, returnEnd: true, contains: [
        {className: 'method', begin: /\w+/, endsParent: true}
      ]},
      { className: 'punctuation',
        begin: /[;:=.<>{}()+\-*]/, relevance: 10},
    ]
  };
});
hljs.registerLanguage("yaml", function() {
  return {
    contains: [
      {className: 'comment', begin: /#.*/},
      { className: 'literal',
        begin: /\b\d*\.?[\d]+/},
      { className: 'key',
        begin: /^\s*\w+:/},
      { className: 'keyword',
        begin: /^\s*-/},
    ]
  };
});
hljs.registerLanguage("bridge-cli", function() {
  return {
    contains: [
      {className: 'literal', begin: /^=/, end: /$/, contains: [
        {className: 'method', begin: /./}
      ]}
    ]
  };
});
hljs.registerLanguage("chalk", function() {
  return {
    contains: [
      interpolatedVariables,
      {className: 'comment', begin: /<!/, end: />/},
      {className: 'string', begin: /'|"/, end: /'|"/},
      {className: 'comment', begin: /\/\/.*/},
      {className: 'keyword', begin: /</, end: />/},
      {begin: /@/, end: /$/, contains: [
        {className: 'keyword', begin: /extends|start block|end block|block|for|end for|if|else if|end if|include/},
        {begin: /\(/, end: /\)/, subLanguage: 'dart'}
      ]}
    ]
  };
});

hljs.configure({
  languages: [
    'dart',
    'shell',
    'yaml',
    'bridge-cli',
    'chalk',
  ],
});

exports.index = function() {
  fs.writeFileSync('dist/index.json', JSON.stringify(require('../src/index.js')));
};

exports.build = function() {
  return gulp.src('src/**/*.md')
    .pipe(markdown({options: {
      html:         true,        // Enable HTML tags in source
      xhtmlOut:     false,        // Use '/' to close single tags (<br />).
                                  // This is only for full CommonMark compatibility.
      breaks:       false,        // Convert '\n' in paragraphs into <br>
      langPrefix:   'language-',  // CSS language prefix for fenced blocks. Can be
                                  // useful for external highlighters.
      linkify:      true,        // Autoconvert URL-like text to links

      // Enable some language-neutral replacement + quotes beautification
      typographer:  true,

      // Double + single quotes replacement pairs, when typographer enabled,
      // and smartquotes on. Could be either a String or an Array.
      //
      // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
      // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
      quotes: '“”‘’',

      highlight: function (str, lang) {
        if (lang == '') return '';
        try {
          return hljs.highlight(lang, str).value;
        } catch(e) {
          console.log(e);
          return '';
        }
      }
    }}))
    .pipe(gulp.dest('dist'));
};

exports.commit = function() {
  exec('git add dist');
  exec('git commit -m "Build '+new Date()+'"');
};

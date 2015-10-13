var gulp = require('gulp');
var markdown = require('gulp-markdown-it');
var hljs = require('highlight.js');
var exec = require('child_process').execSync;

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
    keywords: 'const factory operator async await abstract implements extends class final static if else return new throw set get null true false part of part library import export this final',
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
        begin: /\b\d*\.?[\d]+/},

      //{ className: 'method',
      //  begin: /\.+/, end: /_?[a-z]\w*/, excludeBegin: true},
      { className: 'punctuation',
        begin: /[;:=.<>{}()+\-*]/, relevance: 10},
      //{ className: 'method',
      //  begin: /\n\s*\w+/, end: /.*?\(/, returnEnd: true},
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
    keywords: 'for if else',
    contains: [
      interpolatedVariables,
      {className: 'comment', begin: /<!/, end: />/},
      {className: 'keyword', begin: /</, end: />/},
    ]
  };
});

hljs.configure({
  languages: [
    'dart',
    'yaml',
    'bridge-cli',
    'chalk',
  ],
});

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

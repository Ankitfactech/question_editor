window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      processEscapes: true,
      processEnvironments: true,
      tags: 'ams',
      tagSide: 'right',
      tagIndent: '0.8em',
      useLabelIds: true,
      multlineWidth: '85%',
      macros: {
        // Define custom macros here if needed
      }
    },
    options: {
      renderActions: {
        findScript: [10, function (doc) {
          for (const node of document.querySelectorAll('script[type^="math/tex"]')) {
            const display = !!node.type.match(/; *mode=display/);
            const math = new doc.options.MathItem(node.textContent, doc.inputJax[0], display);
            const text = document.createTextNode('');
            const sibling = node.previousElementSibling;
            node.parentNode.replaceChild(text, node);
            math.start = { node: text, delim: '', n: 0 };
            math.end = { node: text, delim: '', n: 0 };
            doc.math.push(math);
            if (sibling && sibling.matches('mjx-container')) {
              sibling.remove();
            }
          }
        }, '']
      }
    },
    chtml: {
      scale: 1,
      minScale: 0.5,
      matchFontHeight: true,
      mtextInheritFont: false,
      merrorInheritFont: true,
      mtextFont: '',
      merrorFont: 'serif',
      unknownFamily: 'serif',
      mathmlSpacing: false,
      skipAttributes: {},
      exFactor: 0.5,
      displayAlign: 'center',
      displayIndent: '0',
      fontURL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2'
    }
  };
  
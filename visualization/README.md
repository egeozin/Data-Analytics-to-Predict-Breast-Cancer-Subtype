# ideogram

[![Build Status](https://travis-ci.org/eweitz/ideogram.svg?branch=master)](https://travis-ci.org/eweitz/ideogram)
[![Coverage Status](https://coveralls.io/repos/github/eweitz/ideogram/badge.svg)](https://coveralls.io/github/eweitz/ideogram)

Chromosome visualization with D3.js

[![All human genes](https://raw.githubusercontent.com/eweitz/ideogram/master/examples/ideogram_histogram_all_human_genes.png)](https://eweitz.github.io/ideogram/annotations_histogram.html)

Check out [live examples](https://eweitz.github.io/ideogram/), get [up and running](#installation) with your own deployment, skim [basic usage](#usage), or dive into the [full API](api.md)!

# Installation

To link directly to the latest release, copy this snippet:
```
<script src="https://unpkg.com/ideogram@0.12.0/dist/js/ideogram.min.js"></script>
```

You can also easily use the library locally:
```
$ cd <your local web server document root>
$ git clone https://github.com/eweitz/ideogram.git
```

Then go to [http://localhost/ideogram/examples](http://localhost/ideogram/examples).

Or, if you use npm:
```
npm install ideogram
```

You can then [import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) Ideogram into an application like so:
```
import Ideogram from 'ideogram';
```


# Usage
```html
<head>
  <script src="https://unpkg.com/ideogram@0.12.0/dist/js/ideogram.min.js"></script>
</head>
<body>
  <script>
      var ideogram = new Ideogram({
        organism: 'human',
        annotations: [{
          name: 'BRCA1',
          chr: '17',
          start: 43044294,
          stop: 43125482
        }]
      });
  </script>
</body>
```

Many more usage examples are available at https://eweitz.github.io/ideogram/.

# API

See the [Ideogram API reference](api.md) for detailed documentation on configuration options and methods.

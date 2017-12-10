/**
 * @fileoverview Core module of Ideogram.js, links all other modules
 * This file defines the Ideogram class, its constructor method, and its
 * static methods.  All instance methods are defined in other modules.
 *
 */

import * as d3selection from 'd3-selection';
import * as d3request from 'd3-request';
import * as d3brush from 'd3-brush';
import * as d3dispatch from 'd3-dispatch';
import {scaleLinear} from 'd3-scale';
import {max} from 'd3-array';
import * as d3promise from 'd3.promise';

import version from './version';

var d3 = Object.assign({}, d3selection, d3request, d3brush, d3dispatch);
d3.promise = d3promise;
d3.scaleLinear = scaleLinear;
d3.max = max;

import {configure, initDrawChromosomes, onLoad, init} from './init';

import {
  onDrawAnnots, processAnnotData, initAnnotSettings, fetchAnnots, drawAnnots,
  getHistogramBars, fillAnnots, drawProcessedAnnots, drawSynteny
} from './annotations';

import {
  eutils, esearch, esummary, elink,
  getTaxidFromEutils, getOrganismFromEutils, getTaxids,
  getAssemblyAndChromosomesFromEutils
} from './services';

import {
  getBands, drawBandLabels, getBandColorGradients, processBandData
} from './bands';

import {onBrushMove, createBrush} from './brush';
import {drawSexChromosomes, setSexChromosomes} from './sex-chromosomes';
import {convertBpToPx, convertPxToBp} from './coordinate-converters';

import {
  assemblyIsAccession, getDataDir, getChromosomeModel, drawChromosomeLabels,
  rotateChromosomeLabels, round, drawChromosome, rotateAndToggleDisplay,
  getSvg
} from './lib';

export default class Ideogram {
  constructor(config) {

    // Functions from init.js
    this.configure = configure;
    this.initDrawChromosomes = initDrawChromosomes;
    this.onLoad = onLoad;
    this.init = init;

    // Functions from annotations.js
    this.onDrawAnnots = onDrawAnnots;
    this.processAnnotData = processAnnotData;
    this.initAnnotSettings = initAnnotSettings;
    this.fetchAnnots = fetchAnnots;
    this.drawAnnots = drawAnnots;
    this.getHistogramBars = getHistogramBars;
    this.fillAnnots = fillAnnots;
    this.drawProcessedAnnots = drawProcessedAnnots;
    this.drawSynteny = drawSynteny;

    // Variables and functions from services.js
    this.eutils = eutils;
    this.esearch = esearch;
    this.esummary = esummary;
    this.elink = elink;
    this.getTaxidFromEutils = getTaxidFromEutils;
    this.getOrganismFromEutils = getOrganismFromEutils;
    this.getTaxids = getTaxids;
    this.getAssemblyAndChromosomesFromEutils = getAssemblyAndChromosomesFromEutils;

    // Functions from bands.js
    this.getBands = getBands;
    this.drawBandLabels = drawBandLabels;
    this.getBandColorGradients = getBandColorGradients;
    this.processBandData = processBandData;

    // Functions from brush.js
    this.onBrushMove = onBrushMove;
    this.createBrush = createBrush;

    // Functions from set-chromosomes.js
    this.drawSexChromosomes = drawSexChromosomes;
    this.setSexChromosomes = setSexChromosomes;

    // Functions from coordinate-converters.js
    this.convertBpToPx = convertBpToPx;
    this.convertPxToBp = convertPxToBp;

    // Functions from lib.js
    this.assemblyIsAccession = assemblyIsAccession;
    this.getDataDir = getDataDir;
    this.getChromosomeModel = getChromosomeModel;
    this.drawChromosomeLabels = drawChromosomeLabels;
    this.rotateChromosomeLabels = rotateChromosomeLabels;
    this.round = round;
    this.drawChromosome = drawChromosome;
    this.rotateAndToggleDisplay = rotateAndToggleDisplay;
    this.getSvg = getSvg;

    this.configure(config)
  }

  /**
   * Get the current version of Ideogram.js
   */
  static get version() {
    return version;
  }

  /**
  * Enable use of D3 in client apps, via "d3 = Ideogram.d3"
  */
  static get d3() {
    return d3;
  }

  /**
  * e.g. "Homo sapiens" -> "homo-sapiens"
  */
  static slugify(value) {
    return value.toLowerCase().replace(' ', '-');
  }

  /**
   * TODO: Create an 'es6-natural-sort' package for this in npm, such
   * that it can be pulled in via ES6 import.
   *
   * This function doesn't belong in Ideogram-specific code.
   *
   * From: https://github.com/overset/javascript-natural-sort
   */
  static naturalSort(a, b) {

    var q, r,
      c = /(^([+\-]?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?(?=\D|\s|$))|^0x[\da-fA-F]+$|\d+)/g,
      d = /^\s+|\s+$/g,
      e = /\s+/g,
      f = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
      g = /^0x[0-9a-f]+$/i,
      h = /^0/,
      i = function(a) {
        return (Ideogram.naturalSort.insensitive && (String(a)).toLowerCase() || String(a)).replace(d, "");
      },
      j = i(a),
      k = i(b),
      l = j.replace(c, "\0$1\0").replace(/\0$/, "").replace(/^\0/, "").split("\0"),
      m = k.replace(c, "\0$1\0").replace(/\0$/, "").replace(/^\0/, "").split("\0"),
      n = parseInt(j.match(g), 16) || l.length !== 1 && Date.parse(j),
      o = parseInt(k.match(g), 16) || n && k.match(f) && Date.parse(k) || null,
      p = function(a, b) {
        return (!a.match(h) || b == 1) && parseFloat(a) || a.replace(e, " ").replace(d, "") || 0;
      }; if (o) {
      if (n < o) {
        return -1;
      } if (n > o) {
        return 1;
      }
    } for (var s = 0, t = l.length, u = m.length, v = Math.max(t, u); s < v; s++) {
      if (q = p(l[s] || "", t), r = p(m[s] || "", u), isNaN(q) !== isNaN(r)) {
        return isNaN(q) ? 1 : -1;
      } if (/[^\x00-\x80]/.test(q + r) && q.localeCompare) {
        var w = q.localeCompare(r); return w / Math.abs(w);
      } if (q < r) {
        return -1;
      } if (q > r) {
        return 1;
      }
    }
  }

  /**
   * Sorts two chromosome objects by type and name
   * - Nuclear chromosomes come before non-nuclear chromosomes.
   * - Among nuclear chromosomes, use "natural sorting", e.g.
   *   numbers come before letters
   * - Among non-nuclear chromosomes, i.e. "MT" (mitochondrial DNA) and
   *   "CP" (chromoplast DNA), MT comes first
   *
   *
   * @param a Chromosome object "A"
   * @param b Chromosome object "B"
   * @returns {Number} JavaScript sort order indicator
   */
  static sortChromosomes(a, b) {
    var aIsNuclear = a.type === 'nuclear',
      bIsNuclear = b.type === 'nuclear',
      aIsCP = a.type === 'chloroplast',
      bIsCP = b.type === 'chloroplast',
      aIsMT = a.type === 'mitochondrion',
      bIsMT = b.type === 'mitochondrion';
    // aIsPlastid = aIsMT && a.name !== 'MT', // e.g. B1 in rice genome GCF_001433935.1
    // bIsPlastid = bIsMT && b.name !== 'MT';

    if (aIsNuclear && bIsNuclear) {
      return Ideogram.naturalSort(a.name, b.name);
    } else if (!aIsNuclear && bIsNuclear) {
      return 1;
    } else if (aIsMT && bIsCP) {
      return 1;
    } else if (aIsCP && bIsMT) {
      return -1;
    } else if (!aIsMT && !aIsCP && (bIsMT || bIsCP)) {
      return -1;
    }
  }
}
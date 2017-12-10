/**
 * @fileoverview Instance methods for sex chromosomes (allosomes).
 *
 * This module provides methods for drawing karyotypically normal
 * male and female mammalian genomes.
 */

/**
 * Appends SVG elements depicting sex chromosomes to the document.
 */
function drawSexChromosomes(bandsArray, taxid, container, defs, j, chrs) {
  var chromosome, bands, chrModel, shape, sci, k,
    sexChromosomeIndexes,
    ideo = this;

  if (ideo.config.sex === 'male') {
    sexChromosomeIndexes = [1, 0];
  } else {
    sexChromosomeIndexes = [0, 0];
  }

  for (k = 0; k < sexChromosomeIndexes.length; k++) {
    sci = sexChromosomeIndexes[k] + j;
    chromosome = chrs[sci];
    bands = bandsArray[sci];
    chrModel = ideo.getChromosomeModel(bands, chromosome, taxid, sci);
    shape = ideo.drawChromosome(chrModel, j, container, k);
    defs.append('clipPath')
      .attr('id', chrModel.id + '-chromosome-set-clippath')
      .selectAll('path')
      .data(shape)
      .enter()
      .append('path')
      .attr('d', function(d) {
        return d.path;
      }).attr('class', function(d) {
      return d.class;
    });
  }
}

/**
 * Sets instance properties regarding sex chromosomes.
 * Currently only supported for mammals.
 * TODO: Support all sexually reproducing taxa
 *   XY sex-determination (mammals):
 *     - Male: XY <- heterogametic
 *     - Female: XX
 *   ZW sex-determination (birds):
 *     - Male: ZZ
 *     - Female: ZW <- heterogametic
 *   X0 sex-determination (some insects):
 *     - Male: X0, i.e. only X <- heterogametic?
 *     - Female: XX
 * TODO: Support sex chromosome aneuploidies in mammals
 *     - Turner syndrome: X0
 *     - Klinefelter syndome: XXY
 *  More types:
 *  https://en.wikipedia.org/wiki/Category:Sex_chromosome_aneuploidies
 */
function setSexChromosomes(chrs) {
  if (this.config.ploidy !== 2 || !this.config.sex) {
    return;
  }

  var ideo = this,
    sexChrs = {X: 1, Y: 1},
    chr, i;

  ideo.sexChromosomes.list = [];

  for (i = 0; i < chrs.length; i++) {
    chr = chrs[i];

    if (ideo.config.sex === 'male' && chr in sexChrs) {
      ideo.sexChromosomes.list.push(chr);
      if (!ideo.sexChromosomes.index) {
        ideo.sexChromosomes.index = i;
      }
    } else if (chr === 'X') {
      ideo.sexChromosomes.list.push(chr, chr);
      ideo.sexChromosomes.index = i;
    }
  }
}

export {drawSexChromosomes, setSexChromosomes};
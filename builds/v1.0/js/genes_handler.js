

///////// GENES HANDLER /////////



////---OBJECTS---////

///allele object constructor
function Allele( value, dominanceIndex ) {
  this.value = value;
  this.dominanceIndex = dominanceIndex;
}

///gene locus (trait) object constructor
function Gene( allele1, allele2, expression ) {
  this.allele1 = allele1;
  this.allele2 = allele2;
  this.expression = expression; // (can be "complete", "co", or "partial")
}

///chromosome object constructor (all genes handled on a single chromosome)
function Chromosome( geneCollection ) {
  this.geneCollection = geneCollection;  // object collection of genes as { trait name: gene object, etc. }
}

///autosome (chromosome pair) object constructor
function Autosome( chromosome1, chromosome2 ) {
  this.chromosome1 = chromosome1;
  this.chromosome2 = chromosome2;
}

///phenotype (collection of expressed traits) object constructor
function Phenotype( autosome ) {
  this.autosome = autosome;
  meiosis( autosome );
}




////---FUNCTIONS---////

///meiosis (creates new child genome from parent genome)
function meiosis( autosome ) {

}







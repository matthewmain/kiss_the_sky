

///////// GENES HANDLER /////////



////---GENES---////

///first generation genome  {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{  xxx }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
var firstGenerationGenome = new Genome({
  flowerHue: new Gene( new Allele(Tl.rib(0,360),0), new Allele(Tl.rib(0,360),0), "partial")
});




////---OBJECTS---////

///allele object constructor (trait)
function Allele( value, dominanceIndex ) {
  this.value = value;
  this.dominanceIndex = dominanceIndex;
}

///gene locus object constructor (allele pair)
function Gene( allele1, allele2, expressionType ) {
  this.allele1 = allele1;
  this.allele2 = allele2;
  this.expressionType = expressionType; // (can be "complete", "co", or "partial")
}

///genome object constructor (entire genome contained on a single autosome)
function Genome( geneCollection ) {  // object collection of genes as { traitName: geneObject, ... }
  for ( gene in geneCollection ) {
    this[gene] = geneCollection[gene];
  } 
}

///phenotype (collection of expressed traits) object constructor
function Phenotype( genome ) {  // object collection of genes as { traitName: value, ... }
  for ( gene in genome ) {
    if ( genome[gene].expressionType === "complete" ) {   // expresses dominant allele value only (1,2 -> 2)
      //...{{{{{{{{{{{{{{{{{{{{{{{ XXX }}}}}}}}}}}}}}}}}}}}}}
    } else if ( genome[gene].expressionType === "co" ) {  // expresses combination of allele values (1,2 -> 1&2)
      //...{{{{{{{{{{{{{{{{{{{{{{{ XXX }}}}}}}}}}}}}}}}}}}}}}
    } else if ( genome[gene].expressionType === "partial" ) {  // expresses average of allele values (1,2 -> 1.5)
      this[gene+"Value"] = ( genome[gene].allele1.value + genome[gene].allele2.value ) / 2;
    }
  }
}




////---FUNCTIONS---////

///performs meiosis (creates new child genome from parent genomes)
function meiosis( parentGenome1, parentGenome2 ) {
  var geneCollection = {};
  for ( gene in parentGenome1 ) {  // randomly selects one allele per gene from each parent genome
    var alleleFromParent1 = Tl.rib(1,2) === 1 ? parentGenome1[gene].allele1 : parentGenome1[gene].allele2;
    var alleleFromParent2 = Tl.rib(1,2) === 1 ? parentGenome2[gene].allele1 : parentGenome2[gene].allele2;
    var allele1 = new Allele( alleleFromParent1.value, alleleFromParent1.dominanceIndex );
    var allele2 = new Allele( alleleFromParent2.value, alleleFromParent2.dominanceIndex );
    var alleleExpressionType = parentGenome1[gene].expressionType;
    geneCollection[gene] = new Gene( allele1, allele2, alleleExpressionType );
  }
  var childGenome = new Genome( geneCollection );
  return childGenome;
}









///////// GENES HANDLER /////////



////---GENES---////


///genome (an object collection of all plant genes)  {{{{{{{{{{{  xxx }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
var Genome = {
  forwardGrowthRate:  { initialValue: function(){return Tl.rfb(18,22)},     expressionType: "partial"   },
  outwardGrowthRate:  { initialValue: function(){return Tl.rfb(0.18,0.22)}, expressionType: "partial"   },
  maxSegmentWidth:    { initialValue: function(){return Tl.rfb(10,12)},     expressionType: "partial"   },
  maxTotalSegments:   { initialValue: function(){return Tl.rib(8,15)},      expressionType: "complete"  },
  firstLeafSegment:   { initialValue: function(){return Tl.rib(2,3)},       expressionType: "complete"  },
  leafFrequency:      { initialValue: function(){return Tl.rib(2,3)},       expressionType: "complete"  },
  maxLeafLength:      { initialValue: function(){return Tl.rfb(3,7)},       expressionType: "partial"   },
  leafGrowthRate:     { initialValue: function(){return Tl.rfb(1.4,1.6)},   expressionType: "partial"   },
  leafArcHeight:      { initialValue: function(){return Tl.rfb(0.3,0.4)},   expressionType: "partial"   },
  maxFlowerBaseWidth: { initialValue: function(){return Tl.rfb(0.95,1.05)}, expressionType: "partial"   },
  flowerBudHeight:    { initialValue: function(){return Tl.rfb(0.95,1.05)}, expressionType: "partial"   },
  flowerHue:          { initialValue: function(){return Tl.rib(0,260)},     expressionType: "complete"  },
  flowerSaturation:   { initialValue: function(){return Tl.rib(50,100)},    expressionType: "complete"  },
  flowerLightness:    { initialValue: function(){return Tl.rib(35,70)},     expressionType: "complete"  }
}




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

///genotype object constructor (entire genotype contained on a single autosome)
function Genotype( geneCollection ) {  // object collection of genes as { traitName: geneObject, ... }
  for ( gene in geneCollection ) {
    this[gene] = geneCollection[gene];
  } 
}

///phenotype (collection of expressed traits) object constructor
function Phenotype( genotype ) {  // object collection of genes as { traitName: value, ... }
  for ( gene in genotype ) {
    if ( genotype[gene].expressionType === "complete" ) {  // expresses dominant allele value only (1,2 -> 2)
      var dominanceDifference = genotype[gene].allele1.dominanceIndex - genotype[gene].allele2.dominanceIndex;
      this[gene+"Value"] = dominanceDifference >= 0 ? genotype[gene].allele1.value : genotype[gene].allele2.value;
    } else if ( genotype[gene].expressionType === "partial" ) {  // expresses average of allele values (1,2 -> 1.5)
      this[gene+"Value"] = ( genotype[gene].allele1.value + genotype[gene].allele2.value ) / 2;
    } else if ( genotype[gene].expressionType === "co" ) {  // expresses combination of allele values (1,2 -> 1&2)
      //(handle case by case when/if need arises...)
    }
  }
}




////---FUNCTIONS---////


///generates a first generation genotype  {{{{{{{{{{{{{{{{{{{{{{{{{{{{{  xxx }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
function generateNewFirstGenerationPlantGenotype() {
  var newGenotype = {};
  for ( gene in Genome ) {
    newGenotype[gene] = createGene( Genome[gene].initialValue(), Genome[gene].expressionType );
  }
  return newGenotype;
}

///creates a new gene ( with random allele dominance indexes )
function createGene( value, expressionType ) {
  return new Gene( new Allele( value, Tl.rfb(0,1) ),
                   new Allele( value, Tl.rfb(0,1) ),
                   expressionType )
}

///performs meiosis (creates new child genotype from parent genotypes)
function meiosis( parentGenotype1, parentGenotype2 ) {
  var geneCollection = {};
  for ( gene in parentGenotype1 ) {  // randomly selects one allele per gene from each parent genotype
    var parent1Allele = Tl.rib(1,2) === 1 ? parentGenotype1[gene].allele1 : parentGenotype1[gene].allele2;
    var parent2Allele = Tl.rib(1,2) === 1 ? parentGenotype2[gene].allele1 : parentGenotype2[gene].allele2;
    var newAllele1 = new Allele( parent1Allele.value, parent1Allele.dominanceIndex );
    var newAllele2 = new Allele( parent2Allele.value, parent2Allele.dominanceIndex );
    var newAlleleExpressionType = parentGenotype1[gene].expressionType;
    geneCollection[gene] = new Gene( newAllele1, newAllele2, newAlleleExpressionType );
  }
  var childGenotype = new Genotype( geneCollection );
  return childGenotype;
}







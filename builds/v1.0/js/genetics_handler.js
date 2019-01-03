

///////// GENES HANDLER /////////



////---GENES---////

///first generation genome  {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{  xxx }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
function generateNewFirstGenerationPlantGenome() {
  return new Genome({
    forwardGrowthRate:  createGene( Tl.rfb(18,22), Tl.rfb(18,22), "partial" ),
    outwardGrowthRate:  createGene( Tl.rfb(0.18,0.22), Tl.rfb(0.18,0.22), "partial" ),
    maxSegmentWidth:    createGene( Tl.rfb(10,12), Tl.rfb(10,12), "partial" ),
    maxTotalSegments:   createGene( Tl.rib(8,15), Tl.rib(8,15), "complete" ),
    firstLeafSegment:   createGene( Tl.rib(2,3), Tl.rib(2,3), "complete" ),
    leafFrequency:      createGene( Tl.rib(2,3), Tl.rib(2,3), "complete" ),
    maxLeaflength:      createGene( Tl.rfb(3,7), Tl.rfb(4,7), "partial" ),
    leafGrowthRate:     createGene( Tl.rfb(1.4,1.6), Tl.rfb(1.4,1.6), "partial" ),
    leafArcHeight:      createGene( Tl.rfb(0.3,0.4), Tl.rfb(0.3,0.4), "partial" ),
    maxFlowerBaseWidth: createGene( Tl.rfb(0.95,1.05), Tl.rfb(0.95,1.05), "partial" ),
    flowerBudHeight:    createGene( Tl.rfb(0.95,1.05), Tl.rfb(0.95,1.05), "partial" ),
    flowerHue:          createGene( Tl.rib(0,260), Tl.rib(0,260),"complete" ),
    flowerSaturation:   createGene( Tl.rib(50,100),  Tl.rib(50,100), "complete" ),
    flowerLightness:    createGene( Tl.rib(35,70), Tl.rib(35,70), "complete" )
  });
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

///genome object constructor (entire genome contained on a single autosome)
function Genome( geneCollection ) {  // object collection of genes as { traitName: geneObject, ... }
  for ( gene in geneCollection ) {
    this[gene] = geneCollection[gene];
  } 
}

///phenotype (collection of expressed traits) object constructor
function Phenotype( genome ) {  // object collection of genes as { traitName: value, ... }
  for ( gene in genome ) {
    if ( genome[gene].expressionType === "complete" ) {  // expresses dominant allele value only (1,2 -> 2)
      var dominanceDifference = genome[gene].allele1.dominanceIndex - genome[gene].allele2.dominanceIndex;
      this[gene+"Value"] = dominanceDifference >= 0 ? genome[gene].allele1.value : genome[gene].allele2.value;
    } else if ( genome[gene].expressionType === "partial" ) {  // expresses average of allele values (1,2 -> 1.5)
      this[gene+"Value"] = ( genome[gene].allele1.value + genome[gene].allele2.value ) / 2;
    } else if ( genome[gene].expressionType === "co" ) {  // expresses combination of allele values (1,2 -> 1&2)
      //(handle case by case when/if need arises...)
    }
  }
}




////---FUNCTIONS---////

///creates a new gene ( with random allele dominance indexes )
function createGene( allele1Value, allele2Value, expressionType ) {
  return new Gene( new Allele( allele1Value, Tl.rfb(0,1) ),
                   new Allele( allele2Value, Tl.rfb(0,1) ),
                   expressionType )
}

///performs meiosis (creates new child genome from parent genomes)
function meiosis( parentGenome1, parentGenome2 ) {
  var geneCollection = {};
  for ( gene in parentGenome1 ) {  // randomly selects one allele per gene from each parent genome
    var parent1Allele = Tl.rib(1,2) === 1 ? parentGenome1[gene].allele1 : parentGenome1[gene].allele2;
    var parent2Allele = Tl.rib(1,2) === 1 ? parentGenome2[gene].allele1 : parentGenome2[gene].allele2;
    var newAllele1 = new Allele( parent1Allele.value, parent1Allele.dominanceIndex );
    var newAllele2 = new Allele( parent2Allele.value, parent2Allele.dominanceIndex );
    var newAlleleExpressionType = parentGenome1[gene].expressionType;
    geneCollection[gene] = new Gene( newAllele1, newAllele2, newAlleleExpressionType );
  }
  var childGenome = new Genome( geneCollection );
  return childGenome;
}







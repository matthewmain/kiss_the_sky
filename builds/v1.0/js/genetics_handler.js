

///////// GENES HANDLER /////////



////---GENES---////


///genome (an object collection of all plant genes)
var Genome = {
  maxTotalSegments:   { initialValue: function(){ return Tl.rib(4,12) },
                        mutationParameter: { range: 6, min: 2, max: null }, expressionType: "complete" },
  maxSegmentWidth:    { initialValue: function(){ return Tl.rfb(8,12) },
                        mutationParameter: { range: 2, min: 8, max: null }, expressionType: "partial" },
  firstLeafSegment:   { initialValue: function(){ return Tl.rib(2,3) },
                        mutationParameter: { range: 4, min: 2, max: null }, expressionType: "complete" },
  leafFrequency:      { initialValue: function(){ return Tl.rib(2,3) },
                        mutationParameter: { range: 2, min: 1, max: null }, expressionType: "complete" },
  maxLeafLength:      { initialValue: function(){ return Tl.rfb(4,7) },
                        mutationParameter: { range: 3, min: 4, max: null }, expressionType: "partial" },
  flowerHue:          { initialValue: function(){ return Tl.rib(0,260) },
                        mutationParameter: { range: 100, min: 0, max: 260 }, expressionType: "complete" },
  flowerSaturation:   { initialValue: function(){ return Tl.rib(50,100) },    
                        mutationParameter: { range: 20, min: 50, max: 100 }, expressionType: "complete" },
  flowerLightness:    { initialValue: function(){ return Tl.rib(35,75) },     
                        mutationParameter: { range: 20, min: 35, max: 75 }, expressionType: "complete" }
}




////---OBJECT CONSTRUCTORS---////


///allele object constructor (trait)
function Allele( value, dominanceIndex ) {
  this.value = value;
  this.dominanceIndex = dominanceIndex;
}

///gene locus object constructor (allele pair)
function Gene( allele1, allele2, mutationParameter, expressionType ) {
  this.allele1 = allele1;
  this.allele2 = allele2;
  this.mutationParameter = mutationParameter;  // (as object: { range: <range>, min: <min>, max: <max> } )
  this.expressionType = expressionType;  // (can be "complete", "co", or "partial")
}

///genotype object constructor (entire genotype contained on a single autosome)
function Genotype( genome ) {  // genome as object collection of genes as { traitName: <geneObject>, ... }
  for ( gene in genome ) {
    this[gene] = genome[gene];
  } 
}

///phenotype (collection of expressed traits) object constructor
function Phenotype( genotype ) {  // object collection of genes as { traitName: <value>, ... }
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


///creates a new gene ( with random allele dominance indexes )
function createGene( value, mutationParameter, expressionType ) {
  var dominanceIndex = Tl.rfb(0,1);
  return new Gene( new Allele( value, dominanceIndex ),
                   new Allele( value, dominanceIndex ),
                   mutationParameter,
                   expressionType )
}

function mutate( geneName, alelleValue ) {
  var ra = Genome[geneName].mutationParameter.range;  // range
  var mn = Genome[geneName].mutationParameter.min;  // min
  var mx = Genome[geneName].mutationParameter.max;  // max
  var et = Genome[geneName].expressionType;  // expression type
  var mutatedAlelleValue;
  if (et === "complete") {
    mutatedAlelleValue = Tl.rib( alelleValue-ra/2, alelleValue+ra/2 );
    if ( mutatedAlelleValue > mn && ( mx === null || mutatedAlelleValue < mx ) ) { alelleValue = mutatedAlelleValue; 
    }
  } else if ( et === "partial" || et === "co") {
    mutatedAlelleValue = Tl.rfb( alelleValue-ra/2, alelleValue+ra/2 );
    if ( mutatedAlelleValue > mn && ( mx === null || mutatedAlelleValue < mx ) ) { alelleValue = mutatedAlelleValue; }
  }
  return alelleValue;
}

///performs meiosis (creates new child genotype from parent genotypes)
function meiosis( parentGenotype1, parentGenotype2 ) {
  var geneCollection = {};
  for ( geneName in Genome ) {  // randomly selects one allele per gene from each parent genotype
    var parent1Allele = Tl.rib(1,2) === 1 ? parentGenotype1[geneName].allele1 : parentGenotype1[geneName].allele2;
    var parent2Allele = Tl.rib(1,2) === 1 ? parentGenotype2[geneName].allele1 : parentGenotype2[geneName].allele2;
    var newAllele1 = new Allele( parent1Allele.value, parent1Allele.dominanceIndex );
    var newAllele2 = new Allele( parent2Allele.value, parent2Allele.dominanceIndex );
    if ( Tl.rib( 1, mutationRate ) === 1 ) {  // handle mutations
      if ( Tl.rib(1,2) === 1 ) {
        newAllele1.value = mutate( geneName, newAllele1.value );
      } else {
        newAllele2.value = mutate( geneName, newAllele2.value );
      }
    }
    var newMutationParameter = parentGenotype1[geneName].mutationParameter;
    var newExpressionType = parentGenotype1[geneName].expressionType;
    geneCollection[geneName] = new Gene( newAllele1, newAllele2, newMutationParameter, newExpressionType );
  }
  var childGenotype = new Genotype( geneCollection );
  return childGenotype;
}




////---GENOTYPE CONSTRUCTORS---////


///random genotype
function generateRandomNewPlantGenotype() {
  var newGenotype = {};
  for ( geneName in Genome ) {
    newGenotype[geneName] = createGene( Genome[geneName].initialValue(), 
                                        Genome[geneName].mutationParameter, 
                                        Genome[geneName].expressionType );
  }
  return newGenotype;
}

///smallest plant genotype possible within size minimums
function generateSmallPlantGenotype() {
  var newGenotype = {};
  newGenotype["maxTotalSegments"] = createGene( 2, { range: 6, min: 2, max: null }, "complete" );
  newGenotype["maxSegmentWidth"] = createGene( 8, { range: 2, min: 8, max: null }, "partial" );
  newGenotype["firstLeafSegment"] = createGene( 2, { range: 4, min: 2, max: null }, "complete" );
  newGenotype["leafFrequency"] = createGene( 2, { range: 4, min: 1, max: null }, "complete" );
  newGenotype["maxLeafLength"] = createGene( 4, { range: 4, min: 0, max: null }, "partial" );
  newGenotype["flowerHue"] = createGene( Tl.rib(0,260), { range: 100, min: 0, max: 260 }, "complete" );
  newGenotype["flowerSaturation"] = createGene( Tl.rib(50,100), { range: 20, min: 50, max: 100 }, "complete" );
  newGenotype["flowerLightness"] = createGene( Tl.rib(35,75), { range: 20, min: 35, max: 75 }, "complete" );
  return newGenotype;
}

///largest plant genotype possible within initial size ranges
function generateLargePlantGenotype() {
  var newGenotype = {};
  newGenotype["maxTotalSegments"] = createGene( 12, { range: 6, min: 2, max: null }, "complete" );
  newGenotype["maxSegmentWidth"] = createGene( 12, { range: 2, min: 8, max: null }, "partial" );
  newGenotype["firstLeafSegment"] = createGene( 3, { range: 4, min: 2, max: null }, "complete" );
  newGenotype["leafFrequency"] = createGene( 2, { range: 4, min: 1, max: null }, "complete" );
  newGenotype["maxLeafLength"] = createGene( 7, { range: 4, min: 0, max: null }, "partial" );
  newGenotype["flowerHue"] = createGene( Tl.rib(0,260), { range: 100, min: 0, max: 260 }, "complete" );
  newGenotype["flowerSaturation"] = createGene( Tl.rib(50,100), { range: 20, min: 50, max: 100 }, "complete" );
  newGenotype["flowerLightness"] = createGene( Tl.rib(35,75), { range: 10, min: 35, max: 75 }, "complete" );
  return newGenotype;
}

///tiny white flower
function generateTinyWhiteFlowerGenotype() {
  var newGenotype = {};
  newGenotype["maxTotalSegments"] = createGene( 2, { range: 6, min: 2, max: null }, "complete" );
  newGenotype["maxSegmentWidth"] = createGene( 8, { range: 2, min: 8, max: null }, "partial" );
  newGenotype["firstLeafSegment"] = createGene( 2, { range: 4, min: 2, max: null }, "complete" );
  newGenotype["leafFrequency"] = createGene( 2, { range: 4, min: 1, max: null }, "complete" );
  newGenotype["maxLeafLength"] = createGene( 4, { range: 4, min: 0, max: null }, "partial" );
  newGenotype["flowerHue"] = createGene( Tl.rib(0,260), { range: 100, min: 0, max: 260 }, "complete" );
  newGenotype["flowerSaturation"] = createGene( Tl.rib(50,100), { range: 20, min: 50, max: 100 }, "complete" );
  newGenotype["flowerLightness"] = createGene( 75, { range: 20, min: 35, max: 75 }, "complete" );
  return newGenotype;
}










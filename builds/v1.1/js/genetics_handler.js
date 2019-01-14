

///////// GENES HANDLER /////////



////---GENES---////


///genome (an object collection of all plant genes)
var Genome = {
  maxTotalSegments:   { initialValue: function(){ return Tl.rib(4,12); },
                        mutationParameter: { range: 6, min: 2, max: null }, expressionType: "complete" },
  maxSegmentWidth:    { initialValue: function(){ return Tl.rfb(8,12); },
                        mutationParameter: { range: 2, min: 8, max: null }, expressionType: "partial" },
  stalkStrength:      { initialValue: function(){ return Tl.rfb(0.8,0.9); },
                        mutationParameter: { range: 0.2, min: 0.8, max: 1.2 }, expressionType: "partial" },
  firstLeafSegment:   { initialValue: function(){ return Tl.rib(2,3); },
                        mutationParameter: { range: 4, min: 2, max: null }, expressionType: "complete" },
  leafFrequency:      { initialValue: function(){ return Tl.rib(2,3); },
                        mutationParameter: { range: 2, min: 2, max: null }, expressionType: "complete" },
  maxLeafLength:      { initialValue: function(){ return Tl.rfb(4,7); },
                        mutationParameter: { range: 3, min: 4, max: null }, expressionType: "partial" },
  flowerHue:          { initialValue: function(){ return Tl.rib(0,260); },
                        mutationParameter: { range: 100, min: 0, max: 260 }, expressionType: "complete" },
  flowerSaturation:   { initialValue: function(){ return Tl.rib(50,100); },    
                        mutationParameter: { range: 20, min: 50, max: 100 }, expressionType: "complete" },
  flowerLightness:    { initialValue: function(){ return Tl.rib(35,75); },     
                        mutationParameter: { range: 30, min: 35, max: 75 }, expressionType: "complete" }
};




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
  for ( var gene in genome ) {
    this[gene] = genome[gene];
  } 
}

///phenotype (collection of expressed traits) object constructor
function Phenotype( genotype ) {  // object collection of genes as { traitName: <value>, ... }
  for ( var gene in genotype ) {
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
                   expressionType );
}

function mutate( geneName, alelleValue ) {
  var ra = Genome[geneName].mutationParameter.range;  // range
  var mn = Genome[geneName].mutationParameter.min;  // min
  var mx = Genome[geneName].mutationParameter.max;  // max
  var et = Genome[geneName].expressionType;  // expression type
  var mutatedAlelleVal;
  if (et === "complete") {
    mutatedAlelleVal = Tl.rib( alelleValue-ra/2, alelleValue+ra/2 );
    if ( mutatedAlelleVal >= mn && ( mx === null || mutatedAlelleVal <= mx ) ) { alelleValue = mutatedAlelleVal; }
  } else if ( et === "partial" || et === "co") {
    mutatedAlelleVal = Tl.rfb( alelleValue-ra/2, alelleValue+ra/2 );
    if ( mutatedAlelleVal >= mn && ( mx === null || mutatedAlelleVal <= mx ) ) { alelleValue = mutatedAlelleVal; }
  }
  return alelleValue;
}

///performs meiosis (creates new child genotype from parent genotypes)
function meiosis( parentGenotype1, parentGenotype2 ) {
  var geneCollection = {};
  for ( var geneName in Genome ) {  // randomly selects one allele per gene from each parent genotype
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
  for ( var geneName in Genome ) {
    newGenotype[geneName] = createGene( Genome[geneName].initialValue(), 
                                        Genome[geneName].mutationParameter, 
                                        Genome[geneName].expressionType );
  }
  return newGenotype;
}

///smallest plant genotype possible within size minimums
function generateSmallPlantGenotype() {
  var newGenotype = {};
  newGenotype.maxTotalSegments = createGene( 2, { range: 6, min: 2, max: null }, "complete" );
  newGenotype.maxSegmentWidth = createGene( 8, { range: 2, min: 8, max: null }, "partial" );
  newGenotype.stalkStrength = createGene( 1, { range: 1, min: 1, max: 1.5 }, "partial" );
  newGenotype.firstLeafSegment = createGene( 2, { range: 4, min: 2, max: null }, "complete" );
  newGenotype.leafFrequency = createGene( 2, { range: 2, min: 2, max: null }, "complete" );
  newGenotype.maxLeafLength = createGene( 4, { range: 4, min: 0, max: null }, "partial" );
  newGenotype.flowerHue = createGene( Tl.rib(0,260), { range: 100, min: 0, max: 260 }, "complete" );
  newGenotype.flowerSaturation = createGene( Tl.rib(50,100), { range: 20, min: 50, max: 100 }, "complete" );
  newGenotype.flowerLightness = createGene( Tl.rib(35,75), { range: 20, min: 35, max: 75 }, "complete" );
  return newGenotype;
}

///mid values of initial size ranges
function generateMediumPlantGenotype() {
  var newGenotype = {};
  newGenotype.maxTotalSegments = createGene( 7, { range: 6, min: 2, max: null }, "complete" );
  newGenotype.maxSegmentWidth = createGene( 10, { range: 2, min: 8, max: null }, "partial" );
  newGenotype.stalkStrength = createGene( 1, { range: 1, min: 1, max: 1.5 }, "partial" );
  newGenotype.firstLeafSegment = createGene( 2, { range: 4, min: 2, max: null }, "complete" );
  newGenotype.leafFrequency = createGene( 2, { range: 2, min: 2, max: null }, "complete" );
  newGenotype.maxLeafLength = createGene( 5.5, { range: 4, min: 0, max: null }, "partial" );
  newGenotype.flowerHue = createGene( Tl.rib(0,260), { range: 100, min: 0, max: 260 }, "complete" );
  newGenotype.flowerSaturation = createGene( Tl.rib(50,100), { range: 20, min: 50, max: 100 }, "complete" );
  newGenotype.flowerLightness = createGene( Tl.rib(35,75), { range: 10, min: 35, max: 75 }, "complete" );
  return newGenotype;
}

///largest plant genotype possible within initial size ranges
function generateLargePlantGenotype() {
  var newGenotype = {};
  newGenotype.maxTotalSegments = createGene( 12, { range: 6, min: 2, max: null }, "complete" );
  newGenotype.maxSegmentWidth = createGene( 12, { range: 2, min: 8, max: null }, "partial" );
  newGenotype.stalkStrength = createGene( 1, { range: 1, min: 1, max: 1.5 }, "partial" );
  newGenotype.firstLeafSegment = createGene( 3, { range: 4, min: 2, max: null }, "complete" );
  newGenotype.leafFrequency = createGene( 2, { range: 2, min: 2, max: null }, "complete" );
  newGenotype.maxLeafLength = createGene( 7, { range: 4, min: 0, max: null }, "partial" );
  newGenotype.flowerHue = createGene( Tl.rib(0,260), { range: 100, min: 0, max: 260 }, "complete" );
  newGenotype.flowerSaturation = createGene( Tl.rib(50,100), { range: 20, min: 50, max: 100 }, "complete" );
  newGenotype.flowerLightness = createGene( Tl.rib(35,75), { range: 10, min: 35, max: 75 }, "complete" );
  return newGenotype;
}

///huge plant genotype
function generateHugePlantGenotype() {
  var newGenotype = {};
  newGenotype.maxTotalSegments = createGene( 10, { range: 6, min: 2, max: null }, "complete" );
  newGenotype.maxSegmentWidth = createGene( 30, { range: 2, min: 8, max: null }, "partial" );
  newGenotype.stalkStrength = createGene( 1, { range: 1, min: 1, max: 1.5 }, "partial" );
  newGenotype.firstLeafSegment = createGene( 2, { range: 4, min: 2, max: null }, "complete" );
  newGenotype.leafFrequency = createGene( 3, { range: 4, min: 1, max: null }, "complete" );
  newGenotype.maxLeafLength = createGene( 9, { range: 4, min: 0, max: null }, "partial" );
  newGenotype.flowerHue = createGene( Tl.rib(0,260), { range: 100, min: 0, max: 260 }, "complete" );
  newGenotype.flowerSaturation = createGene( Tl.rib(50,100), { range: 20, min: 50, max: 100 }, "complete" );
  newGenotype.flowerLightness = createGene( Tl.rib(35,75), { range: 10, min: 35, max: 75 }, "complete" );
  return newGenotype;
}

///tiny white flower plant genotype
function generateTinyWhiteFlowerPlantGenotype() {
  var newGenotype = {};
  newGenotype.maxTotalSegments = createGene( 2, { range: 6, min: 2, max: null }, "complete" );
  newGenotype.maxSegmentWidth = createGene( 8, { range: 2, min: 8, max: null }, "partial" );
  newGenotype.stalkStrength = createGene( 1, { range: 1, min: 1, max: 1.5 }, "partial" );
  newGenotype.firstLeafSegment = createGene( 2, { range: 4, min: 2, max: null }, "complete" );
  newGenotype.leafFrequency = createGene( 2, { range: 2, min: 2, max: null }, "complete" );
  newGenotype.maxLeafLength = createGene( 4, { range: 4, min: 0, max: null }, "partial" );
  newGenotype.flowerHue = createGene( Tl.rib(0,260), { range: 100, min: 0, max: 260 }, "complete" );
  newGenotype.flowerSaturation = createGene( Tl.rib(50,100), { range: 20, min: 50, max: 100 }, "complete" );
  newGenotype.flowerLightness = createGene( 75, { range: 20, min: 35, max: 75 }, "complete" );
  return newGenotype;
}

///tall plant genotype
function generateTallPlantGenotype( stalkStrength ) {
  var newGenotype = {};
  newGenotype.maxTotalSegments = createGene( 25, { range: 6, min: 2, max: null }, "complete" );
  newGenotype.maxSegmentWidth = createGene( 10, { range: 2, min: 8, max: null }, "partial" );
  newGenotype.stalkStrength = createGene( stalkStrength, { range: 2, min: 1, max: 3 }, "partial" );
  newGenotype.firstLeafSegment = createGene( 2, { range: 4, min: 2, max: null }, "complete" );
  newGenotype.leafFrequency = createGene( 2, { range: 2, min: 2, max: null }, "complete" );
  newGenotype.maxLeafLength = createGene( 5, { range: 4, min: 0, max: null }, "partial" );
  newGenotype.flowerHue = createGene( Tl.rib(0,260), { range: 100, min: 0, max: 260 }, "complete" );
  newGenotype.flowerSaturation = createGene( Tl.rib(50,100), { range: 20, min: 50, max: 100 }, "complete" );
  newGenotype.flowerLightness = createGene( Tl.rib(35,75), { range: 10, min: 35, max: 75 }, "complete" );
  return newGenotype;
}










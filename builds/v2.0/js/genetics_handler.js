

///////// GENETICS HANDLER /////////



//// Genome ////

var skyPlantGenome = EV.addGenome( "skyPlant", "autogamous" );


//// Genes ////

EV.addGene( skyPlantGenome, "maxTotalSegments", "complete", "count", 8, 5, 6, 2, null );
EV.addGene( skyPlantGenome, "maxSegmentWidth", "partial", "scale", 8, 5, 4, 8, null );
EV.addGene( skyPlantGenome, "stalkStrength", "partial", "scale", 0.8, 5, 0.1, 0.7, 0.8 );
EV.addGene( skyPlantGenome, "firstLeafSegment", "complete", "count", 3, 5, 4, 2, null );
EV.addGene( skyPlantGenome, "leafFrequency", "complete", "count", 2, 5, 2, 2, null );
EV.addGene( skyPlantGenome, "maxLeafLength", "partial", "scale", 5.5, 5, 3, 4, null );
EV.addGene( skyPlantGenome, "flowerHue", "complete", "count", 130, 5, 50, 0, 260 );  // (Plant() corrects for greens)
EV.addGene( skyPlantGenome, "flowerLightness", "complete", "count", 55, 5, 30, 30, 75 );


//// Functions ////

function assignRandomFlowerColor( genotype ) {
  genotype.genes.flowerHue.allele1.value = Tl.rib(0, 260);
  genotype.genes.flowerHue.allele2.value = Tl.rib(0, 260);
  genotype.genes.flowerLightness.allele1.value = Tl.rib(30,75);
  genotype.genes.flowerLightness.allele2.value = Tl.rib(30,75);
}


//// Custom First-Generation Genotypes ////

function generateRandomPlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( EV.species.skyPlant );
  assignRandomFlowerColor( newGenotype );
  return newGenotype;
}

function generateRandomRedFlowerPlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( EV.species.skyPlant );
  newGenotype.genes.flowerHue.allele1.value = Tl.rib(1,2) === 1 ? Tl.rib(0,5) : Tl.rib(255, 260);
  newGenotype.genes.flowerHue.allele2.value = Tl.rib(1,2) === 1 ? Tl.rib(0,5) : Tl.rib(255, 260);
  newGenotype.genes.flowerLightness.allele1.value = Tl.rib(30,40);
  newGenotype.genes.flowerLightness.allele2.value = Tl.rib(30,40);
  return newGenotype;
}

function generateTinyWhiteFlowerPlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( EV.species.skyPlant );
  newGenotype.genes.maxTotalSegments.allele1.value = newGenotype.genes.maxTotalSegments.allele2.value = 2;
  newGenotype.genes.maxSegmentWidth.allele1.value = newGenotype.genes.maxSegmentWidth.allele2.value = 8;
  newGenotype.genes.firstLeafSegment.allele1.value = newGenotype.genes.firstLeafSegment.allele2.value = 2;
  newGenotype.genes.leafFrequency.allele1.value = newGenotype.genes.leafFrequency.allele2.value = 2;
  newGenotype.genes.maxLeafLength.allele1.value = newGenotype.genes.maxLeafLength.allele2.value = 4;
  newGenotype.genes.flowerHue.allele1.value = Tl.rib(0, 260);
  newGenotype.genes.flowerHue.allele2.value = Tl.rib(0, 260);
  newGenotype.genes.flowerLightness.allele1.value = newGenotype.genes.flowerLightness.allele2.value = 75;
  return newGenotype;
}

function generateSmallPlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( EV.species.skyPlant );
  newGenotype.genes.maxTotalSegments.allele1.value = newGenotype.genes.maxTotalSegments.allele2.value = 2;
  newGenotype.genes.maxSegmentWidth.allele1.value = newGenotype.genes.maxSegmentWidth.allele2.value = 8;
  newGenotype.genes.firstLeafSegment.allele1.value = newGenotype.genes.firstLeafSegment.allele2.value = 2;
  newGenotype.genes.leafFrequency.allele1.value = newGenotype.genes.leafFrequency.allele2.value = 2;
  newGenotype.genes.maxLeafLength.allele1.value = newGenotype.genes.maxLeafLength.allele2.value = 4;
  assignRandomFlowerColor( newGenotype );
  return newGenotype;
}

function generateMediumPlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( EV.species.skyPlant );
  newGenotype.genes.maxTotalSegments.allele1.value = newGenotype.genes.maxTotalSegments.allele2.value = 7;
  newGenotype.genes.maxSegmentWidth.allele1.value = newGenotype.genes.maxSegmentWidth.allele2.value = 10;
  newGenotype.genes.maxLeafLength.allele1.value = newGenotype.genes.maxLeafLength.allele2.value = 5.5;
  assignRandomFlowerColor( newGenotype );
  return newGenotype;
}

function generateLargePlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( EV.species.skyPlant );
  newGenotype.genes.maxTotalSegments.allele1.value = newGenotype.genes.maxTotalSegments.allele2.value = 12;
  newGenotype.genes.maxSegmentWidth.allele1.value = newGenotype.genes.maxSegmentWidth.allele2.value = 12;
  newGenotype.genes.maxLeafLength.allele1.value = newGenotype.genes.maxLeafLength.allele2.value = 7;
  assignRandomFlowerColor( newGenotype );
  return newGenotype;
}

function generateTallPlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( EV.species.skyPlant );
  newGenotype.genes.maxTotalSegments.allele1.value = newGenotype.genes.maxTotalSegments.allele2.value = 25;
  newGenotype.genes.maxSegmentWidth.allele1.value = newGenotype.genes.maxSegmentWidth.allele2.value = 10;
  newGenotype.genes.stalkStrength.allele1.value = newGenotype.genes.stalkStrength.allele2.value = 1;
  newGenotype.genes.maxLeafLength.allele1.value = newGenotype.genes.maxLeafLength.allele2.value = 5;
  assignRandomFlowerColor( newGenotype );
  return newGenotype;
}

function generateHugePlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( EV.species.skyPlant );
  newGenotype.genes.maxTotalSegments.allele1.value = newGenotype.genes.maxTotalSegments.allele2.value = 25;
  newGenotype.genes.maxSegmentWidth.allele1.value = newGenotype.genes.maxSegmentWidth.allele2.value = 30;
  newGenotype.genes.maxLeafLength.allele1.value = newGenotype.genes.maxLeafLength.allele2.value = 9;
  assignRandomFlowerColor( newGenotype );
  return newGenotype;
}

function generateHugeRedPlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( EV.species.skyPlant );
  newGenotype.genes.maxTotalSegments.allele1.value = newGenotype.genes.maxTotalSegments.allele2.value = 11;
  newGenotype.genes.maxSegmentWidth.allele1.value = newGenotype.genes.maxSegmentWidth.allele2.value = 30;
  newGenotype.genes.maxLeafLength.allele1.value = newGenotype.genes.maxLeafLength.allele2.value = 9;
  newGenotype.genes.flowerHue.allele1.value = newGenotype.genes.flowerHue.allele2.value = 0;
  newGenotype.genes.flowerLightness.allele1.value = newGenotype.genes.flowerLightness.allele2.value = 35;
  return newGenotype;
}










// /////---GENES---/////


// ///genome (an object collection of all plant genes)
// var Genome = {
//   maxTotalSegments:   { initialValue: function(){ return Tl.rib(4,12); },
//                         mutationParameter: { range: 6, min: 2, max: null }, expressionType: "complete" },
//   maxSegmentWidth:    { initialValue: function(){ return Tl.rfb(8,12); },
//                         mutationParameter: { range: 4, min: 8, max: null }, expressionType: "partial" },
//   stalkStrength:      { initialValue: function(){ return Tl.rfb(0.7,0.8); },
//                         mutationParameter: { range: 0.2, min: 0.7, max: 1 }, expressionType: "partial" },
//   firstLeafSegment:   { initialValue: function(){ return Tl.rib(2,3); },
//                         mutationParameter: { range: 4, min: 2, max: null }, expressionType: "complete" },
//   leafFrequency:      { initialValue: function(){ return Tl.rib(2,3); },
//                         mutationParameter: { range: 2, min: 2, max: null }, expressionType: "complete" },
//   maxLeafLength:      { initialValue: function(){ return Tl.rfb(4,7); },
//                         mutationParameter: { range: 3, min: 4, max: null}, expressionType: "partial" },
//   flowerHue:          { initialValue: function(){ return Tl.rib(0,260); },  // (corrected for greens in Plant())
//                         mutationParameter: { range: 50, min: 0, max: 260 }, expressionType: "complete" },
//   flowerLightness:    { initialValue: function(){ return Tl.rib(30,75); },  // (corrected for off whites in Plant())   
//                         mutationParameter: { range: 30, min: 30, max: 75 }, expressionType: "complete" }
// };




// /////---OBJECT CONSTRUCTORS---/////


// ///allele object constructor (trait)
// function Allele( value, dominanceIndex ) {
//   this.value = value;
//   this.dominanceIndex = dominanceIndex;
// }

// ///gene locus object constructor (allele pair)
// function Gene( allele1, allele2, mutationParameter, expressionType ) {
//   this.allele1 = allele1;
//   this.allele2 = allele2;
//   this.mutationParameter = mutationParameter;  // (as object: { range: <range>, min: <min>, max: <max> } )
//   this.expressionType = expressionType;  // (can be "complete", "co", or "partial")
// }

// ///genotype object constructor (entire genotype contained on a single autosome)
// function Genotype( genome ) {  // genome as object collection of genes as { traitName: <geneObject>, ... }
//   for ( var gene in genome ) {
//     this[gene] = genome[gene];
//   } 
// }

// ///phenotype (collection of expressed traits) object constructor
// function Phenotype( genotype ) {  // object collection of genes as { traitName: <value>, ... }
//   for ( var gene in genotype ) {
//     if ( genotype[gene].expressionType === "complete" ) {  // expresses dominant allele value only (1,2 -> 2)
//       var dominanceDifference = genotype[gene].allele1.dominanceIndex - genotype[gene].allele2.dominanceIndex;
//       this[gene+"Value"] = dominanceDifference >= 0 ? genotype[gene].allele1.value : genotype[gene].allele2.value;
//     } else if ( genotype[gene].expressionType === "partial" ) {  // expresses average of allele values (1,2 -> 1.5)
//       this[gene+"Value"] = ( genotype[gene].allele1.value + genotype[gene].allele2.value ) / 2;
//     } else if ( genotype[gene].expressionType === "co" ) {  // expresses combination of allele values (1,2 -> 1&2)
//       //(handle case by case when/if need arises...)
//     }
//   }
// }




// /////---FUNCTIONS---/////


// ///creates a new gene ( with random allele dominance indexes )
// function createGene( value, mutationParameter, expressionType ) {
//   var dominanceIndex = Tl.rfb(0,1);
//   return new Gene( new Allele( value, dominanceIndex ),
//                    new Allele( value, dominanceIndex ),
//                    mutationParameter,
//                    expressionType );
// }

// function mutate( geneName, alelleValue ) {
//   var ra = Genome[geneName].mutationParameter.range;  // range
//   var mn = Genome[geneName].mutationParameter.min;  // min
//   var mx = Genome[geneName].mutationParameter.max;  // max
//   var et = Genome[geneName].expressionType;  // expression type
//   var mutatedAlelleVal;
//   if (et === "complete") {
//     mutatedAlelleVal = Tl.rib( alelleValue-ra/2, alelleValue+ra/2 );
//     if ( mutatedAlelleVal >= mn && ( mx === null || mutatedAlelleVal <= mx ) ) { alelleValue = mutatedAlelleVal; }
//   } else if ( et === "partial" || et === "co") {
//     mutatedAlelleVal = Tl.rfb( alelleValue-ra/2, alelleValue+ra/2 );
//     if ( mutatedAlelleVal >= mn && ( mx === null || mutatedAlelleVal <= mx ) ) { alelleValue = mutatedAlelleVal; }
//   }
//   return alelleValue;
// }

// ///performs meiosis (creates new child genotype from parent genotypes)
// function meiosis( parentGenotype1, parentGenotype2 ) {
//   var geneCollection = {};
//   for ( var geneName in Genome ) {  // randomly selects one allele per gene from each parent genotype
//     var parent1Allele = Tl.rib(1,2) === 1 ? parentGenotype1[geneName].allele1 : parentGenotype1[geneName].allele2;
//     var parent2Allele = Tl.rib(1,2) === 1 ? parentGenotype2[geneName].allele1 : parentGenotype2[geneName].allele2;
//     var newAllele1 = new Allele( parent1Allele.value, parent1Allele.dominanceIndex );
//     var newAllele2 = new Allele( parent2Allele.value, parent2Allele.dominanceIndex );
//     if ( Tl.rib( 1, mutationRate ) === 1 ) {  // handle mutations
//       if ( Tl.rib(1,2) === 1 ) {
//         newAllele1.value = mutate( geneName, newAllele1.value );
//       } else {
//         newAllele2.value = mutate( geneName, newAllele2.value );
//       }
//     }
//     var newMutationParameter = parentGenotype1[geneName].mutationParameter;
//     var newExpressionType = parentGenotype1[geneName].expressionType;
//     geneCollection[geneName] = new Gene( newAllele1, newAllele2, newMutationParameter, newExpressionType );
//   }
//   var childGenotype = new Genotype( geneCollection );
//   return childGenotype;
// }




// /////---GENOTYPE GENERATORS---/////


// ///random genotype
// function generateRandomNewPlantGenotype() {
//   var newGenotype = {};
//   for ( var geneName in Genome ) {
//     newGenotype[geneName] = createGene( Genome[geneName].initialValue(), 
//                                         Genome[geneName].mutationParameter, 
//                                         Genome[geneName].expressionType );
//   }
//   return newGenotype;
// }

// ///random red flower plant genotype
// function generateRandomRedFlowerPlantGenotype() {
//   var redHue = Tl.rib(1,2) === 1 ? Tl.rib(0,5) : Tl.rib(255, 260);
//   var newGenotype = {};
//   newGenotype.maxTotalSegments = createGene( Tl.rib(4,12), { range: 6, min: 2, max: null }, "complete" );
//   newGenotype.maxSegmentWidth = createGene( Tl.rfb(8,12), { range: 4, min: 8, max: null }, "partial" );
//   newGenotype.stalkStrength = createGene( Tl.rfb(0.7,0.8), { range: 0.2, min: 0.7, max: 1 }, "partial" );
//   newGenotype.firstLeafSegment = createGene( Tl.rib(2,3), { range: 4, min: 2, max: null }, "complete" );
//   newGenotype.leafFrequency = createGene( Tl.rib(2,3), { range: 2, min: 2, max: null }, "complete" );
//   newGenotype.maxLeafLength = createGene( Tl.rfb(4,7), { range: 4, min: 0, max: null }, "partial" );
//   newGenotype.flowerHue = createGene( redHue, { range: 50, min: 0, max: 260 }, "complete" );
//   newGenotype.flowerLightness = createGene( Tl.rib(30,40), { range: 30, min: 30, max: 75 }, "complete" );
//   return newGenotype;
// }

// ///tiny white flower plant genotype
// function generateTinyWhiteFlowerPlantGenotype() {
//   var newGenotype = {};
//   newGenotype.maxTotalSegments = createGene( 2, { range: 6, min: 2, max: null }, "complete" );
//   newGenotype.maxSegmentWidth = createGene( 8, { range: 4, min: 8, max: null }, "partial" );
//   newGenotype.stalkStrength = createGene( 0.8, { range: 0.2, min: 0.7, max: 1 }, "partial" );
//   newGenotype.firstLeafSegment = createGene( 2, { range: 4, min: 2, max: null }, "complete" );
//   newGenotype.leafFrequency = createGene( 2, { range: 2, min: 2, max: null }, "complete" );
//   newGenotype.maxLeafLength = createGene( 4, { range: 4, min: 0, max: null }, "partial" );
//   newGenotype.flowerHue = createGene( Tl.rib(0,260), { range: 50, min: 0, max: 260 }, "complete" );
//   newGenotype.flowerLightness = createGene( 75, { range: 30, min: 30, max: 75 }, "complete" );
//   return newGenotype;
// }

// ///smallest plant genotype possible within size minimums
// function generateSmallPlantGenotype() {
//   var newGenotype = {};
//   newGenotype.maxTotalSegments = createGene( 2, { range: 6, min: 2, max: null }, "complete" );
//   newGenotype.maxSegmentWidth = createGene( 8, { range: 4, min: 8, max: null }, "partial" );
//   newGenotype.stalkStrength = createGene( 0.8, { range: 0.2, min: 0.7, max: 1 }, "partial" );
//   newGenotype.firstLeafSegment = createGene( 2, { range: 4, min: 2, max: null }, "complete" );
//   newGenotype.leafFrequency = createGene( 2, { range: 2, min: 2, max: null }, "complete" );
//   newGenotype.maxLeafLength = createGene( 4, { range: 4, min: 0, max: null }, "partial" );
//   newGenotype.flowerHue = createGene( Tl.rib(0,260), { range: 50, min: 0, max: 260 }, "complete" );
//   newGenotype.flowerLightness = createGene( Tl.rib(30,75), { range: 30, min: 30, max: 75 }, "complete" );
//   return newGenotype;
// }

// ///mid values of initial size ranges
// function generateMediumPlantGenotype() {
//   var newGenotype = {};
//   newGenotype.maxTotalSegments = createGene( 7, { range: 6, min: 2, max: null }, "complete" );
//   newGenotype.maxSegmentWidth = createGene( 10, { range: 4, min: 8, max: null }, "partial" );
//   newGenotype.stalkStrength = createGene( 0.8, { range: 0.2, min: 0.7, max: 1 }, "partial" );
//   newGenotype.firstLeafSegment = createGene( 2, { range: 4, min: 2, max: null }, "complete" );
//   newGenotype.leafFrequency = createGene( 2, { range: 2, min: 2, max: null }, "complete" );
//   newGenotype.maxLeafLength = createGene( 5.5, { range: 4, min: 0, max: null }, "partial" );
//   newGenotype.flowerHue = createGene( Tl.rib(0,260), { range: 50, min: 0, max: 260 }, "complete" );
//   newGenotype.flowerLightness = createGene( Tl.rib(30,75), { range: 30, min: 30, max: 75 }, "complete" );
//   return newGenotype;
// }

// ///largest plant genotype possible within initial size ranges
// function generateLargePlantGenotype() {
//   var newGenotype = {};
//   newGenotype.maxTotalSegments = createGene( 12, { range: 6, min: 2, max: null }, "complete" );
//   newGenotype.maxSegmentWidth = createGene( 12, { range: 4, min: 8, max: null }, "partial" );
//   newGenotype.stalkStrength = createGene( 0.8, { range: 0.2, min: 0.7, max: 1 }, "partial" );
//   newGenotype.firstLeafSegment = createGene( 3, { range: 4, min: 2, max: null }, "complete" );
//   newGenotype.leafFrequency = createGene( 2, { range: 2, min: 2, max: null }, "complete" );
//   newGenotype.maxLeafLength = createGene( 7, { range: 4, min: 0, max: null }, "partial" );
//   newGenotype.flowerHue = createGene( Tl.rib(0,260), { range: 50, min: 0, max: 260 }, "complete" );
//   newGenotype.flowerLightness = createGene( Tl.rib(30,75), { range: 30, min: 30, max: 75 }, "complete" );
//   return newGenotype;
// }

// ///tall plant genotype
// function generateTallPlantGenotype( stalkStrength ) {
//   var newGenotype = {};
//   newGenotype.maxTotalSegments = createGene( 25, { range: 6, min: 2, max: null }, "complete" );
//   newGenotype.maxSegmentWidth = createGene( 10, { range: 4, min: 8, max: null }, "partial" );
//   newGenotype.stalkStrength = createGene( stalkStrength, { range: 0.2, min: 0.7, max: 1 }, "partial" );
//   newGenotype.firstLeafSegment = createGene( 2, { range: 4, min: 2, max: null }, "complete" );
//   newGenotype.leafFrequency = createGene( 2, { range: 2, min: 2, max: null }, "complete" );
//   newGenotype.maxLeafLength = createGene( 5, { range: 4, min: 0, max: null }, "partial" );
//   newGenotype.flowerHue = createGene( Tl.rib(0,260), { range: 50, min: 0, max: 260 }, "complete" );
//   newGenotype.flowerLightness = createGene( Tl.rib(30,75), { range: 30, min: 30, max: 75 }, "complete" );
//   return newGenotype;
// }

// ///huge plant genotype
// function generateHugePlantGenotype() {
//   var newGenotype = {};
//   newGenotype.maxTotalSegments = createGene( 10, { range: 6, min: 2, max: null }, "complete" );
//   newGenotype.maxSegmentWidth = createGene( 30, { range: 4, min: 8, max: null }, "partial" );
//   newGenotype.stalkStrength = createGene( 0.8, { range: 0.2, min: 0.7, max: 1 }, "partial" );
//   newGenotype.firstLeafSegment = createGene( 2, { range: 4, min: 2, max: null }, "complete" );
//   newGenotype.leafFrequency = createGene( 3, { range: 4, min: 1, max: null }, "complete" );
//   newGenotype.maxLeafLength = createGene( 9, { range: 4, min: 0, max: null }, "partial" );
//   newGenotype.flowerHue = createGene( Tl.rib(0,260), { range: 50, min: 0, max: 260 }, "complete" );
//   newGenotype.flowerLightness = createGene( Tl.rib(30,75), { range: 30, min: 30, max: 75 }, "complete" );
//   return newGenotype;
// }

// ///huge red plant genotype
// function generateHugeRedPlantGenotype() {
//   var redHue = Tl.rib(1,2) === 1 ? Tl.rib(0,5) : Tl.rib(255, 260);
//   var newGenotype = {};
//   newGenotype.maxTotalSegments = createGene( 10, { range: 6, min: 2, max: null }, "complete" );
//   newGenotype.maxSegmentWidth = createGene( 30, { range: 4, min: 8, max: null }, "partial" );
//   newGenotype.stalkStrength = createGene( 0.8, { range: 0.2, min: 0.7, max: 1 }, "partial" );
//   newGenotype.firstLeafSegment = createGene( 2, { range: 4, min: 2, max: null }, "complete" );
//   newGenotype.leafFrequency = createGene( 3, { range: 4, min: 1, max: null }, "complete" );
//   newGenotype.maxLeafLength = createGene( 9, { range: 4, min: 0, max: null }, "partial" );
//   newGenotype.flowerHue = createGene( redHue, { range: 50, min: 0, max: 260 }, "complete" );
//   newGenotype.flowerLightness = createGene( Tl.rib(30,50), { range: 30, min: 30, max: 75 }, "complete" );
//   return newGenotype;
// }










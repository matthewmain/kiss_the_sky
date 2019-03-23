

/////////////////// GENETICS HANDLER //////////////////





/////---EvolveJS---/////


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





/////---Functions---/////


function assignRandomFlowerColor( genotype ) {
  genotype.genes.flowerHue.allele1.value = Tl.rib(0, 260);
  genotype.genes.flowerHue.allele2.value = Tl.rib(0, 260);
  genotype.genes.flowerLightness.allele1.value = Tl.rib(30,75);
  genotype.genes.flowerLightness.allele2.value = Tl.rib(30,75);
}





/////---Custom First-Generation Genotype Generators---/////


function generateRandomPlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( skyPlantGenome );
  assignRandomFlowerColor( newGenotype );
  return newGenotype;
}

function generateRandomRedFlowerPlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( skyPlantGenome );
  newGenotype.genes.flowerHue.allele1.value = Tl.rib(1,2) === 1 ? Tl.rib(0,5) : Tl.rib(255, 260);
  newGenotype.genes.flowerHue.allele2.value = Tl.rib(1,2) === 1 ? Tl.rib(0,5) : Tl.rib(255, 260);
  newGenotype.genes.flowerLightness.allele1.value = Tl.rib(30,40);
  newGenotype.genes.flowerLightness.allele2.value = Tl.rib(30,40);
  return newGenotype;
}

function generateTinyWhiteFlowerPlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( skyPlantGenome );
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
  var newGenotype = EV.newRandomizedFirstGenGenotype( skyPlantGenome );
  newGenotype.genes.maxTotalSegments.allele1.value = newGenotype.genes.maxTotalSegments.allele2.value = 2;
  newGenotype.genes.maxSegmentWidth.allele1.value = newGenotype.genes.maxSegmentWidth.allele2.value = 8;
  newGenotype.genes.firstLeafSegment.allele1.value = newGenotype.genes.firstLeafSegment.allele2.value = 2;
  newGenotype.genes.leafFrequency.allele1.value = newGenotype.genes.leafFrequency.allele2.value = 2;
  newGenotype.genes.maxLeafLength.allele1.value = newGenotype.genes.maxLeafLength.allele2.value = 4;
  assignRandomFlowerColor( newGenotype );
  return newGenotype;
}

function generateMediumPlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( skyPlantGenome );
  newGenotype.genes.maxTotalSegments.allele1.value = newGenotype.genes.maxTotalSegments.allele2.value = 7;
  newGenotype.genes.maxSegmentWidth.allele1.value = newGenotype.genes.maxSegmentWidth.allele2.value = 10;
  newGenotype.genes.maxLeafLength.allele1.value = newGenotype.genes.maxLeafLength.allele2.value = 5.5;
  assignRandomFlowerColor( newGenotype );
  return newGenotype;
}

function generateLargePlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( skyPlantGenome );
  newGenotype.genes.maxTotalSegments.allele1.value = newGenotype.genes.maxTotalSegments.allele2.value = 12;
  newGenotype.genes.maxSegmentWidth.allele1.value = newGenotype.genes.maxSegmentWidth.allele2.value = 12;
  newGenotype.genes.maxLeafLength.allele1.value = newGenotype.genes.maxLeafLength.allele2.value = 7;
  assignRandomFlowerColor( newGenotype );
  return newGenotype;
}

function generateTallPlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( skyPlantGenome );
  newGenotype.genes.maxTotalSegments.allele1.value = newGenotype.genes.maxTotalSegments.allele2.value = 25;
  newGenotype.genes.maxSegmentWidth.allele1.value = newGenotype.genes.maxSegmentWidth.allele2.value = 10;
  newGenotype.genes.stalkStrength.allele1.value = newGenotype.genes.stalkStrength.allele2.value = 1;
  newGenotype.genes.maxLeafLength.allele1.value = newGenotype.genes.maxLeafLength.allele2.value = 5;
  assignRandomFlowerColor( newGenotype );
  return newGenotype;
}

function generateHugePlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( skyPlantGenome );
  newGenotype.genes.maxTotalSegments.allele1.value = newGenotype.genes.maxTotalSegments.allele2.value = 25;
  newGenotype.genes.maxSegmentWidth.allele1.value = newGenotype.genes.maxSegmentWidth.allele2.value = 30;
  newGenotype.genes.maxLeafLength.allele1.value = newGenotype.genes.maxLeafLength.allele2.value = 9;
  assignRandomFlowerColor( newGenotype );
  return newGenotype;
}

function generateHugeRedPlantGenotype() {
  var newGenotype = EV.newRandomizedFirstGenGenotype( skyPlantGenome );
  newGenotype.genes.maxTotalSegments.allele1.value = newGenotype.genes.maxTotalSegments.allele2.value = 11;
  newGenotype.genes.maxSegmentWidth.allele1.value = newGenotype.genes.maxSegmentWidth.allele2.value = 30;
  newGenotype.genes.maxLeafLength.allele1.value = newGenotype.genes.maxLeafLength.allele2.value = 9;
  newGenotype.genes.flowerHue.allele1.value = newGenotype.genes.flowerHue.allele2.value = 0;
  newGenotype.genes.flowerLightness.allele1.value = newGenotype.genes.flowerLightness.allele2.value = 35;
  return newGenotype;
}









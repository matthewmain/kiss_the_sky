

///////////////////////////////////////////////////////
///////////////////  EVOLVE.JS  ///////////////////////
///////////////////////////////////////////////////////

// A lightweight genetics library based on principles of Mendelian inheritance and Darwinian selection.
// © Matthew Main 2019




/////-- Library Object --/////
 
var EV = {

  
  //species collection (a collection of genome objects by species name)
  species: {},


  //// Object Constructors ////

  //allele (a trait; e.g., brown eyes)
  Allele: function( value, dominanceIndex ) {
    this.value = value;
    this.dominanceIndex = dominanceIndex;
  },

  //gene locus (a feature; e.g. eye color)
  Gene: function( allele1, allele2, dominanceType, expressionType, mutationParameter ) {
    this.allele1 = allele1;
    this.allele2 = allele2;
    this.dominanceType = dominanceType;  // (can be "complete", "co", "partial")
    this.expressionType = expressionType;  // (can be "count" for integer values, or "scale" for decimal values)
    this.mutationParameter = mutationParameter;  // (as object: { frequency: <*>, range: <>, min: <>, max: <> } )
  },

  //genome (all of a species' genes; i.e., a blueprint for a generic body)
  Genome: function( reproductionType ) {  // (reproductionType can be "asexual", "autogamous", or "sexual")
    this.genes = {};
    this.reproductionType = reproductionType;
  },

  //genotype (all of an organism's allele pairs; i.e., a blueprint for a specific body**) 
  Genotype: function( species ) {  // (species as EV.species.<speciesName>)
    this.genes = {};
    for ( var gene in species.genes ) {
      this.genes[gene] = JSON.parse(JSON.stringify( species.genes[gene] ));  // (deep clone: as value not reference)
    } 
    this.reproductionType = species.reproductionType;
  },

  //phenotype (all of an organism's expressed traits; i.e., a body)
  Phenotype: function( genotype ) {  // (genotype as object collection of genes: { traitName: <value>, ... })
    var genes = genotype.genes;
    for ( var gene in genes ) {
      if ( genes[gene].dominanceType === "complete" ) {  // expresses dominant allele value only (1,2 -> 2)
        var dominanceDifference = genes[gene].allele1.dominanceIndex - genes[gene].allele2.dominanceIndex;
        this[gene+"Value"] = dominanceDifference >= 0 ? genes[gene].allele1.value : genes[gene].allele2.value;
      } else if ( genes[gene].dominanceType === "partial" ) {  // expresses average of allele values (1,2 -> 1.5)
        this[gene+"Value"] = ( genes[gene].allele1.value + genes[gene].allele2.value ) / 2;
      } else if ( genes[gene].dominanceType === "co" ) {  // expresses combination of allele values (1,2 -> [1,2])
        this[gene+"Values"] = [ genes[gene].allele1.value, genes[gene].allele2.value ];
      }
    }
    switch ( genotype.reproductionType ) {
      case "asexual": this.sex = "none"; break;
      case "autogamous": this.sex = "hermaphrodite"; break;
      case "sexual": this.sex = rib(1,2) === 1 ? "female" : "male";
    }
  },


  //// Methods ////

  //adds a new species genome to the collection of species objects
  addGenome: function( speciesName, reproductionType ) {
    var newGenome = new EV.Genome( reproductionType );
    EV.species[speciesName] = newGenome;
    return EV.species[speciesName];
  },

  //adds a new gene (with identical prototype alleles of neutral dominance) to a species genome
  addGene: function( species, geneName, domType, expType, initVal, mutFreq, mutRange, valMin, valMax ) {
    var gene = new EV.Gene( 
      new EV.Allele( initVal, 0.5 ),  // allele1 prototype
      new EV.Allele( initVal, 0.5 ),  // allele2 prototype
      domType,  // dominance type
      expType,  // expression type
      { frequency: mutFreq, range: mutRange, min: valMin, max: valMax }  // mutationParameter*
    );
    species.genes[geneName] = gene;
    return gene;
  },

  //creates a new standard genotype from a species genome (for genetically identical organisms)
  newStandardFirstGenGenotype: function( species ) {  // (species as EV.species.<speciesName>)
    return new EV.Genotype( species );
  },

  //creates a new random genotype from a species genome (for genetically distinct organisms)
  newRandomizedFirstGenGenotype: function( species ) {  // (species as EV.species.<speciesName>)
    var randomizedGenotype = new EV.Genotype( species );
    for ( var gene in species.genes ) { 
      var newAllele1 = randomizedGenotype.genes[gene].allele1;
      var newAllele2 = randomizedGenotype.genes[gene].allele2;
      newAllele1 = EV.mutate( species, species.genes[gene], newAllele1 );
      newAllele2 = EV.mutate( species, species.genes[gene], newAllele2 );
    }
    return randomizedGenotype;
  },

  //generates a phenotype from a genotype
  generatePhenotype: function( genotype ) {
    return new EV.Phenotype( genotype );
  },

  //mutates an allele (changes its value according to its expression type and within its mutation range)
  mutate: function( species, gene, allele ) {
    var ra = gene.mutationParameter.range;  // range (of a single mutation)
    var mn = gene.mutationParameter.min;  // min value (mutation cannot go below)
    var mx = gene.mutationParameter.max;  // max value (mutation cannot go above)
    var originalAlleleVal = allele.value;
    var mutatedAlleleVal = rfb( allele.value-ra/2, allele.value+ra/2 );  // random decimal value in mutation range
    if ( gene.expressionType === "count" ) {
      mutatedAlleleVal = Math.round( mutatedAlleleVal );  // (rounds to integer for "count" expression type)
    }
    if ( ( mn === null || mutatedAlleleVal >= mn) && ( mx === null || mutatedAlleleVal <= mx ) ) { 
      allele.value = mutatedAlleleVal;  // (mutates allele value if within min and max value parameters)
    }
    if ( allele.value != originalAlleleVal ) { 
      allele.dominanceIndex = Math.random();  // (assigns new random dominance index if allele has mutated)
    }
    return allele;
  },

  //performs meiosis (returns a new child genotype from a parent genotype or genotypes)
  meiosis: function( species, parentGenotype1, parentGenotype2 ) {  // (species as EV.species.<speciesName>)
    if ( parentGenotype2 === undefined ) parentGenotype2 = parentGenotype1;
    var childGenotype = { genes: {}, reproductionType: species.reproductionType };
    for ( var gene in species.genes ) {
      var parent1Allele = rib(1,2) === 1 ? parentGenotype1.genes[gene].allele1 : parentGenotype1.genes[gene].allele2;
      var parent2Allele = rib(1,2) === 1 ? parentGenotype2.genes[gene].allele1 : parentGenotype2.genes[gene].allele2;
      var newAllele1 = new EV.Allele( parent1Allele.value, parent1Allele.dominanceIndex );
      var newAllele2 = new EV.Allele( parent2Allele.value, parent2Allele.dominanceIndex );
      if ( rib( 1, species.genes[gene].mutationParameter.frequency ) === 1 ) {
        if ( rib(1,2) === 1 ) {
          newAllele1 = EV.mutate( species, species.genes[gene], newAllele1 );
        } else {
          newAllele2 = EV.mutate( species, species.genes[gene], newAllele2 );
        }
      }
      var dt = species.genes[gene].dominanceType;
      var et = species.genes[gene].expressionType;
      var mp = species.genes[gene].mutationParameter;
      childGenotype.genes[gene] = new EV.Gene( newAllele1, newAllele2, dt, et, mp );
    }
    return childGenotype;
  },


};



/////-- Helper Functions --/////

//random integer between two numbers (min/max inclusive)
function rib( min, max ) {
  return Math.floor( Math.random() * ( Math.floor(max) - Math.ceil(min) + 1 ) ) + Math.ceil(min);
}

//random float between two numbers
function rfb( min, max ) {
  return Math.random() * ( max - min ) + min;
}



/////-- Notes --/////

//*frequency as average meiosis events per mutation; higher is less frequent
//**in this model, an entire genotype is contained on a single autosome






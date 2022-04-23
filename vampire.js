class Vampire {
  constructor(name, yearConverted) {
    this.name = name;
    this.yearConverted = yearConverted;
    this.offspring = [];
    this.creator = null;
  }

  /** Simple tree methods **/
  // Adds the vampire as an offspring of this vampire
  addOffspring(vampire) {
    this.offspring.push(vampire);
    vampire.creator = this;
  }

  // Returns the total number of vampires created by that vampire
  get numberOfOffspring() {
    return this.offspring.length;
  }

  // Returns the number of vampires away from the original vampire this vampire is
  get numberOfVampiresFromOriginal() {
    let numberOfVampires = 0;
    let currentVampire = this;

    while (currentVampire.creator) {
      currentVampire = currentVampire.creator;
      numberOfVampires++;
    }

    return numberOfVampires;
  }

  // Returns true if this vampire is more senior than the other vampire. (Who is closer to the original vampire)
  isMoreSeniorThan(vampire) {
    if (this.creator === null) return true;
    if (vampire.creator === null) return false;
    return this.offspring.some(child => child.name === vampire.name || child.isMoreSeniorThan(vampire));
  }

  // Returns the closest common ancestor of two vampires.
  // The closest common anscestor should be the more senior vampire if a direct ancestor is used.
  closestCommonAncestor(vampire) {
    if (this.creator === null) return this;
    if (this.creator.creator === null) return this.creator;
    if (this.name === vampire.name) return this;
    if (vampire.isMoreSeniorThan(this)) return vampire;

    let currentVampire = this;
    while (!currentVampire.isMoreSeniorThan(vampire)) {
      currentVampire = currentVampire.creator;
    }
    return currentVampire;
  }


  /** Tree traversal section **/
  // = helpers =
  getRootVampire() {
    let rootVampire = this;
    while (rootVampire.creator) {
      rootVampire = rootVampire.creator;
    }
    return rootVampire;
  }

  // recursively flattens offspring and self to a single array
  flattenOffspring(vampire) {
    return vampire.offspring.reduce((total, child) => total.concat(child.offspring.length > 0 ? this.flattenOffspring(child) : child), [vampire]);
  }

  // = main traversal methods =
  // Returns the vampire object with that name, or null if no vampire exists with that name
  vampireWithName(name) {
    if (this.name === name) return this;
    for (const child of this.offspring) {
      const found = child.vampireWithName(name);
      if (found) return found;
    }
    return null;
  }

  // Returns the total number of vampires that exist under it
  get totalDescendents() {
    return this.offspring.reduce((total, child) => total + child.totalDescendents + 1, 0);
  }

  // Returns an array of all the vampires that were converted after 1980
  get allMillennialVampires() {
    const rootVampire = this.getRootVampire();
    return this.flattenOffspring(rootVampire).filter(vampire => vampire.yearConverted >= 1980);
  }
}

module.exports = Vampire;
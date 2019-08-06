function _cap(word){
  let c = word.split("")
  c[0] = c[0].toUpperCase()
  return c.join("")
}

function _rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

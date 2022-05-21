module.exports = (targetFunction) => (req, res, next) => {
  Promise.resolve(targetFunction(req, res, next)).catch(next)
}
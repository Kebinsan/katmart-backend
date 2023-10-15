const { pool } = require("./dbConfig");

async function getAllProducts() {
  try {
    const products = await pool.query(`SELECT * FROM products`);
    return products;
  } catch (err) {
    throw err;
  }
}
// async function populateProducts(products) {
//   try {
//     products.forEach((product) => {
//       let item = pool.query(
//         `INSERT INTO products (title, category, price, rating, image, description) VALUES ($1, $2, $3, $4, $5, $6)`,
//         [
//           product.title,
//           product.category,
//           product.price,
//           { rate: product.rating.rate, count: product.rating.count },
//           product.image,
//           product.description,
//         ]
//       );
//       console.log(item);
//     });
//   } catch (err) {
//     throw err;
//   }
// }

module.exports = {
  getAllProducts,
};

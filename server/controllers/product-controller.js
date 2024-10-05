const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const fs = require('fs');
const path = require('path');

// Function to read an image file and convert it to Base64
const getBase64Image = (filePath) => {
    return new Promise((resolve, reject) => {
        // Check if the file exists
        fs.stat(filePath, (err) => {
            if (err) {
                return reject(new Error('File not found or inaccessible'));
            }

            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const base64Image = data.toString('base64');
                    const extension = path.extname(filePath).slice(1); // Get the file extension (without the dot)
                    const mimeType = `image/${extension}`; // Construct MIME type
                    resolve(`data:${mimeType};base64,${base64Image}`); // Return the Base64 string
                }
            });
        });
    });
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        const productsWithBase64Images = await Promise.all(products.map(async (product) => {
            try {
                const base64Image = await getBase64Image(product.image); // Read image as Base64
                return {
                    ...product.toObject(), // Convert to plain object
                    image: base64Image // Replace image path with Base64 string
                };
            } catch (err) {
                console.error(`Error converting image for product ID ${product._id}:`, err);
                return {
                    ...product.toObject(),
                    image: null // Set image to null if an error occurs
                };
            }
        }));
        res.json(productsWithBase64Images);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Error fetching products' });
    }
};

// Get total count of products
exports.getTotalProductCount = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        res.json({ totalProducts });
    } catch (err) {
        console.error('Error counting products:', err);
        res.status(500).json({ error: 'Error counting products' });
    }
};
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate('category');

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        try {
            const base64Image = await getBase64Image(product.image); // Read image as Base64
            res.json({
                ...product.toObject(),
                image: base64Image // Replace image path with Base64 string
            });
        } catch (err) {
            console.error(`Error converting image for product ID ${product._id}:`, err);
            res.json({
                ...product.toObject(),
                image: null // Set image to null if an error occurs
            });
        }
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: 'Error fetching product' });
    }
};
// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.categoryId }).populate('category');
        const productsWithBase64Images = await Promise.all(products.map(async (product) => {
            try {
                const base64Image = await getBase64Image(product.image); // Read image as Base64
                return {
                    ...product.toObject(), // Convert to plain object
                    image: base64Image // Replace image path with Base64 string
                };
            } catch (err) {
                console.error(`Error converting image for product ID ${product._id}:`, err);
                return {
                    ...product.toObject(),
                    image: null // Set image to null if an error occurs
                };
            }
        }));
        res.json(productsWithBase64Images);
    } catch (err) {
        console.error('Error fetching products by category:', err);
        res.status(500).json({ error: 'Error fetching products by category' });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const base64Image = await getBase64Image(product.image); // Read image as Base64
        const productWithBase64Image = {
            ...product.toObject(), // Convert to plain object
            image: base64Image // Replace image path with Base64 string
        };
        res.json(productWithBase64Image);
    } catch (err) {
        console.error('Error fetching product by ID:', err);
        res.status(500).json({ error: 'Error fetching product by ID' });
    }
};

// Function to decode Base64 string and save it as a file
const saveImage = (base64String, fileName) => {
    return new Promise((resolve, reject) => {
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
        const filePath = path.join(__dirname, '../uploads', fileName); // Specify your upload path

        fs.writeFile(filePath, base64Data, 'base64', (err) => {
            if (err) {
                reject(new Error('Error saving image file')); // Provide a specific error message
            } else {
                resolve(filePath); // Return the saved file path
            }
        });
    });
};

// Create a product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, units,isBestSelling } = req.body; // Include units here

        // Check if the category exists by ID
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ error: 'Category not found' });
        }

        // Process Base64 image string
        if (!image) {
            return res.status(400).json({ error: 'Image not provided' });
        }

        // Save the image file
        const fileName = `${Date.now()}-${name.replace(/\s+/g, '-')}.jpg`; // Generate a unique file name
        await saveImage(image, fileName); // Save the image as a file

        // Create a new product
        const product = new Product({
            name,
            description,
            price,
            category,
            image: path.join(__dirname, '../uploads', fileName), // Use the file path where the image is saved
            units, // Include the units field
            isBestSelling 
        });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(400).json({ error: 'Error creating product' });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: 'Error updating product' });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Error deleting product' });
    }
};

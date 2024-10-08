const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// File type map for validation
const FILE_TYPE_MAP = {
     'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/jfif': 'jfif',
    'image/webp': 'webp',
    'image/gif': 'gif' // Add any other types if neede
};

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        const uploadError = isValid ? null : new Error('invalid image type');
        cb(uploadError, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

// Create a product
exports.createProduct = async (req, res) => {
    uploadOptions.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).send(err.message);
        }
        
        try {
            const { name, description, price, category, units, isBestSelling } = req.body;

            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({ error: 'Category not found' });
            }

            const file = req.file;  // Retrieve the uploaded file
            if (!file) return res.status(400).send('No image in the request');

            const fileName = file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

            const product = new Product({
                name,
                description,
                price,
                category,
                image: `${basePath}${fileName}`, // Use the uploaded file name
                units,
                isBestSelling
            });

            await product.save();
            res.status(201).json(product);
        } catch (err) {
            console.error('Error creating product:', err);
            res.status(400).json({ error: 'Error creating product' });
        }
    });
};





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





// Update a product
exports.updateProduct =   async (req, res) => {
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

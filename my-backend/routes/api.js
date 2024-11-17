const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Tag = require('../models/tag');

router.post('/update-article', async (req, res) => {
    // Get the new status, description, and uuid from the request body
    const { status, statusDescription, uuid,publicationScope } = req.body;

    console.log('Request Body:', req.body);
    try {
        // Find the article by UUID
        const article = await Article.findOne({ uuid });
        console.log("Article Found:", article);

        // Check if the article exists
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Update status and description based on the provided status
        if (status === "Approved") {
            article.status = status; // Update status to Approved
            article.statusDescription = statusDescription; // Update the status description
            article.publicationScope = publicationScope;
        } else if (status === "Rejected" || status==='SentBack') {
            article.status = status; // Update status to Rejected
            article.statusDescription = statusDescription; // Update the status description
        }


        // Save the updated article
        const updatedArticle = await article.save();

        // Return the updated article
        res.status(200).json(updatedArticle);
    } catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({ message: 'Error updating the article', error });
    }
});

// Route to add a new article
router.post('/add-article', async (req, res) => {
    const { createdOn, publisherName, subject, articleURL, tag, uuid } = req.body;
    console.log('Adding new article:', req.body);

    // Convert createdOn to Date object
    function convertToISOObject(dateString) {
        // Split the date string into components
        const [month, day, year] = dateString.split('/').map(Number);
    
        // Create a new Date object with UTC time
        const date = new Date(Date.UTC(year, month - 1, day, 18, 30, 0, 0)); // Set time to 18:30:00.000 UTC
    
        // Create an object with the original date and the ISO format
        const result = {
            originalDate: dateString,
            isoFormat: date // e.g., "2024-09-30T18:30:00.000Z"
        };
    
        return result;
    }
    const dateObject = convertToISOObject(createdOn);
    
    // Create a new article instance
    const newArticle = new Article({
        createdOn: dateObject.isoFormat,
        publisherName: publisherName.trim(), // Trim whitespace
        subject: subject,
        articleURL: articleURL,
        tag: tag || [], // Default to empty array if no tags provided
        uuid: uuid
    });

    try {
        // Save the new article to the database
        const savedArticle = await newArticle.save();
        res.status(201).send(savedArticle); // Respond with the created article
        console.log('Article added successfully:', savedArticle);
    } catch (error) {
        console.error('Error adding article:', error);
        res.status(500).send({ message: 'Error adding new article', error });
    }
});


//module.exports = router;




// router.get('/articles', async (req, res) => {
//     try {
//         // Fetch all articles
//         const articles = await Article.find(); 
        
//         // Create an array of all tags
//         const allTags = [];

//         articles.forEach(article => {
//             if (article.tag && Array.isArray(article.tag)) {
//                 allTags.push(...article.tag);
//             }
//         });

//         // Get unique tags
//         const uniqueTags = [...new Set(allTags)];

//         // Save unique tags to the tags collection (assuming a Tag model exists)
//         await Tag.deleteMany({}); // Optional: Clear existing tags before adding new ones
//         await Tag.insertMany(uniqueTags.map(tag => ({ name: tag })));

//         // Send articles and unique tags back as response
//         res.status(200).json({
//             articles,
//             uniqueTags
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: 'Error fetching articles or saving tags', error });
//     }
// });

router.get('/articles', async (req, res) => {
    console.log('get all api called')
    try {
        // Fetch all articles
        const articles = await Article.find();
        
        // Extract all tags using flatMap and remove duplicates
        const uniqueTags = [...new Set(articles.flatMap(article => article.tag || []))];

        // Clear existing tags and insert unique tags
        await Tag.deleteMany({});
        await Tag.insertMany(uniqueTags.map(tag => ({ name: tag })));

        // Send articles and unique tags back as response
        res.status(200).json({
            articles,
            uniqueTags
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching articles or saving tags', error });
    }
});


// module.exports = router;

//filter test
router.post('/filter-articles', async (req, res) => {
    const { quarters, createdBy, tags, fieldsToSelect } = req.body;
    console.log('test filter>>', req.body);
    
    // Initialize the filter object
    const filter = {};

    // Check if quarters are provided and create date ranges for the first quarter
    if (quarters && quarters.length > 0) {
        const quarter = quarters[0]; // Use only the first quarter
        const range = getDateRangeFromQuarter(quarter);
        filter.createdOn = {
            $gte: range.start,
            $lte: range.end
        };
    }

    // Add createdBy filter as $in condition for publisherName
    if (createdBy && createdBy.length > 0) {
        filter.publisherName = { $in: createdBy.map(name => name.trim()) }; // Match any specified names
    }

    // Add tags filter as $in condition for tags
    if (tags && tags.length > 0) {
        filter.tag = { $in: tags }; // Match any specified tags
    }
    console.log('Constructed filter:', filter); // Log the constructed filter
    // Create a projection object to select the desired fields
    const projection = {};
    if (fieldsToSelect && fieldsToSelect.length > 0) {
        fieldsToSelect.forEach(field => {
            projection[field] = 1; // Select only the fields specified in the request
        });
    }
    try {
        const filteredArticles = await Article.find(filter, projection); // Apply the filter and projection
        res.status(200).send(filteredArticles); // Return filtered articles
        console.log('test filter2>>', filteredArticles);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching filtered articles', error });
    }
});


// router.post('/filter-articles', async (req, res) => {
//     const { quarters, createdBy, tags, fieldsToSelect } = req.body;
//     console.log('test filter>>', req.body);
    
//     // Initialize the filter object
//     const filter = {};

//     // Check if quarters are provided and create date ranges
//     if (quarters && quarters.length > 0) {
//         const quarter = quarters[0]; // Use only the first quarter
//         const range = getDateRangeFromQuarter(quarter);
//         filter.createdOn = {
//             $gte: range.start,
//             $lte: range.end
//         };
//         console.log('Start Date:', range.start, 'End Date:', range.end);
//     }

//     // Add createdBy filter as $in condition for publisherName
//     if (createdBy && createdBy.length > 0) {
//         filter.publisherName = { $in: createdBy.map(name => name.trim()) }; // Match any specified names
//     }

//     // Add tags filter as $in condition for tags
//     if (tags && tags.length > 0) {
//         filter.tag = { $in: tags }; // Match any specified tags
//     }

//     console.log('Constructed filter:', filter); // Log the constructed filter

//     try {
//         const filteredArticles = await Article.find(filter); // Apply the filter
//         res.status(200).send(filteredArticles); // Return filtered articles
//         console.log('Filtered articles:', filteredArticles);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: 'Error fetching filtered articles', error });
//     }
// });



function getDateRangeFromQuarter(quarter) {
    const [year, q] = quarter.split('-'); // Split the quarter string
    const quarterNumber = parseInt(q.slice(1), 10); // Extract the quarter number (1, 2, 3, or 4)
    
    // Calculate start month (0-indexed for Date object)
    const startMonth = (quarterNumber - 1) * 3; // Start month for the quarter (0 for Q1, 3 for Q2, etc.)
    const endMonth = startMonth + 2; // End month for the quarter

    // Create Date objects for the start and end of the quarter
    const startDate = new Date(year, startMonth, 1); // First day of the start month
    const endDate = new Date(year, endMonth + 1, 0); // Last day of the end month (0 gives the last day of the previous month)

    // Log the dates for debugging
    console.log(`Start Date: ${startDate.toISOString()}, End Date: ${endDate.toISOString()}`);

    return { start: startDate, end: endDate }; // Return the range as Date objects
}



router.get('/tags', async (req, res) => {
    try {
        const tags = await Tag.find(); // Fetch all tags
        // Map the results to return an array of tag names
        const tagArray = tags.map(tag => tag.name);
        res.status(200).json(tagArray); // Send array of tag names as response
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).send({ message: 'Error fetching tags', error });
    }
});


// POST /tags - Add a new tag to the database
router.post('/tags', async (req, res) => {
    
    const { name } = req.body; // Extract the tag name from the request body

    if (!name) {
        return res.status(400).send({ message: 'Tag name is required' });
    }

    try {
        // Check if the tag already exists
        const existingTag = await Tag.findOne({ name });
        if (existingTag) {
            return res.status(409).send({ message: 'Tag already exists' });
        }

        // Create a new tag
        const newTag = new Tag({ name });
        await newTag.save(); // Save the tag to the database

        res.status(201).send({ message: 'Tag added successfully', tag: newTag });
    } catch (error) {
        console.error('Error adding tag:', error);
        res.status(500).send({ message: 'Error adding tag', error });
    }
});


router.delete('/articles/:uuid', async (req, res) => {

    try {
        const result = await Article.findOneAndDelete({ uuid: req.params.uuid });
        if (result) {
            res.status(200).json({ message: 'Article deleted successfully', data: result });
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting article', error });
    }
});

module.exports = router;

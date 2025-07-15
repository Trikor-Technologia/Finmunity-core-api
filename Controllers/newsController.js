import {
  createPagination,
  createSearchQuery,
  createErrorResponse,
  createSuccessResponse,
  validateImageUrl,
} from "../utils/helpers.js";
import { prisma } from "../Database-connection/index.js";

// Get all news articles with pagination and filtering
export const getAllNews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sort = "latest",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    let where = { isPublished: true };

    if (category) {
      where.category = category;
    }

    if (search) {
      const searchQuery = createSearchQuery(search, [
        "title",
        "description",
        "shortDescription",
      ]);
      where = { ...where, ...searchQuery };
    }

    // Build order by clause
    let orderBy = {};
    switch (sort) {
      case "trending":
        orderBy = { isTrending: "desc", views: "desc", createdAt: "desc" };
        break;
      case "popular":
        orderBy = { views: "desc", createdAt: "desc" };
        break;
      case "latest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Get news with pagination
    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profilePicture: true,
            },
          },
        },
      }),
      prisma.news.count({ where }),
    ]);

    const pagination = createPagination(page, limit, total);

    res.status(200).json(
      createSuccessResponse({
        data: news,
        pagination,
      })
    );
  } catch (error) {
    console.error("Get all news error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error fetching news articles"
        )
      );
  }
};

// Get single news article by ID
export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that id is a valid ObjectID (24 character hex string)
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res
        .status(400)
        .json(
          createErrorResponse("VALIDATION_ERROR", "Invalid news ID format")
        );
    }

    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!news) {
      return res
        .status(404)
        .json(createErrorResponse("NOT_FOUND", "News article not found"));
    }

    // Increment view count
    await prisma.news.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    res.status(200).json(createSuccessResponse({ news }));
  } catch (error) {
    console.error("Get news by ID error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error fetching news article"
        )
      );
  }
};

// Get trending news articles
export const getTrendingNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    let where = {
      isPublished: true,
      isTrending: true,
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      const searchQuery = createSearchQuery(search, [
        "title",
        "description",
        "shortDescription",
      ]);
      where = { ...where, ...searchQuery };
    }

    // Get trending news with pagination
    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: [
          { isTrending: "desc" },
          { views: "desc" },
          { createdAt: "desc" },
        ],
        skip,
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profilePicture: true,
            },
          },
        },
      }),
      prisma.news.count({ where }),
    ]);

    const pagination = createPagination(page, limit, total);

    res.status(200).json(
      createSuccessResponse({
        data: news,
        pagination,
      })
    );
  } catch (error) {
    console.error("Get trending news error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error fetching trending news"
        )
      );
  }
};

// Create new news article (Admin only)
export const createNews = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      image,
      images,
      category,
      sources,
      isTrending = false,
      isPublished = true,
    } = req.body;

    // Validation
    if (!title || !description || !category) {
      return res
        .status(400)
        .json(
          createErrorResponse(
            "VALIDATION_ERROR",
            "Title, description, and category are required"
          )
        );
    }

    if (image && !validateImageUrl(image)) {
      return res
        .status(400)
        .json(
          createErrorResponse(
            "VALIDATION_ERROR",
            "Please provide a valid image URL"
          )
        );
    }

    if (images && !Array.isArray(images)) {
      return res
        .status(400)
        .json(
          createErrorResponse("VALIDATION_ERROR", "Images must be an array")
        );
    }

    // Create news article
    const news = await prisma.news.create({
      data: {
        title,
        description,
        shortDescription,
        image,
        images: images || [],
        category,
        sources: sources || [],
        isTrending,
        isPublished,
        author: req.user.username,
        username: req.user.username,
        userId: req.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    res
      .status(201)
      .json(
        createSuccessResponse({ news }, "News article created successfully")
      );
  } catch (error) {
    console.error("Create news error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error creating news article"
        )
      );
  }
};

// Update news article
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      shortDescription,
      image,
      images,
      category,
      sources,
      isTrending,
      isPublished,
    } = req.body;

    // Check if news exists
    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return res
        .status(404)
        .json(createErrorResponse("NOT_FOUND", "News article not found"));
    }

    // Check if user is the author or admin
    if (existingNews.userId !== req.user.id) {
      return res
        .status(403)
        .json(
          createErrorResponse(
            "FORBIDDEN",
            "You can only update your own news articles"
          )
        );
    }

    // Validation
    if (image && !validateImageUrl(image)) {
      return res
        .status(400)
        .json(
          createErrorResponse(
            "VALIDATION_ERROR",
            "Please provide a valid image URL"
          )
        );
    }

    if (images && !Array.isArray(images)) {
      return res
        .status(400)
        .json(
          createErrorResponse("VALIDATION_ERROR", "Images must be an array")
        );
    }

    // Update news article
    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(shortDescription !== undefined && { shortDescription }),
        ...(image !== undefined && { image }),
        ...(images !== undefined && { images }),
        ...(category && { category }),
        ...(sources !== undefined && { sources }),
        ...(isTrending !== undefined && { isTrending }),
        ...(isPublished !== undefined && { isPublished }),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    res
      .status(200)
      .json(
        createSuccessResponse(
          { news: updatedNews },
          "News article updated successfully"
        )
      );
  } catch (error) {
    console.error("Update news error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error updating news article"
        )
      );
  }
};

// Delete news article
export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if news exists
    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return res
        .status(404)
        .json(createErrorResponse("NOT_FOUND", "News article not found"));
    }

    // Check if user is the author or admin
    if (existingNews.userId !== req.user.id) {
      return res
        .status(403)
        .json(
          createErrorResponse(
            "FORBIDDEN",
            "You can only delete your own news articles"
          )
        );
    }

    // Delete news article
    await prisma.news.delete({
      where: { id },
    });

    res
      .status(200)
      .json(createSuccessResponse(null, "News article deleted successfully"));
  } catch (error) {
    console.error("Delete news error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error deleting news article"
        )
      );
  }
};

// Get news categories
export const getNewsCategories = async (req, res) => {
  try {
    const categories = [
      { id: "crypto", name: "Cryptocurrency", count: 0 },
      { id: "stocks", name: "Stocks", count: 0 },
      { id: "etfs", name: "ETFs", count: 0 },
      { id: "economy", name: "Economy", count: 0 },
    ];

    // Get count for each category
    const categoryCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await prisma.news.count({
          where: {
            category: category.id,
            isPublished: true,
          },
        });
        return { ...category, count };
      })
    );

    res.status(200).json(createSuccessResponse({ categories: categoryCounts }));
  } catch (error) {
    console.error("Get news categories error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error fetching news categories"
        )
      );
  }
};

// Get market stocks
export const getMarketStocks = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let where = {};
    if (category) {
      where.category = category;
    }

    const [stocks, total] = await Promise.all([
      prisma.stock.findMany({
        where,
        orderBy: { lastUpdated: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.stock.count({ where }),
    ]);

    const pagination = createPagination(page, limit, total);

    res.status(200).json(
      createSuccessResponse({
        data: stocks,
        pagination,
      })
    );
  } catch (error) {
    console.error("Get market stocks error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error fetching market stocks"
        )
      );
  }
};

// Get market overview
export const getMarketOverview = async (req, res) => {
  try {
    const [totalStocks, gainers, losers, trendingStocks] = await Promise.all([
      prisma.stock.count(),
      prisma.stock.count({ where: { isUp: true } }),
      prisma.stock.count({ where: { isUp: false } }),
      prisma.stock.findMany({
        where: { isTrending: true },
        orderBy: { lastUpdated: "desc" },
        take: 10,
      }),
    ]);

    const overview = {
      totalStocks,
      gainers,
      losers,
      unchanged: 0, // Since isUp is required, there are no unchanged stocks
      trendingStocks,
      lastUpdated: new Date().toISOString(),
    };

    res.status(200).json(createSuccessResponse({ overview }));
  } catch (error) {
    console.error("Get market overview error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error fetching market overview"
        )
      );
  }
};

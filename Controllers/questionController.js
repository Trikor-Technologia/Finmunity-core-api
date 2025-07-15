import { PrismaClient } from "@prisma/client";
import {
  createPagination,
  createSearchQuery,
  createErrorResponse,
  createSuccessResponse,
} from "../utils/helpers.js";

const prisma = new PrismaClient();

// Get all questions with pagination and filtering
export const getAllQuestions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      filter = "all",
      search,
      sort = "latest",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    let where = {};

    if (filter !== "all") {
      where.category = filter;
    }

    if (search) {
      const searchQuery = createSearchQuery(search, ["title", "content"]);
      where = { ...where, ...searchQuery };
    }

    // Build order by clause
    let orderBy = {};
    switch (sort) {
      case "popular":
        orderBy = { likes: "desc", viewCount: "desc", createdAt: "desc" };
        break;
      case "unanswered":
        where.isAnswered = false;
        orderBy = { createdAt: "desc" };
        break;
      case "latest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Get questions with pagination
    const [questions, total] = await Promise.all([
      prisma.question.findMany({
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
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  profilePicture: true,
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
      }),
      prisma.question.count({ where }),
    ]);

    const pagination = createPagination(page, limit, total);

    res.status(200).json(
      createSuccessResponse({
        data: questions,
        pagination,
      })
    );
  } catch (error) {
    console.error("Get all questions error:", error);
    res
      .status(500)
      .json(
        createErrorResponse("INTERNAL_SERVER_ERROR", "Error fetching questions")
      );
  }
};

// Get single question by ID
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!question) {
      return res
        .status(404)
        .json(createErrorResponse("NOT_FOUND", "Question not found"));
    }

    // Increment view count
    await prisma.question.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    res.status(200).json(createSuccessResponse({ question }));
  } catch (error) {
    console.error("Get question by ID error:", error);
    res
      .status(500)
      .json(
        createErrorResponse("INTERNAL_SERVER_ERROR", "Error fetching question")
      );
  }
};

// Create new question
export const createQuestion = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);

    const { title, content, category } = req.body || {};

    // Validation
    if (!title || !content || !category) {
      console.log("Validation failed:", { title, content, category });
      return res
        .status(400)
        .json(
          createErrorResponse(
            "VALIDATION_ERROR",
            "Title, content, and category are required"
          )
        );
    }

    if (title.length < 10) {
      return res
        .status(400)
        .json(
          createErrorResponse(
            "VALIDATION_ERROR",
            "Title must be at least 10 characters long"
          )
        );
    }

    if (content.length < 20) {
      return res
        .status(400)
        .json(
          createErrorResponse(
            "VALIDATION_ERROR",
            "Content must be at least 20 characters long"
          )
        );
    }

    // Create question
    const question = await prisma.question.create({
      data: {
        title,
        content,
        category,
        author: req.user.username || "Anonymous",
        username: req.user.username || "Anonymous",
        profilePicture: req.user.profilePicture || null,
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

    res.status(201).json(
      createSuccessResponse(
        {
          question,
        },
        "Question created successfully"
      )
    );
  } catch (error) {
    console.error("Create question error:", error);
    res
      .status(500)
      .json(
        createErrorResponse("INTERNAL_SERVER_ERROR", "Error creating question")
      );
  }
};

// Update question
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;

    // Check if question exists
    const existingQuestion = await prisma.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      return res
        .status(404)
        .json(createErrorResponse("NOT_FOUND", "Question not found"));
    }

    // Check if user is the author
    if (existingQuestion.userId !== req.user.id) {
      return res
        .status(403)
        .json(
          createErrorResponse(
            "FORBIDDEN",
            "You can only edit your own questions"
          )
        );
    }

    // Validation
    if (title && title.length < 10) {
      return res
        .status(400)
        .json(
          createErrorResponse(
            "VALIDATION_ERROR",
            "Title must be at least 10 characters long"
          )
        );
    }

    if (content && content.length < 20) {
      return res
        .status(400)
        .json(
          createErrorResponse(
            "VALIDATION_ERROR",
            "Content must be at least 20 characters long"
          )
        );
    }

    // Update question
    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(category && { category }),
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

    res.status(200).json(
      createSuccessResponse(
        {
          question: updatedQuestion,
        },
        "Question updated successfully"
      )
    );
  } catch (error) {
    console.error("Update question error:", error);
    res
      .status(500)
      .json(
        createErrorResponse("INTERNAL_SERVER_ERROR", "Error updating question")
      );
  }
};

// Delete question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if question exists
    const existingQuestion = await prisma.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      return res
        .status(404)
        .json(createErrorResponse("NOT_FOUND", "Question not found"));
    }

    // Check if user is the author or admin
    if (existingQuestion.userId !== req.user.id) {
      return res
        .status(403)
        .json(
          createErrorResponse(
            "FORBIDDEN",
            "You can only delete your own questions"
          )
        );
    }

    // Delete question (comments will be deleted automatically due to cascade)
    await prisma.question.delete({
      where: { id },
    });

    res
      .status(200)
      .json(createSuccessResponse(null, "Question deleted successfully"));
  } catch (error) {
    console.error("Delete question error:", error);
    res
      .status(500)
      .json(
        createErrorResponse("INTERNAL_SERVER_ERROR", "Error deleting question")
      );
  }
};

// Get question categories with question counts
export const getQuestionCategories = async (req, res) => {
  try {
    const categories = await prisma.question.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
    });

    const formattedCategories = categories.map((cat) => ({
      id: cat.category,
      name: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
      slug: cat.category,
      description: `${cat.category} related questions and discussions`,
      questionCount: cat._count.category,
    }));

    res.status(200).json(
      createSuccessResponse({
        categories: formattedCategories,
      })
    );
  } catch (error) {
    console.error("Get question categories error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error fetching question categories"
        )
      );
  }
};

// Get questions by specific user
export const getUserQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, profilePicture: true },
    });

    if (!user) {
      return res
        .status(404)
        .json(createErrorResponse("NOT_FOUND", "User not found"));
    }

    // Get user's questions with pagination
    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where: { userId: id },
        orderBy: { createdAt: "desc" },
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
      prisma.question.count({ where: { userId: id } }),
    ]);

    const pagination = createPagination(page, limit, total);

    res.status(200).json(
      createSuccessResponse({
        user,
        data: questions,
        pagination,
      })
    );
  } catch (error) {
    console.error("Get user questions error:", error);
    res
      .status(500)
      .json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "Error fetching user questions"
        )
      );
  }
};

// Get comments for a question
export const getQuestionComments = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return res
        .status(404)
        .json(createErrorResponse("NOT_FOUND", "Question not found"));
    }

    const comments = await prisma.comment.findMany({
      where: { questionId: id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json(
      createSuccessResponse({
        comments,
      })
    );
  } catch (error) {
    console.error("Get question comments error:", error);
    res
      .status(500)
      .json(
        createErrorResponse("INTERNAL_SERVER_ERROR", "Error fetching comments")
      );
  }
};

// Add comment to question
export const addQuestionComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, isAnswer = false } = req.body;

    // Validation
    if (!text || text.trim().length === 0) {
      return res
        .status(400)
        .json(
          createErrorResponse("VALIDATION_ERROR", "Comment text is required")
        );
    }

    if (text.length < 5) {
      return res
        .status(400)
        .json(
          createErrorResponse(
            "VALIDATION_ERROR",
            "Comment must be at least 5 characters long"
          )
        );
    }

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return res
        .status(404)
        .json(createErrorResponse("NOT_FOUND", "Question not found"));
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        questionId: id,
        text: text.trim(),
        isAnswer,
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

    // If this is marked as an answer, update the question
    if (isAnswer) {
      await prisma.question.update({
        where: { id },
        data: { isAnswered: true },
      });
    }

    res.status(201).json(
      createSuccessResponse(
        {
          comment,
        },
        "Comment added successfully"
      )
    );
  } catch (error) {
    console.error("Add comment error:", error);
    res
      .status(500)
      .json(
        createErrorResponse("INTERNAL_SERVER_ERROR", "Error adding comment")
      );
  }
};

// Update comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return res
        .status(404)
        .json(createErrorResponse("NOT_FOUND", "Comment not found"));
    }

    // Check if user is the author
    if (existingComment.userId !== req.user.id) {
      return res
        .status(403)
        .json(
          createErrorResponse(
            "FORBIDDEN",
            "You can only edit your own comments"
          )
        );
    }

    // Validation
    if (!text || text.trim().length === 0) {
      return res
        .status(400)
        .json(
          createErrorResponse("VALIDATION_ERROR", "Comment text is required")
        );
    }

    if (text.length < 5) {
      return res
        .status(400)
        .json(
          createErrorResponse(
            "VALIDATION_ERROR",
            "Comment must be at least 5 characters long"
          )
        );
    }

    // Update comment
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { text: text.trim() },
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

    res.status(200).json(
      createSuccessResponse(
        {
          comment: updatedComment,
        },
        "Comment updated successfully"
      )
    );
  } catch (error) {
    console.error("Update comment error:", error);
    res
      .status(500)
      .json(
        createErrorResponse("INTERNAL_SERVER_ERROR", "Error updating comment")
      );
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return res
        .status(404)
        .json(createErrorResponse("NOT_FOUND", "Comment not found"));
    }

    // Check if user is the author or admin
    if (existingComment.userId !== req.user.id) {
      return res
        .status(403)
        .json(
          createErrorResponse(
            "FORBIDDEN",
            "You can only delete your own comments"
          )
        );
    }

    // Delete comment
    await prisma.comment.delete({
      where: { id },
    });

    res
      .status(200)
      .json(createSuccessResponse(null, "Comment deleted successfully"));
  } catch (error) {
    console.error("Delete comment error:", error);
    res
      .status(500)
      .json(
        createErrorResponse("INTERNAL_SERVER_ERROR", "Error deleting comment")
      );
  }
};

// Like/unlike a comment
export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return res
        .status(404)
        .json(createErrorResponse("NOT_FOUND", "Comment not found"));
    }

    // Toggle like (increment/decrement)
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });

    res.status(200).json(
      createSuccessResponse(
        {
          comment: updatedComment,
        },
        "Comment liked successfully"
      )
    );
  } catch (error) {
    console.error("Like comment error:", error);
    res
      .status(500)
      .json(
        createErrorResponse("INTERNAL_SERVER_ERROR", "Error liking comment")
      );
  }
};

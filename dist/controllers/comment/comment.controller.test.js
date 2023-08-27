"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _commentcontroller = require("./comment.controller");
const _lib = require("../../lib");
const _utils = require("../../utils");
describe('CommentController', ()=>{
    let mockRequest;
    let mockResponse;
    let mockNext;
    beforeEach(()=>{
        mockRequest = {
            body: {
                userId: 'user-id',
                comment: 'Test comment'
            },
            params: {
                id: 'post-id'
            }
        };
        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        mockNext = vi.fn();
    });
    afterEach(()=>{
        vi.clearAllMocks();
    });
    describe('addCommentToPost', ()=>{
        it('should add a comment to the post and return success response', async ()=>{
            // Mock Prisma functions
            const mockFindFirst = vi.fn();
            const mockCreate = vi.fn();
            _lib.prisma.user.findFirst = mockFindFirst;
            _lib.prisma.post.findFirst = mockFindFirst;
            _lib.prisma.comment.create = mockCreate;
            // Mock successful findFirst calls
            mockFindFirst.mockResolvedValue({
                id: 'user-id'
            });
            // Mock successful create call
            mockCreate.mockResolvedValue({
                id: 'comment-id',
                comment: 'Test comment',
                createdAt: '2023-08-27T08:13:36.755Z'
            });
            // Instantiate CommentController
            const commentController = new _commentcontroller.CommentController();
            // Call the method
            await commentController.addCommentToPost(mockRequest, mockResponse, mockNext);
            // Assertion
            expect(mockFindFirst).toHaveBeenCalledTimes(2) // user.findFirst and post.findFirst
            ;
            expect(mockCreate).toHaveBeenCalledWith({
                data: {
                    comment: 'Test comment',
                    postId: 'post-id',
                    userId: 'user-id'
                },
                select: {
                    id: true,
                    comment: true,
                    createdAt: true
                }
            });
            expect(mockResponse.status).toHaveBeenCalledWith(_utils.StatusCode.CREATED);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: 'Comment Created Successfully',
                data: {
                    id: 'comment-id',
                    comment: 'Test comment',
                    createdAt: '2023-08-27T08:13:36.755Z'
                }
            });
            expect(mockNext).not.toHaveBeenCalled();
        });
        it('should call next with an error if an exception occurs during Prisma findFirst', async ()=>{
            // Mock Prisma functions
            _lib.prisma.user.findFirst = vi.fn().mockRejectedValue(new Error('Mocked error'));
            // Instantiate CommentController
            const commentController = new _commentcontroller.CommentController();
            // Call the method
            await commentController.addCommentToPost(mockRequest, mockResponse, mockNext);
            // Assertion
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
        it('should handle unexpected exceptions and call next with an error', async ()=>{
            // Mock Prisma functions
            const mockFindFirst = vi.fn();
            const mockCreate = vi.fn();
            _lib.prisma.user.findFirst = mockFindFirst;
            _lib.prisma.post.findFirst = mockFindFirst;
            _lib.prisma.comment.create = mockCreate;
            // Mock successful findFirst calls
            mockFindFirst.mockResolvedValue({
                id: 'user-id'
            });
            // Mock Prisma comment.create throwing an unexpected exception
            mockCreate.mockImplementation(()=>{
                throw new Error('Unexpected error');
            });
            // Instantiate CommentController
            const commentController = new _commentcontroller.CommentController();
            // Call the method
            await commentController.addCommentToPost(mockRequest, mockResponse, mockNext);
            // Assertion
            expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
        });
    });
});

//# sourceMappingURL=comment.controller.test.js.map
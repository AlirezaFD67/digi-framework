# Changelog

All notable changes to the Framework package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Article Routes**: Complete implementation of Article (Learning) management endpoints
  - `useAdminLearningListQuery` - Get paginated list of articles
  - `useAdminLearningDetail` - Get single article detail
  - `useAdminCategoryListQuery` - Get article categories
  - `useAuthorsListQuery` - Search for authors
  - `useArticleFilesList` - Get article files
  - `useArticleContent` - Get article content
  - `useAddAdminLearningList` - Create new article
  - `useUpdateAdminLearningList` - Update existing article
  - `useAddArticleDetails` - Add article details with images
  - `useSaveArticleContent` - Save article content
  - `useAcceptLearningMutation` - Accept/reject article publication

### Types Added
- `IAdminLearningListItem` - Article list item interface
- `IArticle` - Article detail interface
- `IAddArticleRequest` - Create article request
- `IAddArticleDetailsRequest` - Article details request with file uploads
- `ISaveContentRequest` - Save content request
- `AcceptLearningRequest` - Accept/reject request
- `AcceptLearningResponse` - Accept/reject response
- `GetAdminLearningListParams` - List query parameters

### Functions Added
- `GetAdminLearningList` - Fetch articles with pagination and filters
- `GetLearningCategoryList` - Fetch categories
- `GetAdminLearningDetail` - Fetch single article
- `GetArticleContent` - Fetch article content
- `GetAuthorsList` - Search authors
- `GetArticleFiles` - Fetch article files
- `addArticle` - Create new article
- `updateArticle` - Update article
- `addArticleDetails` - Add article details
- `saveArticleContent` - Save article content
- `uploadArticleThumbnail` - Upload thumbnail image
- `uploadArticleFile` - Upload single file
- `uploadArticleFileChunked` - Upload large files in chunks with progress
- `AcceptLearning` - Accept or reject article

### API Endpoints Added
- `/adminlearninglist` - Article list endpoint
- `/admininsertlearningbase1` - Create article base
- `/admininsertlearningbase2` - Add article details
- `/adminupdatelearning` - Update article
- `/getlearningcatlist` - Get categories
- `/adminuploadlearningimage` - Upload thumbnail
- `/adminlearningbasedetails` - Article base details
- `/adminlearningbodydetails` - Article content
- `/adminlearningsearchdoc` - Search authors
- `/adminfilemanagerlist` - Article files
- `/admininsertlearningbody` - Save content
- `/adminacceptlearning` - Accept/reject article
- `/adminuploadnewfile` - Upload files

### Documentation Added
- Complete Article endpoint documentation at `apps/docs/content/docs/framework/article-endpoint.mdx`
- Updated `adding-endpoints.mdx` with real-world Article example
- Updated `meta.json` with Article endpoint entry
- Updated main framework `index.mdx` with Article endpoint link
- Updated package `README.md` with available routes section

### Features
- **Chunked File Upload**: Support for uploading large files in chunks with progress tracking
- **Pagination Support**: Full pagination with metadata (totalRows, pageCount)
- **Search & Filter**: Search by title and filter by publication status
- **Image Upload**: Support for cover image and thumbnail upload
- **Content Management**: Rich content management with block-based editor support
- **Publication Control**: Accept/reject article publication workflow

## [0.0.0] - Initial Release

### Added
- Core framework package structure
- Generic hooks for queries and mutations
- HTTP client with interceptors
- Type-safe API endpoint management
- React Query integration
- Auth routes implementation
- User routes implementation
- Provider pattern for framework setup

---

**Date**: October 19, 2025
**Author**: Framework Team


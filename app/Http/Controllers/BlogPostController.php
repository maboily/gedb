<?php namespace GEDB\Http\Controllers;

use GEDB\Services\Authorization;
use GEDB\Http\Presenters\BlogPostListPresenter;
use GEDB\Http\Requests\BlogPostUpdateRequest;
use GEDB\Http\Requests\BlogPostStoreRequest;
use GEDB\BlogPost;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Hash;

class BlogPostController extends BaseController {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        if (!Authorization::hasPermission('blog.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return BlogPostListPresenter::present();
    }


    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(BlogPostStoreRequest $request)
    {
        if (!Authorization::hasPermission('blog.new')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Attempts to create new blogPost
        $newBlogPost = new BlogPost;
        $newBlogPost->title = Input::get('title');
        $newBlogPost->content = Input::get('content');
        $newBlogPost->save();

        // Returns new blogPost's revision ID
        return ['data' => $newBlogPost->id];
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        if (!Authorization::hasPermission('blog.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => BlogPost::find($id)];
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id, BlogPostUpdateRequest $request)
    {
        if (!Authorization::hasPermission('blog.edit')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Finds blogPost revision in database
        $blogPostRevision = BlogPost::find($id);
        $blogPostRevision->title = Input::get('title');
        $blogPostRevision->content = Input::get('content');
        $blogPostRevision->save();
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        if (!Authorization::hasPermission('blog.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $blogPostRevision = BlogPost::find($id);
        $blogPostRevision->delete();
    }
}

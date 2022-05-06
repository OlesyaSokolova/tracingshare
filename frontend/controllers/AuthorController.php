<?php

namespace frontend\controllers;


use common\models\Publication;
use common\models\User;
use yii\data\Pagination;
use yii\web\Controller;

class AuthorController extends Controller
{
    /**
     * Displays list of users = authors.
     *
     * @return mixed
     */
    public function actionList()
    {
        $query = User::find()
            ->orderBy(['id' => SORT_DESC]);
        $countQuery = clone $query;
        $pages = new Pagination(['totalCount' => $countQuery->count(),
            'pageSize' => User::PAGE_SIZE]);
        $authors = $query->offset($pages->offset)
            ->limit($pages->limit)
            ->all();

        return $this->render('list',[
            'authors' => $authors,
            'pages' => $pages,
        ]);
    }

    /**
     * Displays list of users = authors.
     *
     * @return mixed
     */
    public function actionPublications($id)
    {
        $query = Publication::find()
            ->where(['author_id' => $id])
            ->orderBy(['id' => SORT_DESC]);
        $pages = new Pagination(['totalCount' => $query->count(),
            'pageSize' => Publication::PAGE_SIZE]);
        $publications = $query->offset($pages->offset)
            ->limit($pages->limit)
            ->all();

        $author = User::findOne($id);

        return $this->render('publications',[
            'author' => $author,
            'publications' => $publications,
            'pages' => $pages,
        ]);
    }
}

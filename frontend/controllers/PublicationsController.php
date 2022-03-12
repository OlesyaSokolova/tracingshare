<?php

namespace frontend\controllers;

use common\models\Petroglyph;
use frontend\models\ResendVerificationEmailForm;
use frontend\models\VerifyEmailForm;
use Yii;
use yii\base\InvalidArgumentException;
use yii\data\Pagination;
use yii\web\BadRequestHttpException;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use common\models\LoginForm;
use frontend\models\PasswordResetRequestForm;
use frontend\models\ResetPasswordForm;
use frontend\models\SignupForm;
use frontend\models\ContactForm;
use yii\web\UploadedFile;

/**
 * Site controller
 */
class PublicationsController extends Controller
{
    /**
     * {@inheritdoc}
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    public function actionIndex()
    {
        $query = Petroglyph::find()
            ->where(['author_id' => Yii::$app->user->getId()])
            ->orderBy(['id' => SORT_ASC]);
        $pages = new Pagination(['totalCount' => $query->count()]);
        $petroglyphs = $query->offset($pages->offset)
            ->limit($pages->limit)
            ->all();
        return $this->render('index',[
            'petroglyphs' => $petroglyphs,
            'pages' => $pages,
        ]);
    }

    public function actionUpload()
    {
        /* $model = new Petroglyph();

         if (Yii::$app->request->isPost) {
             $model->imageFile = UploadedFile::getInstance($model, 'imageFile');
             if ($model->upload()) {
                 // file is uploaded successfully
                 return;
             }
         }*/

        return $this->render('upload');
    }
}

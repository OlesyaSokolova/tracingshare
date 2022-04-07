<?php

namespace backend\controllers;

use common\models\Publication;
use backend\models\publication\PublicationSearch;
use Yii;
use yii\web\Controller;
use yii\web\HttpException;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\web\UploadedFile;

/**
 * PublicationController implements the CRUD actions for Publication model.
 */
class PublicationController extends Controller
{
    /**
     * @inheritDoc
     */
    public function behaviors()
    {
        return array_merge(
            parent::behaviors(),
            [
                'verbs' => [
                    'class' => VerbFilter::className(),
                    'actions' => [
                        'delete' => ['POST'],
                    ],
                ],
            ]
        );
    }

    /**
     * Lists all Publication models.
     *
     * @return string
     */
    public function actionIndex()
    {
        $userRoles =  Yii::$app->authManager->getRolesByUser(Yii::$app->user->getId());
        if(isset($userRoles['admin'])) {
            $searchModel = new PublicationSearch();
            $dataProvider = $searchModel->search($this->request->queryParams);

            return $this->render('index', [
                'searchModel' => $searchModel,
                'dataProvider' => $dataProvider,
            ]);
        }
        else {
            header("Location: ". $this->siteControllerUrl()."/site/login");
            exit();
        }
    }

    /**
     * Displays a single Publication model.
     * @param int $id
     * @return string
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionView($id)
    {
        $publication = Publication::findOne($id);
        if (empty($publication)) {
            throw new HttpException(404);
        }

        return $this->render('view', [
            'publication' => $publication,
            /*'categoryId' => $categoryId,
            'objectPrev' => $objectPrev,
            'objectNext' => $objectNext,*/
        ]);
    }

    /**
     * Creates a new Publication model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return string|\yii\web\Response
     */
    public function actionCreate()
    {
        $model = new Publication();

        if ($this->request->isPost) {
            if ($model->load($this->request->post()) && $model->save()) {
                return $this->redirect(['view', 'id' => $model->id]);
            }
        } else {
            $model->loadDefaultValues();
        }

        return $this->render('create', [
            'model' => $model,
        ]);
    }

    /**
     * Updates an existing Publication model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param int $id
     * @return string|\yii\web\Response
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionUpdate($id)
    {
        header("Location: ". $this->frontendUrl()."/publication/edit?id=".$id);
        exit();
    }

    public function actionEdit($id)
    {
        header("Location: ". $this->frontendUrl()."/publication/edit?id=".$id);
        exit();
    }

    /**
     * Deletes an existing Publication model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param int $id
     * @return \yii\web\Response
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionDelete($id)
    {
        $publication = Publication::findOne($id);
        $publication->deleteFilesFromStorage();
        $publication->delete();
        return $this->redirect(['index']);
    }

    /**
     * Finds the Publication model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param int $id
     * @return Publication the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = Publication::findOne(['id' => $id])) !== null) {
            return $model;
        }

        throw new NotFoundHttpException('The requested page does not exist.');
    }

    public function actionSave()
    {
        $data = (!empty($_POST['params'])) ? json_decode($_POST['params'], true) : "empty params";

        $id = $data["id"];

        $newName = $data["newName"];
        $newDescription = $data["newDescription"];

        $publication = Publication::findOne($id);
        $publication->name = $newName;
        $publication->description = $newDescription;

        if (strcmp(json_encode($data["newSettings"]), "") != 2) {
            $newSettings = json_encode($data["newSettings"], JSON_UNESCAPED_UNICODE);
            $publication->settings = $newSettings;
        }
        if($publication->update(true, ["name", "description", "settings"])) {
            Yii::$app->session->setFlash('success', "Успешно сохранено.");
        }
        else {
            Yii::$app->session->setFlash('error', "При сохранении произошла ошибка.");
        }
    }

    public function actionUpload()
    {
        $model = new Publication();

        if (Yii::$app->request->isPost) {
            if ($model->load(Yii::$app->request->post())) {
                $model->author_id = Yii::$app->user->getId();
                $model->imageFile = UploadedFile::getInstance($model, 'imageFile');
                $model->image = $model->imageFile->baseName . '.' . $model->imageFile->extension;
                if($model->save()) {
                    if ($model->uploadOriginalImage()) {
                        Yii::$app->session->setFlash('success', "Успешно сохранено.");

                        // TODO: edit file when it will be possible to create new layers
                        return $this->redirect(['publication/view', 'id' => $model->id]);
                    }
                    Yii::$app->session->setFlash('error', "При сохранении произошла ошибка.". print_r($model->errors, true));
                }
            }
        }

        return $this->render('upload', [
            'model' => $model
        ]);
    }

    private function frontendUrl()
    {
        $projectFolder = 'tracingshare';
        if(isset($_SERVER['HTTPS'])){
            $protocol = ($_SERVER['HTTPS'] && $_SERVER['HTTPS'] != "off") ? "https" : "http";
        }
        else{
            $protocol = 'http';
        }
        return $protocol . "://" . $_SERVER['HTTP_HOST'] . "/". $projectFolder ."/frontend/web/index.php";
    }

    private function siteControllerUrl()
    {
        $projectFolder = 'tracingshare';
        if(isset($_SERVER['HTTPS'])){
            $protocol = ($_SERVER['HTTPS'] && $_SERVER['HTTPS'] != "off") ? "https" : "http";
        }
        else{
            $protocol = 'http';
        }
        return $protocol . "://" . $_SERVER['HTTP_HOST'] . "/". $projectFolder ."/backend/web/index.php";
    }
}

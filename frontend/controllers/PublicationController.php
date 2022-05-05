<?php

namespace frontend\controllers;

use common\models\Publication;
use Yii;
use yii\data\Pagination;
use yii\web\Controller;
use yii\web\HttpException;
use yii\web\UploadedFile;

class PublicationController extends Controller
{
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

    public function actionEdit($id)
    {
        $publication = Publication::findOne($id);
        if (empty($publication)) {
            throw new HttpException(404);
        }

        return $this->render('edit', [
            'publication' => $publication,
            /*'categoryId' => $categoryId,
            'objectPrev' => $objectPrev,
            'objectNext' => $objectNext,*/
        ]);
    }

    public function actionCreateLayer($id)
    {
        $publication = Publication::findOne($id);
        /*if (empty($publication)) {
            throw new HttpException(404);
        }*/

        return $this->render('createLayer', [
            'publication' => $publication,
            /*'categoryId' => $categoryId,
            'objectPrev' => $objectPrev,
            'objectNext' => $objectNext,*/
        ]);
    }

    public function actionDelete($id)
    {
        $publication = Publication::findOne($id);
        $publication->deleteFilesFromStorage();
        $publication->delete();
        return $this->goBack();
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
            Yii::$app->session->setFlash('info', "Изменений нет.");
        }
    }

    public function actionSaveLayers($id)
    {
        $data = (!empty($_POST['params'])) ? json_decode($_POST['params'], true) : "empty params";

        $publication = Publication::findOne($id);

        if (strcmp(json_encode($data['newSettings']), "") != 2) {
            $newSettings = json_encode($data['newSettings'], JSON_UNESCAPED_UNICODE);
            $previousSettings = $publication->settings;
            $publication->settings = $newSettings;

            $layersUrls = $data['layersUrls'];
            $fileNames = $data['layersFilesNames'];
            for($i = 0; $i < sizeof($layersUrls); $i++) {
                $imageBase64 = $layersUrls[$i];
                $img0 = str_replace('data:image/png;base64,', '', $imageBase64);
                $img0 = str_replace(' ', '+', $img0);
                var_dump($img0);
                $imageToSave = base64_decode($img0);
                $filePath = Publication::basePath() . '/'
                    . Publication::PREFIX_PATH_DRAWINGS . '/'
                    . $fileNames[$i];
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
                file_put_contents($filePath, $imageToSave);
            }
        }
        //$previousSetingsToArray = ...
        for($i = 0; $i < sizeof($previousSettings.drawings); $i++) {
            $fileName = $previousSettings.drawings[i].image;
            if(!$newSettings.contains($fileName)) {
                $filePath = Publication::basePath() . '/'
                    . Publication::PREFIX_PATH_DRAWINGS . '/'
                    . $fileName;
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }
        }

        if($publication->update(true, ["settings"])) {
            Yii::$app->session->setFlash('success', "Успешно сохранено.");
        }
        else {
            Yii::$app->session->setFlash('info', "Изменений нет.");
        }
    }

    public function actionUploadOriginalImage()
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
                         return $this->redirect(['publication/view', 'id' => $model->id]);
                    }
                    Yii::$app->session->setFlash('error', "При сохранении произошла ошибка.". print_r($model->errors, true));
                }
            }
        }

        return $this->render('uploadOriginalImage', [
            'model' => $model
        ]);
    }

    public function actionUploadDrawings($id)
    {
        $model = Publication::findOne($id);

        if (Yii::$app->request->isPost) {
            if ($model->load(Yii::$app->request->post())) {
                //$model->author_id = Yii::$app->user->getId();
                $model->drawingsFiles = UploadedFile::getInstances($model, 'drawingsFiles');
                //if($model->save()) {
                    if ($model->uploadDrawings()) {
                        $model->settings = $model->updateSettings();
                        var_dump($model->settings);
                        if($model->update(true, ["settings"])) {
                            Yii::$app->session->setFlash('success', "Успешно сохранено.");
                            return $this->redirect(['publication/edit', 'id' => $model->id]);
                        }
                        Yii::$app->session->setFlash('error', "При сохранении произошла ошибка.". print_r($model->errors, true));
                    }
                    Yii::$app->session->setFlash('error', "При сохранении произошла ошибка.". print_r($model->errors, true));
                //}
            }
        }

        return $this->render('uploadDrawings', [
            'model' => $model
        ]);
    }
}

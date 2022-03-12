<?php

namespace frontend\controllers;

use common\models\Petroglyph;
use Yii;
use yii\data\Pagination;
use yii\web\Controller;
use yii\web\HttpException;
use yii\web\UploadedFile;

class PetroglyphController extends Controller
{
    public function actionView($id)
    {
        $petroglyph = Petroglyph::findOne($id);
        if (empty($petroglyph)) {
            throw new HttpException(404);
        }

        return $this->render('view', [
            'petroglyph' => $petroglyph,
            /*'categoryId' => $categoryId,
            'objectPrev' => $objectPrev,
            'objectNext' => $objectNext,*/
        ]);
    }

    public function actionEdit($id)
    {
        $petroglyph = Petroglyph::findOne($id);
        if (empty($petroglyph)) {
            throw new HttpException(404);
        }

        return $this->render('edit', [
            'petroglyph' => $petroglyph,
            /*'categoryId' => $categoryId,
            'objectPrev' => $objectPrev,
            'objectNext' => $objectNext,*/
        ]);
    }

    public function actionDelete($id)
    {
        $petroglyph = Petroglyph::findOne($id);
        $petroglyph->delete();
    }

    public function actionSave()
    {
        $data = (!empty($_POST['params'])) ? json_decode($_POST['params'], true) : "empty params";

        $id = $data["id"];
        echo ("hello");

        $newName = $data["newName"];
        $newDescription = $data["newDescription"];

        $petroglyph = Petroglyph::findOne($id);
        $petroglyph->name = $newName;
        $petroglyph->description = $newDescription;

        if (strcmp(json_encode($data["newSettings"]), "") != 2) {
            $newSettings = json_encode($data["newSettings"]);
            $petroglyph->settings = $newSettings;
        }
        echo strcmp(json_encode($data["newSettings"]), "");
        $petroglyph->update();
    }

    public function actionUpload()
    {
        $model = new Petroglyph();

        if (Yii::$app->request->isPost) {
            if ($model->load(Yii::$app->request->post())) {
                $model->imageFile = UploadedFile::getInstance($model, 'imageFile');
                if ($model->upload()) {
                    Yii::$app->session->setFlash('success', "Успешно сохранено");

                    // TODO: edit file when it will be possible to create new layers
                    return $this->render('view', [
                        'petroglyph' => $model,
                        /*'categoryId' => $categoryId,
                        'objectPrev' => $objectPrev,
                        'objectNext' => $objectNext,*/
                    ]);
                }
            }
            Yii::$app->session->setFlash('error', "При сохраении произошла ошибка.");
        }

        if ($model->load(Yii::$app->request->post())) {

            if ($model->save()) {
                $model->imageFile = UploadedFile::getInstance($model, 'imageFile');
                $model->upload();
                Yii::$app->session->setFlash('success', "Данные внесены");

                return $this->render('edit', [
                    'petroglyph' => $model,
                    /*'categoryId' => $categoryId,
                    'objectPrev' => $objectPrev,
                    'objectNext' => $objectNext,*/
                ]);
            }

            Yii::$app->session->setFlash('error', "Не удалось сохранить изменения<br>" . print_r($model->errors, true));
        }

        return $this->render('upload', [
            'model' => $model
        ]);
    }
}

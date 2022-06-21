<?php
/** @var yii\web\View $this */
/** @var yii\bootstrap4\ActiveForm $form */
/** @var \common\models\Publication $model */

use yii\bootstrap4\Html;
use yii\bootstrap4\ActiveForm;
use mihaildev\ckeditor\CKEditor;

$this->title = 'Редактирование публикации';
?>
<div class="publication-upload-original-image">
    <h3 style="text-align: center;"><?= Html::encode($this->title) ?></h3>
    <div class="row justify-content-center">
        <div class="col-lg-8">

            <?php $form = ActiveForm::begin(['id' => 'form-upload-original-image', 'options' => ['enctype' => 'multipart/form-data']]) ?>
            <?= $form->field($model, 'name')->label("Название:") ?>
            <?= $form->field($model, 'description')->textarea(['rows' => '8'])->label("Описание:")->widget(CKEditor::className(),
                [
                    'editorOptions' => [
                        'preset' => 'standard',
                        'inline' => false,
                    ],
                    'options' => [
                        'allowedContent' => true,
                    ],

                ]) ?>
            <?= $form->field($model, 'imageFile')->fileInput()->label("Новое изображение:") ?>

            <div class="form-group" style="text-align: center;">
                <?= Html::submitButton('Сохранить', ['class' => 'btn btn-outline-primary btn-rounded', 'name' => 'edit-publication-button']) ?>
            </div>
            <?php ActiveForm::end(); ?>
        </div>
    </div>
</div>

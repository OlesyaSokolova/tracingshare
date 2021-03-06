<?php
/** @var yii\web\View $this */
/** @var yii\bootstrap4\ActiveForm $form */
/** @var \common\models\Publication $model */

use yii\bootstrap4\Html;
use yii\bootstrap4\ActiveForm;

$this->title = 'Создание публикации';
?>
<div class="publication-upload">
    <h1 style="text-align: center;"><?= Html::encode($this->title) ?></h1>
    <div class="row justify-content-center">
        <div class="col-lg-5">

            <?php $form = ActiveForm::begin(['id' => 'form-upload', 'options' => ['enctype' => 'multipart/form-data']]) ?>
            <?= $form->field($model, 'name')->label("Название:") ?>
            <?= $form->field($model, 'description')->textarea(['rows' => '6'])->label("Описание:") ?>
            <?= $form->field($model, 'imageFile')->fileInput()->label("Изображение:") ?>
            <div class="form-group" style="text-align: center;">
                <?= Html::submitButton('Сохранить', ['class' => 'btn btn-outline-primary btn-rounded', 'name' => 'upload-button']) ?>
            </div>
            <?php ActiveForm::end(); ?>

        </div>
    </div>
</div>

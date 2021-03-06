<?php
/** @var yii\web\View $this */
/** @var yii\bootstrap4\ActiveForm $form */
/** @var \common\models\Publication $model */

use yii\bootstrap4\Html;
use yii\bootstrap4\ActiveForm;

$this->title = 'Загрузка текстур';
?>
<div class="publication-upload-textures">
    <h3 style="text-align: center;"><?= Html::encode($this->title) ?></h3>
    <div class="row justify-content-center">
        <div class="col-lg-5">

            <?php $form = ActiveForm::begin(['id' => 'form-upload-textures', 'options' => ['enctype' => 'multipart/form-data']]) ?>
            <?= $form->field($model, 'texturesFiles[]')->fileInput(['multiple' => true, 'accept' => 'image/*'])->label("Максимальное моличество файлов: 10") ?>
            <div class="form-group" style="text-align: center;">
                <?= Html::a(Yii::t('app', 'Отмена'),
                    ['/publication/view', 'id' => $model->id],
                    ['class' => 'btn btn-outline-primary btn-rounded',
                        'name' => 'exit-button',]) ?>
                <?= Html::submitButton('Сохранить', ['class' => 'btn btn-outline-primary btn-rounded', 'name' => 'upload-textures-button']) ?>
            </div>
            <?php ActiveForm::end(); ?>

        </div>
    </div>
</div>

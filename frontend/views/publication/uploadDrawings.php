<?php
/** @var yii\web\View $this */
/** @var yii\bootstrap4\ActiveForm $form */
/** @var \common\models\Publication $model */

use yii\bootstrap4\Html;
use yii\bootstrap4\ActiveForm;

$this->title = 'Загрузка слоев прорисовок';
?>
<div class="publication-upload-drawings">
    <h1 style="text-align: center;"><?= Html::encode($this->title) ?></h1>
    <div class="row justify-content-center">
        <div class="col-lg-5">

            <?php $form = ActiveForm::begin(['id' => 'form-upload-drawings', 'options' => ['enctype' => 'multipart/form-data']]) ?>
            <?= $form->field($model, 'drawingsFiles[]')->fileInput(['multiple' => true, 'accept' => 'image/*'])->label("Максимальное моличество файлов: 10") ?>
            <div class="form-group" style="text-align: center;">
                <?= Html::submitButton('Сохранить', ['class' => 'btn btn-outline-primary btn-rounded', 'name' => 'upload-drawings-button']) ?>
            </div>
            <?php ActiveForm::end(); ?>

        </div>
    </div>
</div>

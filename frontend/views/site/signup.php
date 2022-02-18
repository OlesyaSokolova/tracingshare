<?php
/* @var $this yii\web\View */
/* @var $form yii\bootstrap4\ActiveForm */
/* @var $model frontend\models\SignupForm */

use yii\helpers\Html;
use yii\bootstrap4\ActiveForm;

$this->title = 'Регистрация';
?>
<div class="site-signup">
    <h1 style="text-align: center;"><?= Html::encode($this->title) ?></h1>
    <div class="row justify-content-center">
        <div class="col-lg-5">

            <?php $form = ActiveForm::begin(['id' => 'form-signup']) ?>
            <?= $form->field($model, 'email')->label("Email:") ?>
            <?= $form->field($model, 'first_name')->label("Имя:") ?>
            <?= $form->field($model, 'last_name')->label("Фамилия:") ?>
            <?= $form->field($model, 'patronymic')->label("Отчество:") ?>
            <?= $form->field($model, 'password')->passwordInput()->label("Пароль:") ?>
            <div class="form-group" style="text-align: center;">
                <?= Html::submitButton('Зарегистрироваться', ['class' => 'btn btn-outline-primary btn-rounded', 'name' => 'signup-button']) ?>
            </div>
            <?php ActiveForm::end(); ?>

        </div>
    </div>
</div>

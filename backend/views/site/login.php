<?php

/** @var yii\web\View $this */
/** @var yii\bootstrap4\ActiveForm $form */
/** @var \common\models\LoginForm $model */

use yii\bootstrap4\ActiveForm;
use yii\bootstrap4\Html;

$this->title = 'Управление сайтом';
?>
<div class="site-signup" align="center">
    <h1 style="text-align: center;"><?= Html::encode($this->title) ?></h1>
    <h4 style="text-align: center;"><?= Html::encode("Вход возможен только для администратора") ?></h4>
    <div class="row row justify-content-center">
        <div class="col-lg-5">
            <?php $form = ActiveForm::begin(['id' => 'form-login']) ?>
            <?= $form->field($model, 'email')->label("Email:") ?>
            <?=$form->field($model, 'password')->passwordInput()->label("Пароль:") ?>
          <?= $form->field($model, 'rememberMe')->checkbox([
                  'template' => "<div class=\"offset-lg-1 col-lg-3 custom-control custom-checkbox\">{input} {label}</div>\n<div class=\"col-lg-8\">{error}</div>",
              ])->label("Запомнить меня"); ?>

            <div class="form-group" style="text-align: center;">
                <div class="offset-lg-1 col-lg-11">
                    <?= Html::submitButton('Войти', ['class' => 'btn btn-outline-primary btn-rounded', 'name' => 'login-button']) ?>
                </div>
            </div>

            <?php ActiveForm::end(); ?>

        </div>
    </div>
</div>

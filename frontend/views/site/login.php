<?php

/** @var yii\web\View $this */
/** @var yii\bootstrap4\ActiveForm $form */
/** @var \common\models\LoginForm $model */

use yii\bootstrap4\Html;
use yii\bootstrap4\ActiveForm;

$this->title = 'Вход';
?>
<div class="site-signup" align="center">
    <h1 style="text-align: center;"><?= Html::encode($this->title) ?></h1>
    <div class="row row justify-content-center">
        <div class="col-lg-5">
            <?php $form = ActiveForm::begin(['id' => 'form-login']) ?>
            <?= $form->field($model, 'email')->label("Email:") ?>
            <?=$form->field($model, 'password')->passwordInput()->label("Пароль:") ?>
            <?= $form->field($model, 'rememberMe')->checkbox([
                'template' => "<div class=\"offset-lg-1 col-lg-3 custom-control custom-checkbox\">{input} {label}</div>\n<div class=\"col-lg-8\">{error}</div>",
            ])->label("Запомнить меня"); ?>

            <div style="color:#999;margin:1em 0">
                Если Вы забыли пароль, Вы можете его <?= Html::a('сбросить', ['site/request-password-reset']) ?>.
                <br><br>
                Необходимо новое письмо для подтверждения регистрации? <?= Html::a('Отправить письмо ещё раз', ['site/resend-verification-email']) ?>
            </div>

            <div class="form-group" style="text-align: center;">
                <div class="offset-lg-1 col-lg-11">
                    <?= Html::submitButton('Войти', ['class' => 'btn btn-outline-primary btn-rounded', 'name' => 'login-button']) ?>
                </div>
            </div>

            <?php ActiveForm::end(); ?>

        </div>
    </div>
</div>

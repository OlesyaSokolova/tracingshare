<?php

use yii\bootstrap4\ActiveForm;
use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model common\models\User */

$this->params['breadcrumbs'][] = ['label' => 'Пользователи', 'url' => ['index']];
$this->title = 'Редактировать пользователя';
//$model->role = 'author';
?>
<div class="user-update">
    <h3 style="text-align: center;"><?= Html::encode($this->title) ?></h3>
    <div class="row justify-content-center">
        <div class="col-lg-5">

            <?php $form = ActiveForm::begin(['id' => 'form-create']) ?>
            <?= $form->field($model, 'email')->label("Email:")->textInput() ?>
            <?= $form->field($model, 'first_name')->label("Имя:")->textInput() ?>
            <?= $form->field($model, 'last_name')->label("Фамилия:")->textInput() ?>
            <?= $form->field($model, 'patronymic')->label("Отчество:")->textInput() ?>
            <?= $form->field($model, 'password')->passwordInput()->label("Пароль:") ?>
             <!--$form->field($model, 'role')->label('Роль:')->radioList([
                'author' =>'Автор: может создавать и редактировать свои публикации.',
                'admin' =>'Администратор: может создавать и редактировать все публикации, управлять пользователями.',
            ])-->

            <div class="form-group" style="text-align: center;">
                <?= Html::submitButton('Сохранить', ['class' => 'btn btn-outline-primary btn-rounded', 'name' => 'update-button']) ?>
            </div>
            <?php ActiveForm::end(); ?>

        </div>
    </div>
</div>


<?php
/** @var yii\web\View $this */
/** @var yii\bootstrap4\ActiveForm $form */
/** @var \backend\models\CreateUserForm $model */

use yii\bootstrap4\Html;
use yii\bootstrap4\ActiveForm;
$this->params['breadcrumbs'][] = ['label' => 'Пользователи', 'url' => ['index']];
$this->title = 'Создание пользователя';
$model->role = 'author';
?>
<div class="user-create">
    <h1 style="text-align: center;"><?= Html::encode($this->title) ?></h1>
    <div class="row justify-content-center">
        <div class="col-lg-5">

            <?php $form = ActiveForm::begin(['id' => 'form-create']) ?>
            <?= $form->field($model, 'email')->label("Email:") ?>
            <?= $form->field($model, 'first_name')->label("Имя:") ?>
            <?= $form->field($model, 'last_name')->label("Фамилия:") ?>
            <?= $form->field($model, 'patronymic')->label("Отчество:") ?>
            <?= $form->field($model, 'password')->passwordInput()->label("Пароль:") ?>
            <?= $form->field($model, 'role')->label('Роль:')->radioList([
                'author' =>'Автор: может создавать и редактировать свои публикации.',
                'admin' =>'Администратор: может создавать и редактировать все публикации, управлять пользователями.',
    ]) ?>

            <div class="form-group" style="text-align: center;">
                <?= Html::submitButton('Сохранить', ['class' => 'btn btn-outline-primary btn-rounded', 'name' => 'create-button']) ?>
            </div>
            <?php ActiveForm::end(); ?>

        </div>
    </div>
</div>

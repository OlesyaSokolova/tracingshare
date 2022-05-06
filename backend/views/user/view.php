<?php

use common\models\User;
use yii\helpers\Html;
use yii\widgets\DetailView;

/* @var $this yii\web\View */
/* @var $model common\models\User */

/*$this->params['breadcrumbs'][] = ['label' => 'Пользователи', 'url' => ['index']];*/
$this->title = "Пользователь: ". $model->last_name.' '. $model->first_name.' '.$model->patronymic ;
\yii\web\YiiAsset::register($this);

?>
<div class="user-view">

    <h3><?= Html::encode($this->title) ?></h3>

    <p>
        <?= Html::a('Редактировать', ['update', 'id' => $model->id], ['class' => 'btn btn-outline-primary btn-rounded']) ?>
        <?= Html::a('Удалить', ['delete', 'id' => $model->id], [
            'class' => 'btn btn-outline-danger btn-rounded',
            'data' => [
                'confirm' => 'Вы уверены, что хотите удалить этого пользователя? Отменить это дейтсвие будет невозможно.',
                'method' => 'post',
            ],
        ]) ?>
    </p>

    <?= DetailView::widget([
        'model' => $model,
        'attributes' => [
            'id',
            [
                'label' => 'Фамилия',
                'attribute' => 'last_name',
            ],
            [
                'label' => 'Имя',
                'attribute' => 'first_name',
            ],
            [
                'label' => 'Отчество',
                'attribute' => 'patronymic',
            ],
            'email',
            [
                'label' => 'Статус',
                'value' =>  User::getStatuses()[$model->status],
            ],
            //'auth_key',
            //'password_hash',
            //'password_reset_token',
            //'email_confirm_token:email',
            //'status',
            /*[
                'attribute' => 'created_at',
                'format' => ['date', 'php:Y-m-d']
            ],*/
            [
                'label' => 'Дата создания',
                'value' => date("Y-m-d H:i:s", $model->created_at),
            ],
            [
                'label' => 'Дата редактирования',
                'value' => date("Y-m-d H:i:s", $model->updated_at),
            ],
            [
                'label' => 'Роль',
                'value' => User::getRoleTitle($model->id),
                //'attribute' => 'patronymic',
            ],
            //'verification_token',
        ],
    ]) ?>

</div>

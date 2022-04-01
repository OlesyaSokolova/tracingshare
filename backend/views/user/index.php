<?php

use common\models\User;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\grid\ActionColumn;
use yii\grid\GridView;

/* @var $this yii\web\View */
/* @var $searchModel backend\models\user\UserSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Пользователи';
?>
<div class="user-index">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Создать пользователя', ['create'], ['class' => 'btn btn-outline-primary btn-rounded']) ?>
    </p>

    <?=
    GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,
        'columns' => [
            ['class' => 'yii\grid\SerialColumn'],

            //'id',
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
            //'auth_key',
            //'password_hash',
            //'password_reset_token',
            //'email_confirm_token:email',
            //'status',
            /*[
                'attribute' => 'created_at',
                'format' => ['date', 'php:Y-m-d']
            ],*/
            //'created_at:datetime', // shortcut format
            //'updated_at:datetime', // shortcut format
            /*[
                'label' => 'Роль',
                'value' => User::getRole($searchModel->id),
                //'attribute' => 'patronymic',
            ],*/
            //'verification_token',
            [
                'class' => ActionColumn::className(),
                'urlCreator' => function ($action, User $model, $key, $index, $column) {
                    return Url::toRoute([$action, 'id' => $model->id]);
                 }
            ],
        ],
    ]); ?>


</div>

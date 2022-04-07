<?php

use common\models\Publication;
use yii\helpers\Html;
use yii\helpers\Url;
use yii\grid\ActionColumn;
use yii\grid\GridView;

/* @var $this yii\web\View */
/* @var $searchModel backend\models\publication\PublicationSearch */
/* @var $dataProvider yii\data\ActiveDataProvider */

$this->title = 'Публикации'; ?>
<div class="publication-index">

    <h1><?= Html::encode($this->title) ?></h1>

    <p>
        <?= Html::a('Создать публикацию', ['upload'], ['class' => 'btn btn-outline-primary btn-rounded']) ?>
    </p>

    <?php // echo $this->render('_search', ['model' => $searchModel]); ?>

    <?= GridView::widget([
        'dataProvider' => $dataProvider,
        'filterModel' => $searchModel,

        'columns' => [
            ['class' => 'yii\grid\SerialColumn',
            ],

            [
                'label' => 'Название',
                'attribute' => 'name',
            ],
            [
                'label' => 'Автор',
                'attribute' => 'author_id',
                'value' => function ($model) {
                    return $model->getAuthorName();
                }
            ],
            [
                'label' => 'Описание',
                'attribute' => 'description',
                'headerOptions' => ['style' => 'width:20%'],
            ],
            [
                'attribute' => 'image',
                'format' => 'html',
                'label' => 'Изображение',
                'value' => function ($data) {
                    return Html::img(Publication::getStorageHttpPath() . Publication::PREFIX_PATH_THUMBNAILS . '/' . Publication::THUMBNAIL_PREFIX . $data['image'],
                        ['width' => '300px']);
                },
            ],
            [
                'attribute' => 'settings',
                'label' => 'Информация о слоях',
                'value' => function ($data) {
                       $tmp = $data['settings'];
                        if($tmp != '') {
                            $obj = json_decode($tmp, true);
                            return "Количество слоев прорисовок: " . sizeof($obj['drawings']);
                        }
                        else return "1 слой (оригинальное изображение)";
                },
            ],
            [
                'class' => ActionColumn::className(),
                'urlCreator' => function ($action, Publication $model, $key, $index, $column) {
                    return Url::toRoute([$action, 'id' => $model->id]);
                 }
            ],
        ],
    ]); ?>


</div>
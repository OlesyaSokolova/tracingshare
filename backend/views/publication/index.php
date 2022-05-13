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

    <h3><?= Html::encode($this->title) ?></h3>

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
                'attribute' => 'description',
                'label' => 'Описание',
                'value' => function ($data) {
                    $tmp = $data['description'];
                    if($tmp != '') {
                        return "(Есть)";
                    }
                    else return "(Нет)";
                },
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
                'attribute' => 'drawings',
                'label' => 'Количество слоев прорисовок',
                'value' => function ($data) {
                       $tmp = $data['drawings'];
                        if($tmp != '') {
                            $obj = json_decode($tmp, true);
                            $counter = sizeof($obj['drawings']);
                            if($counter > 0) {
                                return $counter;
                            }
                            else {
                                return 0;
                            }
                        }
                        else return 0;
                },
            ],
            [
                'attribute' => 'textures',
                'label' => 'Количество текстур',
                'value' => function ($data) {
                    $tmp = $data['textures'];
                    if($tmp != '') {
                        $obj = json_decode($tmp, true);
                        $counter = sizeof($obj['textures']);
                        if($counter > 0) {
                            return $counter;
                        }
                        else {
                            return 0;
                        }
                    }
                    else return 0;
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
